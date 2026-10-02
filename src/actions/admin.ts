'use server';

import { getCurrentUser } from '@/lib/middleware/auth';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus, TaskStatus, SubmissionStatus, WithdrawalStatus, DisputeStatus } from '@/types/prisma';

// Get admin dashboard statistics
export async function getAdminStats() {
  'use server';

  try {
    const user = await requireAuth();
    await requireRole([Role.ADMIN]);

    // Get various statistics for the admin dashboard
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
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users
      prisma.user.count({
        where: { status: UserStatus.ACTIVE },
      }),

      // Total tasks
      prisma.task.count(),

      // Tasks pending approval
      prisma.task.count({
        where: { status: TaskStatus.SUBMITTED_FOR_APPROVAL },
      }),

      // Completed tasks
      prisma.task.count({
        where: { status: TaskStatus.COMPLETED },
      }),

      // Total workers
      prisma.user.count({
        where: { role: Role.WORKER },
      }),

      // Total clients
      prisma.user.count({
        where: { role: Role.CLIENT },
      }),

      // Total submissions
      prisma.submission.count(),

      // Pending submissions
      prisma.submission.count({
        where: { status: SubmissionStatus.PENDING },
      }),

      // Approved submissions
      prisma.submission.count({
        where: { status: SubmissionStatus.APPROVED },
      }),

      // Rejected submissions
      prisma.submission.count({
        where: { status: SubmissionStatus.REJECTED },
      }),

      // Total withdrawals
      prisma.withdrawal.count(),

      // Pending withdrawals
      prisma.withdrawal.count({
        where: { status: WithdrawalStatus.PENDING },
      }),

      // Completed withdrawals
      prisma.withdrawal.count({
        where: { status: WithdrawalStatus.COMPLETED },
      }),

      // Failed withdrawals
      prisma.withdrawal.count({
        where: { status: WithdrawalStatus.FAILED },
      }),

      // Total disputes
      prisma.dispute.count(),

      // Open disputes
      prisma.dispute.count({
        where: { status: DisputeStatus.OPEN },
      }),
    ]);

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
    };
  } catch (error) {
    console.error('Get admin stats error:', error);
    // Return default values in case of error
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalTasks: 0,
      pendingApprovalTasks: 0,
      completedTasks: 0,
      totalWorkers: 0,
      totalClients: 0,
      totalSubmissions: 0,
      pendingSubmissions: 0,
      approvedSubmissions: 0,
      rejectedSubmissions: 0,
      totalWithdrawals: 0,
      pendingWithdrawals: 0,
      completedWithdrawals: 0,
      failedWithdrawals: 0,
      totalDisputes: 0,
      openDisputes: 0,
    };
  }
}