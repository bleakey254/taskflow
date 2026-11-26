import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role, TaskStatus, SubmissionStatus, WithdrawalStatus } from '@/types/prisma';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';

export const metadata = {
  title: 'Live Metrics - TaskFlow Admin',
  description: 'Live platform counts straight from the database',
};

export default async function LiveMetricsPage() {
  const admin = await requireRole([Role.ADMIN]);

  const [
    users,
    activeSessions,
    tasks,
    liveTasks,
    completedTasks,
    pendingSubmissions,
    pendingWithdrawals,
    unreadNotifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: { in: [TaskStatus.PUBLISHED, TaskStatus.VIEWED, TaskStatus.UNLOCKED] } } }),
    prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
    prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
    prisma.withdrawal.count({ where: { status: WithdrawalStatus.PENDING } }),
    prisma.notification.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell userName={admin.name} title="Live Metrics" description="Counts read directly from the database on every load">
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Users"
          value={users}
          icon={<span className="material-symbols-outlined text-[24px]">group</span>}
          iconColor="primary"
          subtitle={`${activeSessions} active sessions`}
        />
        <DataCard
          title="Tasks"
          value={tasks}
          icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
          iconColor="secondary"
          subtitle={`${liveTasks} live · ${completedTasks} completed`}
        />
        <DataCard
          title="Pending reviews"
          value={pendingSubmissions}
          icon={<span className="material-symbols-outlined text-[24px]">rate_review</span>}
          iconColor="tertiary"
        />
        <DataCard
          title="Pending withdrawals"
          value={pendingWithdrawals}
          icon={<span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>}
          iconColor="error"
        />
      </StatGrid>

      <div className="mt-space-xl">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Notification backlog" subtitle="Unread notifications across all accounts" />
          <CardContent>
            <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold">
              {unreadNotifications}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              These clear automatically as recipients open their inbox.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
