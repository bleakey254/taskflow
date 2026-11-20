import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Withdrawals - TaskFlow Admin',
  description: 'Manage withdrawal requests',
};

export default async function WithdrawalsPage() {
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
      title="Withdrawals"
      description="Review and process withdrawal requests"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Withdrawal Requests</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Review and process withdrawal requests</p>
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
        <div className="space-y-0">
          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-space-sm mb-space-xs">
                  <Badge variant="error" size="sm">Withdrawal</Badge>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">John Doe</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">@johndoe • john@example.com</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-error font-bold">$150.00</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">M-Pesa</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">check</span>}>
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">close</span>}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-space-sm pt-space-sm border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
              <div className="flex items-center gap-space-md">
                <span className="font-body-sm text-body-sm">Destination:</span>
                <span className="font-body-sm text-body-sm font-mono">+254712345678</span>
              </div>
              <span className="font-body-xs text-body-xs">2024-01-15 14:30</span>
            </div>
          </div>

          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-space-sm mb-space-xs">
                  <Badge variant="error" size="sm">Withdrawal</Badge>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">Jane Smith</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">@janesmith • jane@example.com</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-error font-bold">$75.50</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Bank Transfer</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <Button variant="secondary" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">check</span>}>
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">close</span>}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-space-sm pt-space-sm border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
              <div className="flex items-center gap-space-md">
                <span className="font-body-sm text-body-sm">Destination:</span>
                <span className="font-body-sm text-body-sm font-mono">Account: 1234567890</span>
              </div>
              <span className="font-body-xs text-body-xs">2024-01-14 09:15</span>
            </div>
          </div>

          <div className="p-space-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">account_balance_wallet</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more withdrawal requests</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">All caught up!</p>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}