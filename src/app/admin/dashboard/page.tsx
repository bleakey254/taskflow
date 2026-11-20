import { getAdminStats } from '@/actions/admin';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard - TaskFlow',
  description: 'Overview of platform statistics',
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  await requireRole([Role.ADMIN]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = await getAdminStats();

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} />
        </>
      }
      title="Admin Dashboard"
      description="Platform overview and statistics"
    >
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">people</span>}
          iconColor="primary"
          subtitle={`${stats.activeUsers} active`}
          trend={{ value: '+12%', positive: true }}
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
          subtitle={`${stats.pendingApprovalTasks} pending`}
          trend={{ value: '+8%', positive: true }}
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
          title="Disputes"
          value={stats.totalDisputes.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">gavel</span>}
          iconColor="tertiary"
          subtitle={`${stats.openDisputes} open`}
          trend={{ value: '-5%', positive: true }}
        />
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Withdrawals"
          value={stats.totalWithdrawals.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>}
          iconColor="primary"
          subtitle={`${stats.pendingWithdrawals} pending`}
        />
        <DataCard
          title="Completed Withdrawals"
          value={stats.completedWithdrawals.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">check_circle</span>}
          iconColor="secondary"
        />
        <DataCard
          title="Failed Withdrawals"
          value={stats.failedWithdrawals.toLocaleString()}
          icon={<span className="material-symbols-outlined text-[24px]">error</span>}
          iconColor="error"
        />
        <DataCard
          title="Platform Health"
          value="99.9%"
          icon={<span className="material-symbols-outlined text-[24px]">monitor_heart</span>}
          iconColor="secondary"
          subtitle="Avg. 120ms response"
          variant="highlight"
        />
      </div>

      <div className="mt-space-xl">
        <Card variant="elevated" padding="lg">
          <CardHeader
            title="Financial Overview"
            action={<Button variant="ghost" size="sm">View Details</Button>}
          />
          <CardContent>
            <div className="grid gap-gutter sm:grid-cols-2">
              <DataCard
                title="Total Volume"
                value="$0.00"
                icon={<span className="material-symbols-outlined text-[24px]">attach_money</span>}
                iconColor="secondary"
              />
              <DataCard
                title="Pending Payouts"
                value="$0.00"
                icon={<span className="material-symbols-outlined text-[24px]">pending</span>}
                iconColor="tertiary"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2">
        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/all-tasks'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">All Tasks</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Manage and review all platform tasks</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/workers'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">engineering</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Workers</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Manage worker accounts and verification</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/clients'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[24px]">business</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Clients</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Manage client accounts and billing</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/withdrawals'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Withdrawals</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Review and process withdrawal requests</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}