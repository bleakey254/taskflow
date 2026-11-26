'use server';

import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import {
  Role,
  UserStatus,
  TaskStatus,
  SubmissionStatus,
  WithdrawalStatus,
  DisputeStatus,
  NotificationType,
} from '@/types/prisma';

async function requireAdmin() {
  return requireRole([Role.ADMIN]);
}

// Get admin dashboard statistics
export async function getAdminStats() {
  'use server';

  await requireAdmin();

  const [
    totalUsers,
    activeUsers,
    totalTasks,
    pendingApprovalTasks,
    completedTasks,
    totalWorkers,
    totalClients,
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    totalWithdrawals,
    pendingWithdrawals,
    completedWithdrawals,
    failedWithdrawals,
    totalDisputes,
    openDisputes,
    completedVolume,
    unlockRevenue,
    pendingPayouts,
    earningsPaid,
    activeSessions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: TaskStatus.SUBMITTED_FOR_APPROVAL } }),
    prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
    prisma.user.count({ where: { role: Role.WORKER } }),
    prisma.user.count({ where: { role: Role.CLIENT } }),
    prisma.submission.count(),
    prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
    prisma.submission.count({ where: { status: SubmissionStatus.APPROVED } }),
    prisma.submission.count({ where: { status: SubmissionStatus.REJECTED } }),
    prisma.withdrawal.count(),
    prisma.withdrawal.count({ where: { status: WithdrawalStatus.PENDING } }),
    prisma.withdrawal.count({ where: { status: WithdrawalStatus.COMPLETED } }),
    prisma.withdrawal.count({ where: { status: WithdrawalStatus.FAILED } }),
    prisma.dispute.count(),
    prisma.dispute.count({ where: { status: DisputeStatus.OPEN } }),
    prisma.task.aggregate({ where: { status: TaskStatus.COMPLETED }, _sum: { budget: true } }),
    prisma.payment.aggregate({ where: { status: 'SUCCEEDED', purpose: 'TASK_UNLOCK' }, _sum: { amount: true } }),
    prisma.withdrawal.aggregate({ where: { status: WithdrawalStatus.PENDING }, _sum: { amount: true } }),
    prisma.walletTransaction.aggregate({ where: { type: 'TASK_EARNING' }, _sum: { amount: true } }),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
  ]);

  const money = (value: { toString(): string } | null | undefined) =>
    Number(value?.toString() ?? 0);

  return {
    totalUsers,
    activeUsers,
    totalTasks,
    pendingApprovalTasks,
    completedTasks,
    totalWorkers,
    totalClients,
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    totalWithdrawals,
    pendingWithdrawals,
    completedWithdrawals,
    failedWithdrawals,
    totalDisputes,
    openDisputes,
    completedVolume: money(completedVolume._sum.budget),
    unlockRevenue: money(unlockRevenue._sum.amount),
    pendingPayouts: money(pendingPayouts._sum.amount),
    earningsPaid: money(earningsPaid._sum.amount),
    activeSessions,
  };
}

// Approve or reject a withdrawal. Rejecting refunds the debited amount.
export async function settleWithdrawal(formData: FormData): Promise<void> {
  'use server';

  const admin = await requireAdmin();

  const withdrawalId = formData.get('withdrawalId') as string | null;
  const decision = formData.get('decision') as string | null;
  const reason = (formData.get('reason') as string | null)?.trim() ?? '';

  if (!withdrawalId || !['approve', 'reject'].includes(decision ?? '')) {
    throw new Error('Withdrawal id and a valid decision are required');
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
    include: { wallet: true },
  });

  if (!withdrawal) {
    throw new Error('Withdrawal not found');
  }

  if (withdrawal.status !== WithdrawalStatus.PENDING) {
    throw new Error('Only pending withdrawals can be settled');
  }

  const approving = decision === 'approve';
  const amount = Number(withdrawal.amount.toString());

  try {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, status: WithdrawalStatus.PENDING },
        data: {
          status: approving ? WithdrawalStatus.COMPLETED : WithdrawalStatus.FAILED,
          failureReason: approving ? null : reason || 'Rejected by an administrator',
        },
      });

      if (claimed.count === 0) {
        throw new Error('Only pending withdrawals can be settled');
      }

      if (!approving) {
        // The balance was debited when the request was made; give it back.
        await tx.wallet.update({
          where: { id: withdrawal.walletId },
          data: { balance: { increment: withdrawal.amount } },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: withdrawal.walletId,
            type: 'REFUND',
            amount: withdrawal.amount,
            referenceId: withdrawal.id,
            referenceType: 'Withdrawal',
            metadata: { reason: reason || 'Withdrawal rejected' },
          },
        });
      }

      await tx.notification.create({
        data: {
          recipientId: withdrawal.wallet.workerId,
          type: approving ? NotificationType.WITHDRAWAL_SUCCESS : NotificationType.WITHDRAWAL_FAILURE,
          title: approving ? 'Withdrawal approved' : 'Withdrawal rejected',
          message: approving
            ? `Your withdrawal of $${amount.toFixed(2)} was approved.`
            : `Your withdrawal of $${amount.toFixed(2)} was rejected and the amount was returned to your wallet.`,
          relatedEntityType: 'Withdrawal',
          relatedEntityId: withdrawal.id,
        },
      });

      await tx.adminAction.create({
        data: {
          actorId: admin.id,
          action: approving ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED',
          entityType: 'Withdrawal',
          entityId: withdrawal.id,
          metadata: { amount, reason },
        },
      });
    });
  } catch (error) {
    console.error('Withdrawal settlement error:', error);
    if (error instanceof Error && error.message.startsWith('Only pending')) {
      throw error;
    }
    throw new Error('Could not settle this withdrawal');
  }
}

// Activate, suspend or deactivate a user account.
export async function setUserStatus(formData: FormData): Promise<void> {
  'use server';

  const admin = await requireAdmin();

  const userId = formData.get('userId') as string | null;
  const status = formData.get('status') as UserStatus | null;

  if (!userId || !status) {
    throw new Error('User id and status are required');
  }

  if (![UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED].includes(status)) {
    throw new Error('Invalid account status');
  }

  if (userId === admin.id) {
    throw new Error('You cannot change your own account status');
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true } });
  if (!user) {
    throw new Error('User not found');
  }

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { status } }),
      prisma.adminAction.create({
        data: {
          actorId: admin.id,
          action: 'USER_UPDATED',
          entityType: 'User',
          entityId: user.id,
          metadata: { status },
        },
      }),
    ]);
  } catch (error) {
    console.error('User status update error:', error);
    throw new Error('Could not update this account');
  }
}

// Publish a task that a client submitted for approval.
export async function publishSubmittedTask(formData: FormData): Promise<void> {
  'use server';

  const admin = await requireAdmin();
  const taskId = formData.get('taskId') as string | null;

  if (!taskId) {
    throw new Error('Task id is required');
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new Error('Task not found');
  }

  if (![TaskStatus.SUBMITTED_FOR_APPROVAL, TaskStatus.DRAFT].includes(task.status as TaskStatus)) {
    throw new Error('Only draft or submitted tasks can be published');
  }

  try {
    await prisma.$transaction([
      prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.PUBLISHED, publishedAt: new Date(), approvedAt: new Date() },
      }),
      prisma.adminAction.create({
        data: {
          actorId: admin.id,
          action: 'TASK_PUBLISHED',
          entityType: 'Task',
          entityId: task.id,
          metadata: { from: task.status },
        },
      }),
    ]);
  } catch (error) {
    console.error('Task publish error:', error);
    throw new Error('Could not publish this task');
  }
}
