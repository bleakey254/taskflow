'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role, TaskStatus, PaymentPurpose, PaymentStatus } from '@/types/prisma';

// Initiate task unlock payment (M-Pesa STK push simulation)
export async function initiateTaskUnlockPayment(
  prevState: unknown | undefined,
  formData: FormData
): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
  'use server';

  try {
    // Require authentication and WORKER role
    const user = await requireAuth();
    await requireRole([Role.WORKER]);

    const taskId = formData.get('taskId') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    // Basic validation
    if (!taskId || !phoneNumber) {
      return { success: false, error: 'Task ID and phone number are required' };
    }

    // Validate phone number format (basic check)
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return { success: false, error: 'Please enter a valid phone number' };
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        budget: true,
        status: true,
      },
    });

    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    // Check if task is available for unlocking
    const unlockableStatuses = [TaskStatus.PUBLISHED, TaskStatus.VIEWED, TaskStatus.UNLOCKED];
    if (!unlockableStatuses.includes(task.status)) {
      return { success: false, error: 'This task is not available for unlocking' };
    }

    // Check if worker already unlocked this task
    const existingUnlock = await prisma.taskUnlock.findFirst({
      where: {
        taskId,
        workerId: user.id,
      },
    });

    if (existingUnlock) {
      return { success: false, error: 'You have already unlocked this task' };
    }

    // In a real implementation, this is where we would:
    // 1. Create a payment record with status PENDING
    // 2. Initiate M-Pesa STK push to the phone number
    // 3. Return success with instructions for user to complete payment on their phone
    // 4. Set up a webhook endpoint to handle the M-Pesa callback

    // For now, we'll simulate immediate successful payment
    // In production, this would be asynchronous

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        taskId: task.id,
        amount: 0.80, // Fixed unlock fee
        currency: 'USD',
        purpose: PaymentPurpose.TASK_UNLOCK,
        provider: 'MPESA',
        // In a real implementation, these would come from the M-Pesa response
        providerTransactionId: `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        internalTransactionId: `INT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: PaymentStatus.SUCCEEDED, // Simulating immediate success
        idempotencyKey: `${user.id}_${taskId}_${Date.now()}`,
        metadata: {
          phoneNumber,
          initiatedAt: new Date().toISOString(),
        },
      },
    });

    // Create task unlock record
    await prisma.taskUnlock.create({
      data: {
        taskId: task.id,
        workerId: user.id,
        paymentId: payment.id,
      },
    });

    // Update task status if it was VIEWED (now unlocked)
    if (task.status === TaskStatus.VIEWED) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.UNLOCKED },
      });
    }

    // Redirect to task details page
    return {
      success: true,
      redirectUrl: `/worker/tasks/${taskId}`
    };
  } catch (error) {
    console.error('Payment initiation error:', error);
    return { success: false, error: 'An error occurred while processing payment' };
  }
}

// Webhook handler for M-Pesa callbacks (would be in api route in real implementation)
export async function handleMpesaCallback(
  requestData: any
): Promise<{ success: boolean }> {
  'use server';

  try {
    // In a real implementation, this would:
    // 1. Validate the callback signature/authenticity
    // 2. Extract transaction details from the callback
    // 3. Find the corresponding payment record using providerTransactionId or metadata
    // 4. Update payment status based on callback result
    // 5. If successful, create task unlock record
    // 6. Update task status if needed
    // 7. Create wallet transaction for the unlock fee (revenue for platform)

    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return { success: false };
  }
}