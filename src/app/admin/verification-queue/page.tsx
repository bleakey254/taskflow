import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Verification Queue - TaskFlow Admin',
  description: 'Review and verify user accounts',
};

export default async function VerificationQueuePage() {
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
      title="Verification Queue"
      description="Review and verify user accounts and documents"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Verification Queue</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Review and verify user accounts and documents</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Button variant="outlined" leftIcon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-gutter lg:grid-cols-2">
        <Card variant="elevated" padding="lg">
          <CardHeader
            title="Pending Worker Verifications"
            action={<Badge variant="primary" size="sm">5 Pending</Badge>}
          />
          <CardContent>
            <div className="space-y-space-md">
              <Card variant="outlined" padding="md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Alex Johnson</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">alex@example.com • @alexj</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Submitted: Government ID + Selfie</p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">verified</span>}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Reject verification">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Maria Garcia</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">maria@example.com • @mariag</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Submitted: Passport + Address Proof</p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">verified</span>}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Reject verification">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">David Kim</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">david@example.com • @davidk</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Submitted: Driver's License + Utility Bill</p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">verified</span>}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Reject verification">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader
            title="Pending Client Verifications"
            action={<Badge variant="tertiary" size="sm">2 Pending</Badge>}
          />
          <CardContent>
            <div className="space-y-space-md">
              <Card variant="outlined" padding="md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">TechStart Inc</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">billing@techstart.com • @techstart</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Submitted: Business License + Tax ID</p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">verified</span>}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Reject verification">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Global Solutions Ltd</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">legal@globalsolutions.com • @globalsolutions</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Submitted: Incorporation Docs + Bank Statement</p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">verified</span>}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Reject verification">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" padding="lg" className="mt-space-lg">
        <CardHeader title="Verification Stats" />
        <CardContent>
          <div className="grid gap-gutter sm:grid-cols-4">
            <div className="text-center">
              <p className="font-currency-stat text-currency-stat text-primary font-bold">47</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total Verified</p>
            </div>
            <div className="text-center">
              <p className="font-currency-stat text-currency-stat text-secondary font-bold">3</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Rejected</p>
            </div>
            <div className="text-center">
              <p className="font-currency-stat text-currency-stat text-tertiary font-bold">7</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="font-currency-stat text-currency-stat text-on-surface font-bold">94%</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Approval Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}