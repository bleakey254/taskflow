import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, TaskStatus, WithdrawalStatus } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';

export const metadata = {
  title: 'Payouts - TaskFlow Admin',
  description: 'Worker earnings, refunds and held withdrawals',
};

export default async function EscrowAndPayoutsPage() {
  const admin = await requireRole([Role.ADMIN]);

  const [earnings, refunds, pending, completedVolume, wallets] = await Promise.all([
    prisma.walletTransaction.aggregate({ where: { type: 'TASK_EARNING' }, _sum: { amount: true } }),
    prisma.walletTransaction.aggregate({ where: { type: 'REFUND' }, _sum: { amount: true } }),
    prisma.withdrawal.aggregate({ where: { status: WithdrawalStatus.PENDING }, _sum: { amount: true } }),
    prisma.task.aggregate({ where: { status: TaskStatus.COMPLETED }, _sum: { budget: true } }),
    prisma.wallet.findMany({
      include: { worker: { select: { name: true, email: true, status: true } } },
      orderBy: { balance: 'desc' },
      take: 25,
    }),
  ]);

  const held = Number(pending._sum.amount?.toString() ?? 0);
  const paid = Number(earnings._sum.amount?.toString() ?? 0);
  const refunded = Number(refunds._sum.amount?.toString() ?? 0);
  const volume = Number(completedVolume._sum.budget?.toString() ?? 0);

  return (
    <AdminShell
      userName={admin.name}
      title="Payouts"
      description="There is no separate escrow ledger yet: completed task volume is what clients owed, and wallet balances are what workers are owed."
    >
      <StatGrid columns={4} gap="md">
        <DataCard
          title="Completed task volume"
          value={formatMoney(volume)}
          icon={<span className="material-symbols-outlined text-[24px]">attach_money</span>}
          iconColor="primary"
        />
        <DataCard
          title="Paid to workers"
          value={formatMoney(paid)}
          icon={<span className="material-symbols-outlined text-[24px]">payments</span>}
          iconColor="secondary"
        />
        <DataCard
          title="Held for withdrawals"
          value={formatMoney(held)}
          icon={<span className="material-symbols-outlined text-[24px]">pending</span>}
          iconColor="tertiary"
        />
        <DataCard
          title="Refunded"
          value={formatMoney(refunded)}
          icon={<span className="material-symbols-outlined text-[24px]">undo</span>}
          iconColor="error"
        />
      </StatGrid>

      <div className="mt-space-xl">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Worker balances" subtitle="Highest balances first" />
          <CardContent>
            {wallets.length === 0 ? (
              <EmptyState icon="account_balance_wallet" title="No wallets yet" hint="Worker wallets appear here after signup." />
            ) : (
              <div className="space-y-0">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between gap-space-md p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">{wallet.worker.name}</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {wallet.worker.email} · {wallet.worker.status}
                      </p>
                    </div>
                    <p className="font-label-lg text-label-lg font-bold text-on-surface whitespace-nowrap">
                      {formatMoney(wallet.balance)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
