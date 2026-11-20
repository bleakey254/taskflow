import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Clients - TaskFlow Admin',
  description: 'Manage client accounts',
};

export default async function ClientsPage() {
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
      title="Clients"
      description="Manage client accounts and billing"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Clients</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Manage client accounts and billing</p>
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
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Client</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tasks Posted</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Spend</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Joined</th>
                <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary">
                      <span className="material-symbols-outlined text-[20px]">business</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">Acme Corporation</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">@acmecorp</p>
                    </div>
                  </div>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">billing@acme.com</td>
                <td className="p-space-md">
                  <div className="flex items-center gap-space-sm">
                    <StatusBadge status="in_progress" size="sm" />
                    <Badge variant="primary" size="sm">Verified</Badge>
                  </div>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">15</td>
                <td className="p-space-md">
                  <p className="font-label-lg text-label-lg text-primary font-bold">$2,450.00</p>
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-10</td>
                <td className="p-space-md text-right">
                  <div className="flex items-center justify-end gap-space-sm">
                    <IconButton variant="ghost" size="sm" ariaLabel="View client">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </IconButton>
                    <IconButton variant="ghost" size="sm" ariaLabel="Edit client">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </IconButton>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-[20px]">business</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">StartupXYZ</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">@startupxyz</p>
                    </div>
                  </div>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">contact@startupxyz.com</td>
                <td className="p-space-md">
                  <div className="flex items-center gap-space-sm">
                    <StatusBadge status="in_progress" size="sm" />
                    <Badge variant="primary" size="sm">Verified</Badge>
                  </div>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">8</td>
                <td className="p-space-md">
                  <p className="font-label-lg text-label-lg text-primary font-bold">$1,200.00</p>
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-02-15</td>
                <td className="p-space-md text-right">
                  <div className="flex items-center justify-end gap-space-sm">
                    <IconButton variant="ghost" size="sm" ariaLabel="View client">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </IconButton>
                    <IconButton variant="ghost" size="sm" ariaLabel="Edit client">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </IconButton>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-space-md text-center text-on-surface-variant" colSpan={7}>
                  <div className="py-space-xl">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">business</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No clients found</p>
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