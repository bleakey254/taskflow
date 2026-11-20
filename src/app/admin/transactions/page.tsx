import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Transactions - TaskFlow Admin',
  description: 'View all platform transactions',
};

export default async function TransactionsPage() {
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
      title="Transactions"
      description="View all platform transactions and financial activity"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Transactions</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">View all platform transactions and financial activity</p>
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
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Task</th>
                <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Task Earning</Badge>
                </td>
                <td className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface">John Doe</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">@johndoe</p>
                </td>
                <td className="p-space-md">
                  <p className="font-body-sm text-body-sm text-on-surface truncate max-w-xs">AI Data Annotation</p>
                </td>
                <td className="p-space-md text-right">
                  <p className="font-currency-stat text-currency-stat text-secondary font-bold">+$5.00</p>
                </td>
                <td className="p-space-md">
                  <StatusBadge status="completed" size="sm" />
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 14:30</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View transaction">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <Badge variant="error" size="sm">Withdrawal</Badge>
                </td>
                <td className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface">Jane Smith</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">@janesmith</p>
                </td>
                <td className="p-space-md">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">—</p>
                </td>
                <td className="p-space-md text-right">
                  <p className="font-currency-stat text-currency-stat text-error font-bold">-$100.00</p>
                </td>
                <td className="p-space-md">
                  <StatusBadge status="completed" size="sm" />
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-14 09:15</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View transaction">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md">
                  <Badge variant="primary" size="sm">Unlock Fee</Badge>
                </td>
                <td className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface">John Doe</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">@johndoe</p>
                </td>
                <td className="p-space-md">
                  <p className="font-body-sm text-body-sm text-on-surface truncate max-w-xs">E-commerce Product Tagging</p>
                </td>
                <td className="p-space-md text-right">
                  <p className="font-currency-stat text-currency-stat text-primary font-bold">+$0.80</p>
                </td>
                <td className="p-space-md">
                  <StatusBadge status="completed" size="sm" />
                </td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-14 08:00</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View transaction">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-space-md text-center text-on-surface-variant" colSpan={7}>
                  <div className="py-space-xl">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">receipt_long</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No transactions found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-space-md border-t border-outline-variant flex items-center justify-between">
          <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 3 of 3 results</p>
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