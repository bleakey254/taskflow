import { getCurrentUser } from '@/lib/middleware/auth';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'My Submissions - TaskFlow',
  description: 'View and manage your task submissions',
};

export default async function WorkerSubmissionsPage() {
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
      title="My Submissions"
      description="View and manage your task submissions"
    >
      <Card variant="filled" padding="none">
        <div className="space-y-0">
          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="primary" size="sm">AI & Machine Learning</Badge>
                  <StatusBadge status="approved" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">AI Data Annotation: Bounding Box Vehicle Tags</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Submitted bounding box annotations for 40 street photography scenes.
                </p>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-secondary font-extrabold">$5.00</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Earned</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <IconButton variant="ghost" size="sm" ariaLabel="View submission">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </div>
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
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">E-commerce Product Tagging</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Submitted product tags and attribute validations for 25 apparel items.
                </p>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-tertiary font-extrabold">$3.80</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Pending</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <IconButton variant="ghost" size="sm" ariaLabel="View submission">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          <div className="p-space-md hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="primary" size="sm">Data Entry</Badge>
                  <StatusBadge status="rejected" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Survey Data Entry</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Submitted survey responses for 100 participants.
                </p>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-error font-extrabold">$0.00</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Rejected</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <IconButton variant="ghost" size="sm" ariaLabel="View submission">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}