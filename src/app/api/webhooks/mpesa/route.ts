import { NextResponse } from 'next/server';
import { handleMpesaCallback } from '@/lib/mpesa';
import { verifyWebhookSecret } from '@/lib/payments';

function providedSecret(request: Request): string | null {
  const header =
    request.headers.get('x-mpesa-signature') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null;

  if (header) return header;

  return new URL(request.url).searchParams.get('secret');
}

export async function POST(request: Request) {
  if (!process.env.MPESA_WEBHOOK_SECRET) {
    // Refuse everything rather than accept unauthenticated callbacks.
    return NextResponse.json(
      { success: false, message: 'Webhook is not configured' },
      { status: 503 }
    );
  }

  if (!verifyWebhookSecret(providedSecret(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const result = await handleMpesaCallback(payload);

    return NextResponse.json(
      { success: result.success, message: result.message },
      { status: result.status }
    );
  } catch (error) {
    console.error('M-Pesa webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Provider health check; same authentication as the callback itself.
export async function GET(request: Request) {
  if (!process.env.MPESA_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false, message: 'Webhook is not configured' }, { status: 503 });
  }

  if (!verifyWebhookSecret(providedSecret(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: 'M-Pesa webhook endpoint is active' });
}
