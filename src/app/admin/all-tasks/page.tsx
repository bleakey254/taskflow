import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'All Tasks - TaskFlow Admin',
  description: 'Manage all platform tasks',
};

export default async function AllTasksPage() {
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
      title="All Tasks"
      description="Manage and review all platform tasks"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">All Tasks</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Manage and review all platform tasks</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Button variant="outlined" leftIcon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
            Filters
          </Button>
          <Button variant="ghost" leftIcon={<span className="material-symbols-outlined text-[18px]">download</span>}>
            Export
          </Button>
        </div>
      </div>

      <Card variant="filled" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container">
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Task</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Client</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Budget</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Created</th>
                <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-bold">AI Data Annotation</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-xs">Label 40 street photography scenes...</p>
                  </div>
                </td>
                <td className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface">Acme Corp</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">acme@example.com</p>
                </td>
                <td className="p-space-md">
                  <Badge variant="primary" size="sm">AI & ML</Badge>
                </td>
                <td className="p-space-md">
                  <p className="font-currency-stat text-currency-stat text-on-surface font-bold">$5.00</p>
                </td>
                <td className="p-space-md">
                  <StatusBadge status="in_progress" size="sm" />
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15</td>
                <td className="p-space-md text-right">
                  <div className="flex items-center justify-end gap-space-sm">
                    <IconButton variant="ghost" size="sm" ariaLabel="View task">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </IconButton>
                    <IconButton variant="ghost" size="sm" ariaLabel="Edit task">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </IconButton>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-bold">E-commerce Product Tagging</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-xs">Verify 25 retail apparel specs...</p>
                  </div>
                </td>
                <td className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface">RetailCo</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">retail@example.com</p>
                </td>
                <td className="p-space-md">
                  <Badge variant="outline" size="sm">Catalog</Badge>
                </td>
                <td className="p-space-md">
                  <p className="font-currency-stat text-currency-stat text-on-surface font-bold">$3.80</p>
                </td>
                <td className="p-space-md">
                  <StatusBadge status="completed" size="sm" />
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-10</td>
                <td className="p-space-md text-right">
                  <div className="flex items-center justify-end gap-space-sm">
                    <IconButton variant="ghost" size="sm" ariaLabel="View task">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </IconButton>
                    <IconButton variant="ghost" size="sm" ariaLabel="Edit task">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </IconButton>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-space-md text-center text-on-surface-variant" colSpan={7}>
                  <div className="py-space-xl">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No tasks found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-space-md border-t border-outline-variant flex items-center justify-between">
          <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 2 of 2 results</p>
          <div className="flex items-center gap-space-sm">
            <Button variant="ghost" size="sm" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Button>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}