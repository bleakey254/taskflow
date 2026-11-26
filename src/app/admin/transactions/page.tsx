import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Transactions - TaskFlow Admin',
  description: 'Wallet ledger and payment records',
};

export default async function TransactionsPage() {
  const admin = await requireRole([Role.ADMIN]);

  const [transactions, payments] = await Promise.all([
    prisma.walletTransaction.findMany({
      include: { wallet: { include: { worker: { select: { name: true, email: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.payment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        task: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <AdminShell userName={admin.name} title="Transactions" description="Wallet ledger entries and provider payments">
      <div className="grid gap-gutter">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Wallet ledger" subtitle="Earnings, refunds and withdrawals" />
          <CardContent>
            {transactions.length === 0 ? (
              <EmptyState icon="receipt_long" title="No ledger entries" hint="Wallet movements appear here as work is paid out." />
            ) : (
              <div className="space-y-0">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-space-md p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">
                        {transaction.wallet.worker.name} · {transaction.type}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {transaction.wallet.worker.email} · {transaction.createdAt.toLocaleString()}
                        {transaction.referenceType ? ` · ${transaction.referenceType}` : ''}
                      </p>
                    </div>
                    <p className="font-label-lg text-label-lg font-bold text-on-surface whitespace-nowrap">
                      {formatMoney(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Payments" subtitle="Provider charges for task unlocks" />
          <CardContent>
            {payments.length === 0 ? (
              <EmptyState icon="credit_card" title="No payments" hint="Unlock payments are recorded here." />
            ) : (
              <div className="space-y-0">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-space-md p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">
                        {payment.user.name} · {payment.purpose}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {payment.task?.title ?? 'No task'} · {payment.createdAt.toLocaleString()} · {payment.providerTransactionId}
                      </p>
                    </div>
                    <div className="flex items-center gap-space-md whitespace-nowrap">
                      <Badge
                        variant={payment.status === 'SUCCEEDED' ? 'success' : payment.status === 'FAILED' ? 'error' : 'warning'}
                        size="sm"
                      >
                        {payment.status}
                      </Badge>
                      <p className="font-label-lg text-label-lg font-bold text-on-surface">
                        {formatMoney(payment.amount)}
                      </p>
                    </div>
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
