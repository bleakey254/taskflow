import { timingSafeEqual } from 'crypto';

// Helpers shared by the payment action and the M-Pesa webhook route. They live
// outside the 'use server' module because only async functions may be exported
// from a server-action file.

export interface MpesaCallbackResult {
  success: boolean;
  status: number;
  message: string;
}

// Payment simulation is a development convenience, never a production default.
export function isPaymentSimulationEnabled(): boolean {
  if (process.env.MPESA_SIMULATE === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

// Verify the shared secret that authenticates provider callbacks. With no
// secret configured the endpoint stays closed.
export function verifyWebhookSecret(provided: string | null): boolean {
  const expected = process.env.MPESA_WEBHOOK_SECRET;
  if (!expected || !provided) return false;

  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(provided, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, providedBuffer);
}
