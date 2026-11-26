import { prisma } from '@/lib/prisma';
import type { MpesaCallbackResult } from '@/lib/payments';
import { TaskStatus, PaymentStatus, NotificationType } from '@/types/prisma';

// Apply an M-Pesa callback to the matching payment. Safe to call repeatedly.
// This is deliberately NOT a server action: it must only be reachable through
// the authenticated webhook route, never by a direct action POST.
export async function handleMpesaCallback(requestData: unknown): Promise<MpesaCallbackResult> {
  const payload = requestData as {
    Body?: { stkCallback?: { CheckoutRequestID?: string; ResultCode?: number; ResultDesc?: string } };
    checkoutRequestId?: string;
    resultCode?: number;
    resultDesc?: string;
  } | null;

  const callback = payload?.Body?.stkCallback;
  const reference = callback?.CheckoutRequestID ?? payload?.checkoutRequestId;
  const resultCode = callback?.ResultCode ?? payload?.resultCode;
  const resultDesc = callback?.ResultDesc ?? payload?.resultDesc ?? '';

  if (!reference || resultCode === undefined) {
    return { success: false, status: 400, message: 'Missing checkout reference or result code' };
  }

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [{ providerTransactionId: reference }, { internalTransactionId: reference }],
    },
  });

  if (!payment) {
    return { success: false, status: 404, message: 'Unknown payment reference' };
  }

  // Already settled: acknowledge without moving money twice.
  if (payment.status === PaymentStatus.SUCCEEDED || payment.status === PaymentStatus.FAILED) {
    return { success: true, status: 200, message: 'Callback already processed' };
  }

  const succeeded = Number(resultCode) === 0;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: succeeded ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED,
        metadata: {
          ...(payment.metadata as Record<string, unknown> | null),
          callbackResultCode: resultCode,
          callbackResultDesc: resultDesc,
          callbackAt: new Date().toISOString(),
        },
      },
    });

    if (!succeeded) {
      await tx.notification.create({
        data: {
          recipientId: payment.userId,
          type: NotificationType.SYSTEM_UPDATE,
          title: 'Payment failed',
          message: `Your unlock payment could not be completed: ${resultDesc || 'provider declined the charge'}.`,
          relatedEntityType: 'Payment',
          relatedEntityId: payment.id,
        },
      });
      return;
    }

    if (!payment.taskId) return;

    const existing = await tx.taskUnlock.findFirst({
      where: { taskId: payment.taskId, workerId: payment.userId },
    });

    if (!existing) {
      await tx.taskUnlock.create({
        data: {
          taskId: payment.taskId,
          workerId: payment.userId,
          paymentId: payment.id,
          status: TaskStatus.UNLOCKED,
        },
      });
    }

    await tx.notification.create({
      data: {
        recipientId: payment.userId,
        type: NotificationType.SYSTEM_UPDATE,
        title: 'Task unlocked',
        message: `Your payment of $${Number(payment.amount.toString()).toFixed(2)} was confirmed and the task is unlocked.`,
        relatedEntityType: 'Task',
        relatedEntityId: payment.taskId,
      },
    });
  });

  return {
    success: true,
    status: 200,
    message: succeeded ? 'Payment confirmed' : 'Payment failure recorded',
  };
}
