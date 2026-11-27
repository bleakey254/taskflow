'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma, INTERACTIVE_TRANSACTION_OPTIONS } from '@/lib/prisma';
import { formatMoney, MIN_WITHDRAWAL } from '@/lib/constants';
import { WithdrawalStatus, Role, NotificationType } from '@/types/prisma';

const WITHDRAWAL_METHODS = ['mpesa', 'bank_transfer'];

// Get wallet details for the current session user
export async function getWallet() {
  'use server';

  // Derive the worker from the session. Never trust a caller-supplied id.
  const user = await requireAuth();

  try {
    // Every worker needs a wallet. Creating it on first visit keeps older
    // accounts (created before signup did this) from hitting a dead end.
    const wallet = await prisma.wallet.upsert({
      where: { workerId: user.id },
      update: {},
      create: { workerId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20, // Get recent transactions
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return wallet;
  } catch (error) {
    console.error('Get wallet error:', error);
    return null;
  }
}

// Request withdrawal action
export async function requestWithdrawal(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const user = await requireRole([Role.WORKER]);

  const amountStr = formData.get('amount') as string | null;
  const method = formData.get('method') as string | null;
  const destination = (formData.get('destination') as string | null)?.trim();

  if (!amountStr || !method || !destination) {
    throw new Error('All fields are required');
  }

  if (!WITHDRAWAL_METHODS.includes(method)) {
    throw new Error('Choose a valid withdrawal method');
  }

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  if (amount < MIN_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal amount is $${MIN_WITHDRAWAL.toFixed(2)}`);
  }

  // Two decimal places only; the database column is Decimal(10,2) and a value
  // like 0.005 would otherwise be silently rounded after the check.
  if (Math.round(amount * 100) !== amount * 100) {
    throw new Error('Amount can have at most two decimal places');
  }

  try {
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { workerId: user.id } });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (Number(wallet.balance) < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Debit first, guarded by the balance so two concurrent requests cannot
      // both spend the same earnings.
      const debited = await tx.wallet.updateMany({
        where: { id: wallet.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      });

      if (debited.count === 0) {
        throw new Error('Insufficient wallet balance');
      }

      const withdrawal = await tx.withdrawal.create({
        data: {
          walletId: wallet.id,
          amount,
          method,
          destination,
          status: WithdrawalStatus.PENDING,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount,
          referenceId: withdrawal.id,
          referenceType: 'Withdrawal',
          metadata: { method, destination, status: WithdrawalStatus.PENDING },
        },
      });

      await tx.notification.create({
        data: {
          recipientId: user.id,
          type: NotificationType.WITHDRAWAL_SUCCESS,
          title: 'Withdrawal requested',
          message: `Your withdrawal of $${amount.toFixed(2)} via ${method === 'mpesa' ? 'M-Pesa' : 'bank transfer'} is pending review.`,
          relatedEntityType: 'Withdrawal',
          relatedEntityId: withdrawal.id,
        },
      });
    }, INTERACTIVE_TRANSACTION_OPTIONS);
  } catch (error) {
    console.error('Withdrawal request error:', error);
    if (error instanceof Error) {
      // Surface the validation messages this action itself produces.
      if (
        error.message === 'Wallet not found' ||
        error.message === 'Insufficient wallet balance'
      ) {
        throw error;
      }
    }
    throw new Error('Could not request this withdrawal');
  }

  revalidatePath('/worker/wallet');
  revalidatePath('/dashboard');
}
