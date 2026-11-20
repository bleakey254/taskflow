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
  title: 'Unlock Analytics - TaskFlow Admin',
  description: 'Analyze unlock patterns and revenue',
};

export default async function UnlockAnalyticsPage() {
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
      title="Unlock Analytics"
      description="Analyze unlock patterns, conversion rates, and revenue"
    >
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Total Unlocks"
          value="12,847"
          icon={<span className="material-symbols-outlined text-[24px]">lock_open</span>}
          iconColor="primary"
          subtitle="+342 this week"
          trend={{ value: '+2.7%', positive: true }}
        />
        <DataCard
          title="Unlock Revenue"
          value="$10,277.60"
          icon={<span className="material-symbols-outlined text-[24px]">attach_money</span>}
          iconColor="secondary"
          subtitle="+$273.60 this week"
          trend={{ value: '+2.7%', positive: true }}
        />
        <DataCard
          title="Conversion Rate"
          value="23.4%"
          icon={<span className="material-symbols-outlined text-[24px]">trending_up</span>}
          iconColor="tertiary"
          subtitle="View → Unlock"
          trend={{ value: '+0.8%', positive: true }}
        />
        <DataCard
          title="Avg Unlocks/User"
          value="4.2"
          icon={<span className="material-symbols-outlined text-[24px]">person</span>}
          iconColor="primary"
          subtitle="Active workers only"
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter lg:grid-cols-2">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader
            title="Daily Unlocks (Last 30 Days)"
            action={<Badge variant="outline" size="sm">$0.80 per unlock</Badge>}
          />
          <CardContent>
            <div className="space-y-space-md">
              {[
                { label: 'Week 1', value: 2840, max: 3500, color: 'primary' },
                { label: 'Week 2', value: 3120, max: 3500, color: 'primary' },
                { label: 'Week 3', value: 2980, max: 3500, color: 'primary' },
                { label: 'Week 4', value: 3407, max: 3500, color: 'primary' },
              ].map((item) => (
                <ProgressCard
                  key={item.label}
                  title={item.label}
                  value={item.value}
                  max={item.max}
                  icon={<span className="material-symbols-outlined text-[20px]">lock_open</span>}
                  iconColor={item.color as any}
                  label="unlocks"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Unlocks by Category" />
          <CardContent>
            <div className="space-y-space-md">
              {[
                { label: 'AI & ML', value: 42, max: 100, color: 'primary' },
                { label: 'Data Entry', value: 28, max: 100, color: 'secondary' },
                { label: 'Writing', value: 18, max: 100, color: 'tertiary' },
                { label: 'Design', value: 15, max: 100, color: 'primary' },
                { label: 'Development', value: 12, max: 100, color: 'secondary' },
                { label: 'Other', value: 15, max: 100, color: 'tertiary' },
              ].map((item) => (
                <ProgressCard
                  key={item.label}
                  title={item.label}
                  value={item.value}
                  max={item.max}
                  icon={<span className="material-symbols-outlined text-[20px]">lock_open</span>}
                  iconColor={item.color as any}
                  label="%"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Worker Retention (Post-Unlock)" />
          <CardContent>
            <div className="space-y-space-md">
              <ProgressCard
                title="Completed 1+ Task"
                value={67}
                max={100}
                icon={<span className="material-symbols-outlined text-[20px]">task_alt</span>}
                iconColor="secondary"
                label="%"
              />
              <ProgressCard
                title="Completed 5+ Tasks"
                value={34}
                max={100}
                icon={<span className="material-symbols-outlined text-[20px]">star</span>}
                iconColor="tertiary"
                label="%"
              />
              <ProgressCard
                title="Completed 10+ Tasks"
                value={18}
                max={100}
                icon={<span className="material-symbols-outlined text-[20px]">workspace_premium</span>}
                iconColor="primary"
                label="%"
              />
              <ProgressCard
                title="Repeat Unlock (7 days)"
                value={41}
                max={100}
                icon={<span className="material-symbols-outlined text-[20px]">repeat</span>}
                iconColor="secondary"
                label="%"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="font-currency-stat text-currency-stat text-primary font-bold">$0.80</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Per Unlock</p>
            <p className="font-body-xs text-body-xs text-on-surface-variant/60 mt-0.5">Fixed fee</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="font-currency-stat text-currency-stat text-secondary font-bold">0%</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Fee Waivers</p>
            <p className="font-body-xs text-body-xs text-on-surface-variant/60 mt-0.5">No discounts</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="font-currency-stat text-currency-stat text-tertiary font-bold">99.2%</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Successful</p>
            <p className="font-body-xs text-body-xs text-on-surface-variant/60 mt-0.5">Payment success</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="font-currency-stat text-currency-stat text-on-surface font-bold">1.8s</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Avg Unlock Time</p>
            <p className="font-body-xs text-body-xs text-on-surface-variant/60 mt-0.5">Payment to access</p>
          </div>
        </Card>
      </div>

      <Card variant="elevated" padding="lg" className="mt-space-xl">
        <CardHeader title="Top Performing Tasks (by Unlocks)" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Rank</th>
                  <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Task</th>
                  <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                  <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Unlocks</th>
                  <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Revenue</th>
                  <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Conversion</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                  <td className="p-space-md"><Badge variant="primary" size="sm">#1</Badge></td>
                  <td className="p-space-md font-headline-sm text-headline-sm text-on-surface font-bold">AI Data Annotation: Vehicle Tags</td>
                  <td className="p-space-md"><Badge variant="primary" size="sm">AI & ML</Badge></td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-on-surface font-bold">1,240</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-primary font-bold">$992.00</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-secondary font-bold">31.2%</td>
                </tr>
                <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                  <td className="p-space-md"><Badge variant="secondary" size="sm">#2</Badge></td>
                  <td className="p-space-md font-headline-sm text-headline-sm text-on-surface font-bold">E-commerce Product Tagging</td>
                  <td className="p-space-md"><Badge variant="outline" size="sm">Catalog</Badge></td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-on-surface font-bold">980</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-primary font-bold">$784.00</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-secondary font-bold">28.5%</td>
                </tr>
                <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                  <td className="p-space-md"><Badge variant="tertiary" size="sm">#3</Badge></td>
                  <td className="p-space-md font-headline-sm text-headline-sm text-on-surface font-bold">Survey Data Entry</td>
                  <td className="p-space-md"><Badge variant="secondary" size="sm">Data Entry</Badge></td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-on-surface font-bold">875</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-primary font-bold">$700.00</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-secondary font-bold">25.1%</td>
                </tr>
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="p-space-md"><Badge variant="outline" size="sm">#4</Badge></td>
                  <td className="p-space-md font-headline-sm text-headline-sm text-on-surface font-bold">Mobile App Testing</td>
                  <td className="p-space-md"><Badge variant="tertiary" size="sm">QA</Badge></td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-on-surface font-bold">650</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-primary font-bold">$520.00</td>
                  <td className="p-space-md text-right font-label-lg text-label-lg text-secondary font-bold">22.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}