import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button } from '@/components/layout';
import { DataCard, StatGrid, ProgressCard } from '@/components/layout';
import { Badge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Live Metrics - TaskFlow Admin',
  description: 'Real-time platform metrics',
};

export default async function LiveMetricsPage() {
  const user = await getCurrentUser();
  await requireRole([Role.ADMIN]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <PageShell
      header={
        <>
          <Link href="/admin/dashboard" className="flex items-center gap-space-sm" data-path="admin">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow Admin</span>
          </Link>
          <HeaderUser name={user.name} />
        </>
      }
      title="Live Metrics"
      description="Real-time platform metrics and performance indicators"
    >
      <div className="flex items-center justify-between mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Live Metrics</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Real-time platform metrics and performance indicators</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Badge variant="secondary" size="sm" dot>
            Live
          </Badge>
          <Button variant="ghost" size="sm" leftIcon={<span className="material-symbols-outlined text-[18px]">refresh</span>}>
            Refresh
          </Button>
        </div>
      </div>

      <StatGrid columns={4} gap="md">
        <DataCard
          title="Active Users"
          value="1,247"
          icon={<span className="material-symbols-outlined text-[24px]">people</span>}
          iconColor="primary"
          subtitle="+23 vs 1hr ago"
          trend={{ value: '+2%', positive: true }}
        />
        <DataCard
          title="Tasks in Progress"
          value="342"
          icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
          iconColor="secondary"
          subtitle="+12 vs 1hr ago"
          trend={{ value: '+4%', positive: true }}
        />
        <DataCard
          title="Submissions/hr"
          value="89"
          icon={<span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>}
          iconColor="tertiary"
          subtitle="-5 vs 1hr ago"
          trend={{ value: '-5%', positive: false }}
        />
        <DataCard
          title="Revenue/hr"
          value="$1,240"
          icon={<span className="material-symbols-outlined text-[24px]">attach_money</span>}
          iconColor="primary"
          subtitle="+$180 vs 1hr ago"
          trend={{ value: '+17%', positive: true }}
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter lg:grid-cols-2">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader
            title="User Activity (Last 24 Hours)"
            action={<Badge variant="outline" size="sm">Auto-refresh: 30s</Badge>}
          />
          <CardContent>
            <div className="space-y-space-md">
              {[
                { label: '00:00-04:00', value: 120, max: 500, color: 'primary' },
                { label: '04:00-08:00', value: 85, max: 500, color: 'primary' },
                { label: '08:00-12:00', value: 340, max: 500, color: 'primary' },
                { label: '12:00-16:00', value: 480, max: 500, color: 'primary' },
                { label: '16:00-20:00', value: 420, max: 500, color: 'primary' },
                { label: '20:00-00:00', value: 280, max: 500, color: 'primary' },
              ].map((item) => (
                <ProgressCard
                  key={item.label}
                  title={item.label}
                  value={item.value}
                  max={item.max}
                  icon={<span className="material-symbols-outlined text-[20px]">people</span>}
                  iconColor={item.color as any}
                  label="users"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Task Completion Rate" />
          <CardContent>
            <ProgressCard
              title="Overall"
              value={78}
              max={100}
              icon={<span className="material-symbols-outlined text-[20px]">check_circle</span>}
              iconColor="secondary"
              label="%"
            />
            <ProgressCard
              title="AI & ML"
              value={85}
              max={100}
              icon={<span className="material-symbols-outlined text-[20px]">smart_toy</span>}
              iconColor="primary"
              label="%"
            />
            <ProgressCard
              title="Data Entry"
              value={92}
              max={100}
              icon={<span className="material-symbols-outlined text-[20px]">database</span>}
              iconColor="secondary"
              label="%"
            />
            <ProgressCard
              title="Design"
              value={71}
              max={100}
              icon={<span className="material-symbols-outlined text-[20px]">palette</span>}
              iconColor="tertiary"
              label="%"
            />
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="System Health" />
          <CardContent>
            <div className="space-y-space-md">
              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">API Uptime</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">99.99% (last 30 days)</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm" dot>Healthy</Badge>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Avg Response Time</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">124ms (p95: 280ms)</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm" dot>Optimal</Badge>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">storage</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Database</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">45% capacity used</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm" dot>Healthy</Badge>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">memory</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Memory Usage</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">62% (2.1GB / 3.4GB)</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm" dot>Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/audit-logs'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">history</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Audit Logs</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">View detailed system logs</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/transactions'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Transactions</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">View all financial activity</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover interactive onClick={() => window.location.href = '/admin/dispute-center'}>
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Disputes</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Manage active disputes</p>
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
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Process pending requests</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}