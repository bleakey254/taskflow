import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import { Divider } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Dispute Center - TaskFlow Admin',
  description: 'Manage and resolve disputes',
};

export default async function DisputeCenterPage() {
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
      title="Dispute Center"
      description="Manage and resolve disputes between clients and workers"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Dispute Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Manage and resolve disputes between clients and workers</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Button variant="outlined" leftIcon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-gutter lg:grid-cols-3">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader
            title="Open Disputes"
            action={<Badge variant="error" size="sm">3 Open</Badge>}
          />
          <CardContent>
            <div className="space-y-space-md">
              <Card variant="outlined" padding="md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant="error" size="sm">Payment Dispute</Badge>
                      <StatusBadge status="open" size="sm" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">AI Data Annotation - Quality Dispute</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Worker claims client rejected valid work. Client states deliverables don't meet specification.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">gavel</span>}>
                      Review
                    </Button>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-sm border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
                  <div className="flex items-center gap-space-md">
                    <span className="font-body-sm text-body-sm">Worker:</span>
                    <span className="font-body-sm text-body-sm font-medium">John Doe</span>
                    <span className="font-body-sm text-body-sm">Client:</span>
                    <span className="font-body-sm text-body-sm font-medium">Acme Corp</span>
                    <span className="font-body-sm text-body-sm">Amount:</span>
                    <span className="font-label-lg text-label-lg text-error font-bold">$5.00</span>
                  </div>
                  <span className="font-body-xs text-body-xs">Opened: 2024-01-15</span>
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant="tertiary" size="sm">Scope Dispute</Badge>
                      <StatusBadge status="open" size="sm" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">E-commerce Tagging - Requirements Dispute</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Client added additional requirements after task was unlocked. Worker requests additional compensation.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">gavel</span>}>
                      Review
                    </Button>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-sm border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
                  <div className="flex items-center gap-space-md">
                    <span className="font-body-sm text-body-sm">Worker:</span>
                    <span className="font-body-sm text-body-sm font-medium">Jane Smith</span>
                    <span className="font-body-sm text-body-sm">Client:</span>
                    <span className="font-body-sm text-body-sm font-medium">RetailCo</span>
                    <span className="font-body-sm text-body-sm">Amount:</span>
                    <span className="font-label-lg text-label-lg text-tertiary font-bold">$3.80</span>
                  </div>
                  <span className="font-body-xs text-body-xs">Opened: 2024-01-14</span>
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant="primary" size="sm">Deadline Dispute</Badge>
                      <StatusBadge status="open" size="sm" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Survey Data Entry - Late Submission</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Worker submitted 2 hours past deadline due to technical issues. Client refuses payment.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">gavel</span>}>
                      Review
                    </Button>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-sm border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
                  <div className="flex items-center gap-space-md">
                    <span className="font-body-sm text-body-sm">Worker:</span>
                    <span className="font-body-sm text-body-sm font-medium">Bob Wilson</span>
                    <span className="font-body-sm text-body-sm">Client:</span>
                    <span className="font-body-sm text-body-sm font-medium">SurveyCo</span>
                    <span className="font-body-sm text-body-sm">Amount:</span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">$2.50</span>
                  </div>
                  <span className="font-body-xs text-body-xs">Opened: 2024-01-13</span>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Quick Stats" />
          <CardContent>
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">Total Disputes</span>
                <span className="font-currency-stat text-currency-stat text-on-surface font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">Open</span>
                <span className="font-currency-stat text-currency-stat text-error font-bold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">Resolved</span>
                <span className="font-currency-stat text-currency-stat text-secondary font-bold">9</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">Avg Resolution Time</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">2.5 days</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">In Favor of Worker</span>
                <span className="font-label-lg text-label-lg text-secondary font-bold">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">In Favor of Client</span>
                <span className="font-label-lg text-label-lg text-primary font-bold">33%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}