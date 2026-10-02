import { NextResponse } from 'next/server';
import { handleMpesaCallback } from '@/actions/payment';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // Handle the M-Pesa callback
    const result = await handleMpesaCallback(requestData);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Callback processed successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to process callback' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('M-Pesa webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for verification (if needed by M-Pesa)
export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'M-Pesa webhook endpoint is active'
  });
}