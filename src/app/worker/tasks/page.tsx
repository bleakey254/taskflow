import { getCurrentUser } from '@/lib/middleware/auth';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Available Tasks - TaskFlow',
  description: 'Browse and complete micro-tasks',
};

export default async function WorkerTasksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

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
      title="Available Tasks"
      description="Browse tasks available for completion"
    >
      <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample Task Card */}
        <Card variant="elevated" padding="md" hover>
          <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
            <Badge variant="primary" size="sm">AI & Machine Learning</Badge>
            <Badge variant="secondary" size="sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
            </Badge>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">AI Data Annotation: Bounding Box Vehicle Tags</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Label 40 street photography scenes with multi-class vehicle segmentation polygons according to standard taxonomy.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-md text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span className="font-label-sm text-label-sm">42 Slots Left</span>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span className="font-label-sm text-label-sm font-bold">73 Unlocked</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">$5.00</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant">Escrow Guaranteed</p>
            </div>
          </div>
          <Button
            fullWidth
            variant="tertiary"
            leftIcon={<span className="material-symbols-outlined text-[15px]">lock</span>}
          >
            Unlock Task ($0.80)
          </Button>
        </Card>

        {/* Sample Task Card 2 */}
        <Card variant="elevated" padding="md" hover>
          <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
            <Badge variant="outline" size="sm">Catalog Taxonomy</Badge>
            <Badge variant="secondary" size="sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
            </Badge>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">E-commerce Product Tagging & Attribute Validation</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Verify 25 retail apparel specs including fabric blends, SKU variations, and standard sleeve lengths.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-md text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span className="font-label-sm text-label-sm">18 Slots Left</span>
              </div>
              <Badge variant="secondary" size="sm">Verified Client</Badge>
            </div>
            <div className="text-right">
              <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">$3.80</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant">Escrow Funded</p>
            </div>
          </div>
          <Button
            fullWidth
            variant="tertiary"
            leftIcon={<span className="material-symbols-outlined text-[15px]">lock</span>}
          >
            Unlock Task ($0.80)
          </Button>
        </Card>

        {/* Empty State Cards */}
        <Card variant="outlined" padding="lg" className="text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more tasks available</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Check back later for new opportunities</p>
        </Card>

        <Card variant="outlined" padding="lg" className="text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more tasks available</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Check back later for new opportunities</p>
        </Card>

        <Card variant="outlined" padding="lg" className="text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more tasks available</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Check back later for new opportunities</p>
        </Card>

        <Card variant="outlined" padding="lg" className="text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more tasks available</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Check back later for new opportunities</p>
        </Card>
      </div>
    </PageShell>
  );
}