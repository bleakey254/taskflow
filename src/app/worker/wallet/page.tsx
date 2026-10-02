import { getWallet, requestWithdrawal } from '@/actions/wallet';
import { getCurrentUser } from '@/lib/middleware/auth';
import { WalletTransaction, WalletTransactionType } from '@/types/prisma';

export const metadata = {
  title: 'Wallet - TaskFlow',
  description: 'View your earnings and request withdrawals',
};

export default async function WorkerWalletPage() {
  'use server';

  // Get current user (layout already ensured auth and role)
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get wallet data
  const wallet = await getWallet(user.id);

  if (!wallet) {
    return <div>Loading wallet data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Wallet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View your earnings and request withdrawals
            </p>
          </div>

          <div className="px-6 py-6">
            {/* Wallet balance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Wallet Balance
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Available for withdrawal
                  </p>
                </div>
                <div className="text-3xl font-bold text-indigo-600">
                  ${wallet.balance.toFixed(2)}
                </div>
              </div>

              {/* Recent transactions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Transactions
                </h3>

                {wallet.transactions.length > 0 ? (
                  wallet.transactions.map((tx: WalletTransaction, index: number) => (
                    <div key={index} className="border-b py-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={[
                              'h-6 w-6 flex items-center justify-center rounded',
                              tx.type === WalletTransactionType.TASK_EARNING ? 'bg-green-100' :
                              tx.type === WalletTransactionType.WITHDRAWAL ? 'bg-red-100' :
                              tx.type === WalletTransactionType.REFUND ? 'bg-blue-100' :
                              'bg-gray-100'
                            ].join(' ')}>
                              <span className={[
                                'text-sm font-medium',
                                tx.type === WalletTransactionType.TASK_EARNING ? 'text-green-800' :
                                tx.type === WalletTransactionType.WITHDRAWAL ? 'text-red-800' :
                                tx.type === WalletTransactionType.REFUND ? 'text-blue-800' :
                                'text-gray-800'
                              ].join(' ')}>
                                {tx.type === WalletTransactionType.TASK_EARNING ? '+' :
                                 tx.type === WalletTransactionType.WITHDRAWAL ? '-' :
                                 tx.type === WalletTransactionType.REFUND ? '+' : '±'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {tx.type === WalletTransactionType.TASK_EARNING ? 'Task Earnings' :
                                 tx.type === WalletTransactionType.WITHDRAWAL ? 'Withdrawal' :
                                 tx.type === WalletTransactionType.REFUND ? 'Refund' : 'Adjustment'}
                              </h4>
                              <p className="text-sm text-gray-500 truncate">
                                {/* In a real app, we'd show more details from metadata */}
                                Transaction from task completion
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={[
                            'font-medium',
                            tx.type === WalletTransactionType.TASK_EARNING || tx.type === WalletTransactionType.REFUND ? 'text-green-600' :
                            tx.type === WalletTransactionType.WITHDRAWAL ? 'text-red-600' :
                            'text-gray-600'
                          ].join(' ')}>
                            {(tx.type === WalletTransactionType.TASK_EARNING || tx.type === WalletTransactionType.REFUND) ?
                              `+${tx.amount.toFixed(2)}` :
                              `-${tx.amount.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      No transactions yet. Complete tasks to start earning!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Withdrawal section */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Request Withdrawal
              </h3>
              <div className="space-y-4">
                <form className="space-y-4" action={async (formData: FormData) => {
                  'use server';
                  await requestWithdrawal(undefined, formData);
                  // For now, we'll just return void as per Next.js form action convention
                }}>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Withdrawal Amount ($)
                      </label>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-900">$</span>
                        <input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          min="1.00"
                          required
                          className="w-32 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum withdrawal: $1.00
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
                        Withdrawal Method
                      </label>
                      <select
                        id="method"
                        name="method"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select withdrawal method</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        Destination (Phone Number or Bank Account)
                      </label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        placeholder="Enter your M-Pesa number or bank account details"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white w-auto hover:bg-indigo-700"
                      disabled={wallet.balance < 1.00}
                    >
                      Request Withdrawal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading metadata
export async function generateMetadata() {
  return {
    title: 'Wallet - TaskFlow',
    description: 'View your earnings and request withdrawals',
  };
}