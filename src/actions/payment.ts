'use server';

import { randomUUID } from 'crypto';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { UNLOCK_FEE, CURRENCY } from '@/lib/constants';
import { isPaymentSimulationEnabled } from '@/lib/payments';
import {
  Role,
  TaskStatus,
  PaymentPurpose,
  PaymentStatus,
  NotificationType,
} from '@/types/prisma';

const UNLOCKABLE_STATUSES = [
  TaskStatus.PUBLISHED,
  TaskStatus.VIEWED,
  TaskStatus.UNLOCKED,
  TaskStatus.IN_PROGRESS,
];

export type UnlockPaymentResult = { success: boolean; error?: string; redirectUrl?: string };

// Initiate task unlock payment
export async function initiateTaskUnlockPayment(
  prevState: unknown | undefined,
  formData: FormData
): Promise<UnlockPaymentResult> {
  'use server';

  const user = await requireRole([Role.WORKER]);

  const taskId = formData.get('taskId') as string | null;
  const phoneNumber = (formData.get('phoneNumber') as string | null)?.trim();

  if (!taskId || !phoneNumber) {
    return { success: false, error: 'Task ID and phone number are required' };
  }

  // Validate phone number format (basic E.164 check)
  if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
    return { success: false, error: 'Please enter a valid phone number' };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, budget: true, status: true },
  });

  if (!task) {
    return { success: false, error: 'Task not found' };
  }

  if (!UNLOCKABLE_STATUSES.includes(task.status as TaskStatus)) {
    return { success: false, error: 'This task is not available for unlocking' };
  }

  const existingUnlock = await prisma.taskUnlock.findFirst({
    where: { taskId, workerId: user.id },
  });

  if (existingUnlock) {
    return { success: false, error: 'You have already unlocked this task' };
  }

  if (!isPaymentSimulationEnabled()) {
    // Without a provider integration there is no charge to make, so refuse
    // instead of marking an unpaid unlock as successful.
    return {
      success: false,
      error: 'M-Pesa checkout is not configured in this deployment yet. No charge was made.',
    };
  }

  // Deterministic key: retries and double submits collapse onto one payment.
  const idempotencyKey = `${user.id}:${taskId}:unlock`;

  try {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          taskId: task.id,
          amount: UNLOCK_FEE,
          currency: CURRENCY,
          purpose: PaymentPurpose.TASK_UNLOCK,
          provider: 'MPESA',
          providerTransactionId: `MPESA_SIM_${randomUUID()}`,
          internalTransactionId: `INT_${randomUUID()}`,
          status: PaymentStatus.SUCCEEDED,
          idempotencyKey,
          metadata: {
            phoneNumber,
            simulated: true,
            simulatedAt: new Date().toISOString(),
          },
        },
      });

      await tx.taskUnlock.create({
        data: {
          taskId: task.id,
          workerId: user.id,
          paymentId: payment.id,
          status: TaskStatus.UNLOCKED,
        },
      });

      await tx.notification.create({
        data: {
          recipientId: user.id,
          type: NotificationType.SYSTEM_UPDATE,
          title: 'Task unlocked',
          message: `You unlocked a task for $${UNLOCK_FEE.toFixed(2)} (development simulation, no money moved).`,
          relatedEntityType: 'Task',
          relatedEntityId: task.id,
        },
      });
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'You have already unlocked this task' };
    }
    return { success: false, error: 'An error occurred while processing payment' };
  }

  return { success: true, redirectUrl: `/worker/tasks/${taskId}` };
}
