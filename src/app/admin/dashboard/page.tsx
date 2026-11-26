import { getAdminStats } from '@/actions/admin';
import { requireRole } from '@/lib/middleware/auth';
import { formatMoney } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import { LinkButton } from '@/components/layout';

export const metadata = {
  title: 'Admin Dashboard - TaskFlow',
  description: 'Overview of platform statistics',
};

export default async function AdminDashboardPage() {
  const user = await requireRole([Role.ADMIN]);
  const stats = await getAdminStats();

  return (
    <AdminShell userName={user.name} title="Admin Dashboard" description="Platform overview and statistics">
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">people</span>}
          iconColor="primary"
          subtitle={`${stats.activeUsers} active`}
        />
        <DataCard
          title="Total Workers"
          value={stats.totalWorkers.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">engineering</span>}
          iconColor="secondary"
        />
        <DataCard
          title="Total Clients"
          value={stats.totalClients.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">business</span>}
          iconColor="tertiary"
        />
        <DataCard
          title="Tasks Completed"
          value={stats.completedTasks.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
          iconColor="primary"
          subtitle={`${stats.pendingApprovalTasks} awaiting publication`}
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Submissions"
          value={stats.totalSubmissions.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">assignment</span>}
          iconColor="secondary"
          subtitle={`${stats.pendingSubmissions} pending review`}
        />
        <DataCard
          title="Approved Submissions"
          value={stats.approvedSubmissions.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">check_circle</span>}
          iconColor="secondary"
        />
        <DataCard
          title="Rejected Submissions"
          value={stats.rejectedSubmissions.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">cancel</span>}
          iconColor="error"
        />
        <DataCard
          title="Open Disputes"
          value={stats.openDisputes.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">gavel</span>}
          iconColor="tertiary"
          subtitle={`${stats.totalDisputes} total`}
        />
      </div>

      <div className="mt-space-xl">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Financial Overview" />
          <CardContent>
            <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
              <DataCard
                title="Completed Task Volume"
                value={formatMoney(stats.completedVolume)}
                icon={<span className="material-symbols-outlined text-[24px]">attach_money</span>}
                iconColor="secondary"
              />
              <DataCard
                title="Unlock Revenue"
                value={formatMoney(stats.unlockRevenue)}
                icon={<span className="material-symbols-outlined text-[24px]">lock_open</span>}
                iconColor="primary"
              />
              <DataCard
                title="Worker Earnings Paid"
                value={formatMoney(stats.earningsPaid)}
                icon={<span className="material-symbols-outlined text-[24px]">payments</span>}
                iconColor="secondary"
              />
              <DataCard
                title="Pending Payouts"
                value={formatMoney(stats.pendingPayouts)}
                icon={<span className="material-symbols-outlined text-[24px]">pending</span>}
                iconColor="tertiary"
                subtitle={`${stats.pendingWithdrawals} withdrawal${stats.pendingWithdrawals === 1 ? '' : 's'} to settle`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        <Card variant="elevated" padding="lg" hover>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Withdrawals</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 mb-space-md">
            {stats.pendingWithdrawals} pending · {stats.completedWithdrawals} completed · {stats.failedWithdrawals} failed
          </p>
          <LinkButton href="/admin/withdrawals" size="sm">Settle withdrawals</LinkButton>
        </Card>
        <Card variant="elevated" padding="lg" hover>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Tasks</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 mb-space-md">
            {stats.totalTasks} posted across the platform
          </p>
          <LinkButton href="/admin/all-tasks" size="sm" variant="secondary">All tasks</LinkButton>
        </Card>
        <Card variant="elevated" padding="lg" hover>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Accounts</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 mb-space-md">
            {stats.activeSessions} active session{stats.activeSessions === 1 ? '' : 's'}
          </p>
          <LinkButton href="/admin/workers" size="sm" variant="tertiary">Manage workers</LinkButton>
        </Card>
      </div>
    </AdminShell>
  );
}
