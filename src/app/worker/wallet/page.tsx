import { getWallet } from '@/actions/wallet';
import { getCurrentUser } from '@/lib/middleware/auth';
import { WalletTransaction, WalletTransactionType } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import { Input, Select } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Wallet - TaskFlow',
  description: 'View your earnings and request withdrawals',
};

export default async function WorkerWalletPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const wallet = await getWallet(user.id);

  if (!wallet) {
    return <div>Loading wallet data...</div>;
  }

  const balance = Number(wallet.balance.toString()).toFixed(2);

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={`$${balance}`} />
        </>
      }
      title="Wallet"
      description="View your earnings and request withdrawals"
    >
      <StatGrid columns={1} gap="md" className="max-w-2xl">
        <DataCard
          title="Wallet Balance"
          value={`$${balance}`}
          icon={<span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>}
          iconColor="primary"
          subtitle="Available for withdrawal"
          variant="highlight"
        />
      </StatGrid>

      <div className="mt-space-xl grid gap-gutter max-w-2xl">
        <Card variant="elevated" padding="lg">
          <CardHeader
            title="Recent Transactions"
            action={
              <Button variant="ghost" size="sm">View All</Button>
            }
          />
          <CardContent>
            {wallet.transactions.length > 0 ? (
              <div className="space-y-0">
                {wallet.transactions.map((tx: any, index: number) => {
                  const txType = tx.type as WalletTransactionType;
                  const isEarning = txType === WalletTransactionType.TASK_EARNING || txType === WalletTransactionType.REFUND;
                  const isWithdrawal = txType === WalletTransactionType.WITHDRAWAL;
                  const typeLabel = txType === WalletTransactionType.TASK_EARNING ? 'Task Earnings' :
                    txType === WalletTransactionType.WITHDRAWAL ? 'Withdrawal' :
                    txType === WalletTransactionType.REFUND ? 'Refund' : 'Adjustment';
                  const typeIcon = txType === WalletTransactionType.TASK_EARNING ? 'task_alt' :
                    txType === WalletTransactionType.WITHDRAWAL ? 'account_balance_wallet' :
                    txType === WalletTransactionType.REFUND ? 'undo' : 'tune';
                  const typeColor = isEarning ? 'secondary' : isWithdrawal ? 'error' : 'primary';

                  return (
                    <div key={index} className="flex items-center justify-between p-space-sm border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors">
                      <div className="flex items-center gap-space-md">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${typeColor}/10 text-${typeColor}`}>
                          <span className="material-symbols-outlined text-[20px]">{typeIcon}</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-medium">{typeLabel}</p>
                          <p className="font-body-xs text-body-xs text-on-surface-variant">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-label-lg text-label-lg font-bold ${isEarning ? 'text-secondary' : 'text-error'}`}>
                          {isEarning ? '+' : '-'}$${Number(tx.amount.toString()).toFixed(2)}
                        </p>
                        {tx.metadata && (
                          <Badge variant="outline" size="sm" className="mt-1">{JSON.stringify(tx.metadata).slice(0, 30)}...</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-space-xl">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">receipt_long</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No transactions yet</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Complete tasks to start earning!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Request Withdrawal" />
          <CardContent>
            <form className="space-y-space-lg" action={async (formData: FormData) => {
              'use server';
            }}>
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
                    min="1.00"
                    required
                    className="w-32"
                    placeholder="1.00"
                    helperText="Minimum withdrawal: $1.00"
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
                <Button variant="ghost" onClick={() => window.history.back()}>
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Go Back
                </Button>
                <Button
                  type="submit"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}
                  disabled={Number(balance) < 1.00}
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