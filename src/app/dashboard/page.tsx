import { getCurrentUser } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import { Badge } from '@/components/layout';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const isWorker = user.role === Role.WORKER;
  const isClient = user.role === Role.CLIENT;

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance="$245.50" />
        </>
      }
      title="Dashboard"
      description="Welcome back! Here's an overview of your activity."
    >
      <StatGrid columns={3} gap="md">
        {isWorker && (
          <DataCard
            title="Your Earnings"
            value="$0.00"
            icon={<span className="material-symbols-outlined text-[24px]">savings</span>}
            iconColor="secondary"
            subtitle="Total completed tasks"
            action={<Badge variant="outline" size="sm">View Details</Badge>}
          />
        )}
        {isClient && (
          <DataCard
            title="Active Tasks"
            value="0"
            icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
            iconColor="primary"
            subtitle="Tasks currently in progress"
            action={<Badge variant="outline" size="sm">Manage Tasks</Badge>}
          />
        )}
        <DataCard
          title="Account Status"
          value="Active"
          icon={<span className="material-symbols-outlined text-[24px]">verified</span>}
          iconColor="secondary"
          subtitle="Your account is in good standing"
          variant="highlight"
        />
      </StatGrid>

      <div className="mt-space-xl">
        <Card padding="lg">
          <CardHeader title="Recent Activity" />
          <CardContent>
            <div className="text-center py-space-xl">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">history</span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No recent activity to display.</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Start completing or posting tasks to see activity here.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2">
        <Card padding="lg" hover interactive onClick={() => window.location.href = isWorker ? '/worker/tasks' : '/client/tasks'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">{isWorker ? 'travel_explore' : 'add_circle'}</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{isWorker ? 'Find Tasks' : 'Create Task'}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{isWorker ? 'Browse available tasks and start earning' : 'Post a new task for workers to complete'}</p>
            </div>
          </div>
        </Card>

        <Card padding="lg" hover interactive onClick={() => window.location.href = '/worker/wallet'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Wallet</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">View earnings and manage withdrawals</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}