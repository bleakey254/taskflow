import { redirect } from 'next/navigation';
import { getWallet, requestWithdrawal } from '@/actions/wallet';
import { requireRole } from '@/lib/middleware/auth';
import { formatMoney, MIN_WITHDRAWAL } from '@/lib/constants';
import { Role, WalletTransactionType } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import { Input, Select } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Wallet - TaskFlow',
  description: 'View your earnings and request withdrawals',
};

export default async function WorkerWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ requested?: string; error?: string }>;
}) {
  const user = await requireRole([Role.WORKER]);
  const { requested, error } = await searchParams;

  const wallet = await getWallet();

  if (!wallet) {
    return (
      <PageShell
        header={
          <>
            <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
              <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
            </Link>
            <HeaderUser name={user.name} />
          </>
        }
        title="Wallet"
      >
        <p className="font-body-md text-body-md text-error" role="alert">
          Your wallet could not be loaded. Please try again.
        </p>
      </PageShell>
    );
  }

  const balance = formatMoney(wallet.balance);

  const requestAction = async (formData: FormData) => {
    'use server';

    try {
      await requestWithdrawal(undefined, formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not request this withdrawal';
      redirect(`/worker/wallet?error=${encodeURIComponent(message)}`);
    }

    redirect('/worker/wallet?requested=1');
  };

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={balance} />
        </>
      }
      title="Wallet"
      description="View your earnings and request withdrawals"
    >
      <StatGrid columns={1} gap="md" className="max-w-2xl">
        <DataCard
          title="Wallet Balance"
          value={balance}
          icon={<span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>}
          iconColor="primary"
          subtitle="Available for withdrawal"
          variant="highlight"
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter max-w-2xl">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Recent Transactions" />
          <CardContent>
            {wallet.transactions.length > 0 ? (
              <div className="space-y-0">
                {wallet.transactions.map((tx) => {
                  const isEarning =
                    tx.type === WalletTransactionType.TASK_EARNING ||
                    tx.type === WalletTransactionType.REFUND;
                  const typeLabel =
                    tx.type === WalletTransactionType.TASK_EARNING ? 'Task Earnings'
                      : tx.type === WalletTransactionType.WITHDRAWAL ? 'Withdrawal'
                        : tx.type === WalletTransactionType.REFUND ? 'Refund' : 'Adjustment';

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-space-sm border-b border-outline-variant/50 last:border-0"
                    >
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-medium">{typeLabel}</p>
                        <p className="font-body-xs text-body-xs text-on-surface-variant">
                          {tx.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <p className={`font-label-lg text-label-lg font-bold ${isEarning ? 'text-secondary' : 'text-error'}`}>
                        {isEarning ? '+' : '-'}{formatMoney(tx.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-space-xl">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">receipt_long</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No transactions yet</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">
                  Complete tasks to start earning!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {wallet.withdrawals.length > 0 && (
          <Card variant="elevated" padding="lg">
            <CardHeader title="Withdrawal Requests" />
            <CardContent>
              <div className="space-y-0">
                {wallet.withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-medium">
                        {formatMoney(withdrawal.amount)} · {withdrawal.method === 'mpesa' ? 'M-Pesa' : 'Bank transfer'}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {withdrawal.destination} · {withdrawal.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={withdrawal.status === 'PENDING' ? 'warning' : withdrawal.status === 'COMPLETED' ? 'success' : 'error'} size="sm">
                      {withdrawal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card variant="elevated" padding="lg">
          <CardHeader title="Request Withdrawal" />
          <CardContent>
            {requested && (
              <p className="mb-space-md font-body-sm text-body-sm text-secondary" role="status">
                Withdrawal requested. The amount is held until an administrator settles it.
              </p>
            )}
            {error && (
              <p className="mb-space-md font-body-sm text-body-sm text-error" role="alert">{error}</p>
            )}

            <form className="space-y-space-lg" action={requestAction}>
              <div className="space-y-space-sm">
                <label htmlFor="amount" className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
                  Withdrawal Amount ($)
                </label>
                <div className="flex items-center gap-space-sm">
                  <span className="text-on-surface font-body-lg text-body-lg font-bold">$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min={MIN_WITHDRAWAL}
                    required
                    className="w-32"
                    placeholder={MIN_WITHDRAWAL.toFixed(2)}
                    helperText={`Minimum withdrawal: $${MIN_WITHDRAWAL.toFixed(2)}`}
                  />
                </div>
              </div>

              <Select
                label="Withdrawal Method"
                name="method"
                required
                placeholder="Select withdrawal method"
                options={[
                  { value: 'mpesa', label: 'M-Pesa' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                ]}
              />

              <Input
                label="Destination (Phone Number or Bank Account)"
                name="destination"
                type="text"
                placeholder="Enter your M-Pesa number or bank account details"
                required
                leftIcon={<span className="material-symbols-outlined text-[20px]">account_circle</span>}
              />

              <CardFooter>
                <Link
                  href="/worker/tasks"
                  className="inline-flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-bold rounded-lg px-space-xl py-space-md text-on-surface hover:bg-surface-container-high transition-all duration-fast"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Tasks
                </Link>
                <Button
                  type="submit"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}
                  disabled={Number(balance.replace('$', '')) < MIN_WITHDRAWAL}
                >
                  Request Withdrawal
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
