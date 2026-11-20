import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Task Approval Center - TaskFlow Admin',
  description: 'Review and approve pending tasks',
};

export default async function TaskApprovalCenterPage() {
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
      title="Task Approval Center"
      description="Review and approve pending tasks before they go live"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Task Approval Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Review and approve pending tasks before they go live</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Button variant="outlined" leftIcon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
            Filters
          </Button>
        </div>
      </div>

      <Card variant="filled" padding="none">
        <div className="space-y-0">
          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="primary" size="sm">AI & Machine Learning</Badge>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">AI Data Annotation: Bounding Box Vehicle Tags</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Label 40 street photography scenes with multi-class vehicle segmentation polygons according to standard taxonomy.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm mt-space-sm text-on-surface-variant">
                  <span className="font-body-xs text-body-xs">Client: Acme Corp</span>
                  <span className="font-body-xs text-body-xs">Budget: $5.00</span>
                  <span className="font-body-xs text-body-xs">Slots: 50</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">visibility</span>}>
                  Review
                </Button>
                <Button variant="ghost" size="sm" aria-label="Approve task">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Reject task">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="outline" size="sm">Catalog Taxonomy</Badge>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">E-commerce Product Tagging & Attribute Validation</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Verify 25 retail apparel specs including fabric blends, SKU variations, and standard sleeve lengths.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm mt-space-sm text-on-surface-variant">
                  <span className="font-body-xs text-body-xs">Client: RetailCo</span>
                  <span className="font-body-xs text-body-xs">Budget: $3.80</span>
                  <span className="font-body-xs text-body-xs">Slots: 25</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">visibility</span>}>
                  Review
                </Button>
                <Button variant="ghost" size="sm" aria-label="Approve task">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Reject task">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-space-md hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="tertiary" size="sm">Data Entry</Badge>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Survey Data Entry & Validation</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Enter and validate survey responses from 200 participants. Check for completeness and consistency.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm mt-space-sm text-on-surface-variant">
                  <span className="font-body-xs text-body-xs">Client: SurveyCo</span>
                  <span className="font-body-xs text-body-xs">Budget: $2.50</span>
                  <span className="font-body-xs text-body-xs">Slots: 100</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">visibility</span>}>
                  Review
                </Button>
                <Button variant="ghost" size="sm" aria-label="Approve task">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Reject task">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-space-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more pending tasks</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">All tasks reviewed!</p>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}