import { NextRequest, NextResponse } from 'next/server';
import { appendActivity } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { to, token, amountDecimal, from } = await request.json();
    
    if (!to || !token || !amountDecimal || !from) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate a successful payment
    // In production, this would integrate with real Safe contracts
    
    // Log the transaction as executed for demo
    await appendActivity({
      type: 'EXECUTED',
      to,
      token: token === 'native' ? 'ETH' : token,
      amount: amountDecimal,
      actor: from,
      tx_hash: '0x' + Math.random().toString(16).substr(2, 64), // Demo tx hash
    });

    return NextResponse.json({
      success: true,
      data: {
        decision: 'Allow',
        status: 'Executed',
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
      },
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
