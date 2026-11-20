import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Escrow & Payouts - TaskFlow Admin',
  description: 'Manage escrow accounts and payouts',
};

export default async function EscrowAndPayoutsPage() {
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
      title="Escrow & Payouts"
      description="Manage escrow accounts and payouts"
    >
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Total Escrow Held"
          value="$12,450.00"
          icon={<span className="material-symbols-outlined text-[24px]">account_balance</span>}
          iconColor="primary"
          subtitle="Across all active tasks"
          trend={{ value: '+5%', positive: true }}
        />
        <DataCard
          title="Pending Releases"
          value="$3,200.00"
          icon={<span className="material-symbols-outlined text-[24px]">pending</span>}
          iconColor="tertiary"
          subtitle="Awaiting client approval"
        />
        <DataCard
          title="Auto-Released (24h)"
          value="$8,750.00"
          icon={<span className="material-symbols-outlined text-[24px]">schedule</span>}
          iconColor="secondary"
          subtitle="Released automatically"
          trend={{ value: '+12%', positive: true }}
        />
        <DataCard
          title="Disputed Amount"
          value="$450.00"
          icon={<span className="material-symbols-outlined text-[24px]">gavel</span>}
          iconColor="error"
          subtitle="3 active disputes"
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter lg:grid-cols-2">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader
            title="Recent Escrow Activity"
            action={<Button variant="ghost" size="sm">View All</Button>}
          />
          <CardContent>
            <div className="space-y-0">
              <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <Badge variant="secondary" size="sm">Release</Badge>
                    <StatusBadge status="completed" size="sm" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">AI Data Annotation - Task #1245</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Worker: John Doe • Client: Acme Corp</p>
                </div>
                <div className="flex items-center gap-space-lg sm:ml-space-md">
                  <div className="text-right">
                    <p className="font-currency-stat text-currency-stat text-secondary font-bold">+$5.00</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Released to worker</p>
                  </div>
                  <span className="font-body-xs text-body-xs text-on-surface-variant">2024-01-15 14:30</span>
                </div>
              </div>

              <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <Badge variant="primary" size="sm">Lock</Badge>
                    <StatusBadge status="completed" size="sm" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">E-commerce Tagging - Task #1246</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Worker: Jane Smith • Client: RetailCo</p>
                </div>
                <div className="flex items-center gap-space-lg sm:ml-space-md">
                  <div className="text-right">
                    <p className="font-currency-stat text-currency-stat text-primary font-bold">+$0.80</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Unlock fee collected</p>
                  </div>
                  <span className="font-body-xs text-body-xs text-on-surface-variant">2024-01-15 10:15</span>
                </div>
              </div>

              <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <Badge variant="tertiary" size="sm">Hold</Badge>
                    <StatusBadge status="pending" size="sm" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Survey Data Entry - Task #1247</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Worker: Bob Wilson • Client: SurveyCo</p>
                </div>
                <div className="flex items-center gap-space-lg sm:ml-space-md">
                  <div className="text-right">
                    <p className="font-currency-stat text-currency-stat text-tertiary font-bold">$2.50</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Held in escrow</p>
                  </div>
                  <span className="font-body-xs text-body-xs text-on-surface-variant">2024-01-14 16:45</span>
                </div>
              </div>

              <div className="p-space-md hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <Badge variant="error" size="sm">Dispute</Badge>
                    <StatusBadge status="open" size="sm" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Translation - Task #1248</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Worker: Maria Garcia • Client: GlobalTrans</p>
                </div>
                <div className="flex items-center gap-space-lg sm:ml-space-md">
                  <div className="text-right">
                    <p className="font-currency-stat text-currency-stat text-error font-bold">$15.00</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Disputed amount</p>
                  </div>
                  <span className="font-body-xs text-body-xs text-on-surface-variant">2024-01-14 11:20</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Payout Methods" />
          <CardContent>
            <div className="space-y-space-md">
              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">phone_android</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">M-Pesa</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Primary payout method</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Bank Transfer</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">Secondary payout method</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">paypal</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">PayPal</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">International payouts</p>
                  </div>
                </div>
                <Badge variant="outline" size="sm">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Auto-Release Settings" />
          <CardContent>
            <div className="space-y-space-md">
              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-medium">Auto-release after client approval</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Immediately release funds when client approves</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-medium">Auto-release after 24 hours</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Release funds if client takes no action</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-medium">Dispute auto-hold</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Hold funds automatically when dispute filed</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}