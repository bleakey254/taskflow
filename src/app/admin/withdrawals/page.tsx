import { redirect } from 'next/navigation';
import { settleWithdrawal } from '@/actions/admin';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, WithdrawalStatus } from '@/types/prisma';
import { AdminShell, AdminNotice, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Withdrawals - TaskFlow Admin',
  description: 'Manage withdrawal requests',
};

export default async function WithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const user = await requireRole([Role.ADMIN]);
  const { error, done } = await searchParams;

  const withdrawals = await prisma.withdrawal.findMany({
    include: {
      wallet: {
        include: { worker: { select: { name: true, email: true } } },
      },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  });

  const settleAction = async (formData: FormData) => {
    'use server';

    try {
      await settleWithdrawal(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not settle this withdrawal';
      redirect(`/admin/withdrawals?error=${encodeURIComponent(message)}`);
    }

    redirect('/admin/withdrawals?done=Withdrawal+saved');
  };

  return (
    <AdminShell
      userName={user.name}
      title="Withdrawals"
      description="Review and process withdrawal requests. Rejecting a request refunds the held amount."
    >
      <AdminNotice error={error} done={done} />

      {withdrawals.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState
            icon="account_balance_wallet"
            title="No withdrawal requests"
            hint="Worker withdrawals will appear here as soon as they are requested."
          />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {withdrawals.map((withdrawal) => {
              const pending = withdrawal.status === WithdrawalStatus.PENDING;
              const variant = pending ? 'warning' : withdrawal.status === WithdrawalStatus.COMPLETED ? 'success' : 'error';

              return (
                <div
                  key={withdrawal.id}
                  className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-space-sm mb-space-xs">
                        <Badge variant="error" size="sm">Withdrawal</Badge>
                        <Badge variant={variant} size="sm">{withdrawal.status}</Badge>
                      </div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">
                        {withdrawal.wallet.worker.name}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {withdrawal.wallet.worker.email}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                        Destination: <span className="font-mono">{withdrawal.destination}</span> ·{' '}
                        {withdrawal.method === 'mpesa' ? 'M-Pesa' : 'Bank transfer'} ·{' '}
                        {withdrawal.createdAt.toLocaleString()}
                      </p>
                      {withdrawal.failureReason && (
                        <p className="font-body-xs text-body-xs text-error mt-1">{withdrawal.failureReason}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-space-sm sm:ml-space-md">
                      <p className="font-currency-stat text-currency-stat text-on-surface font-bold">
                        {formatMoney(withdrawal.amount)}
                      </p>

                      {pending && (
                        <form action={settleAction} className="flex flex-wrap items-center gap-space-sm">
                          <input type="hidden" name="withdrawalId" value={withdrawal.id} />
                          <input
                            type="text"
                            name="reason"
                            placeholder="Reason (optional)"
                            className="rounded-lg border border-outline-variant px-3 py-1.5 font-body-sm text-body-sm bg-surface-container-lowest"
                          />
                          <Button type="submit" name="decision" value="approve" size="sm" variant="secondary">
                            Approve
                          </Button>
                          <Button type="submit" name="decision" value="reject" size="sm" variant="destructive">
                            Reject &amp; refund
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
