'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { WithdrawalStatus } from '@/types/prisma';

// Get wallet details
export async function getWallet(userId: string) {
  'use server';

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { workerId: userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20, // Get recent transactions
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

  try {
    // Require authentication and WORKER role
    const user = await requireAuth();
    await requireRole([Role.WORKER]);

    const amountStr = formData.get('amount') as string;
    const method = formData.get('method') as string;
    const destination = formData.get('destination') as string;

    // Basic validation
    if (!amountStr || !method || !destination) {
      throw new Error('All fields are required');
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Get wallet to check balance
    const wallet = await prisma.wallet.findUnique({
      where: { workerId: user.id },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check if sufficient balance
    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Check minimum withdrawal amount (e.g., $1.00)
    if (amount < 1.00) {
      throw new Error('Minimum withdrawal amount is $1.00');
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        walletId: wallet.id,
        amount,
        method,
        destination,
        status: WithdrawalStatus.PENDING,
      },
    });

    // TODO: In a real implementation, we would:
    // 1. Create a wallet transaction of type WITHDRAWAL (pending)
    // 2. Initiate the actual payment process (M-Pesa, bank transfer, etc.)
    // 3. Update withdrawal status based on payment result
    // 4. Create corresponding wallet transaction when completed

    // For now, we'll just return void as the action completed successfully
    return;
  } catch (error) {
    console.error('Withdrawal request error:', error);
    // In a real app, we'd handle form errors properly
    // For now, we'll just throw the error
    throw error;
  }
}