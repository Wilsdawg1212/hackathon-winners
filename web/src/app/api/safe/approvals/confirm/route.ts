import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { safeTxHash } = await request.json();
    
    if (!safeTxHash) {
      return NextResponse.json(
        { success: false, error: 'Missing safeTxHash' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate successful confirmation
    return NextResponse.json({
      success: true,
      data: {
        status: 'Confirmed',
        message: 'Transaction confirmed (demo mode)',
      },
    });
  } catch (error) {
    console.error('Error confirming transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm transaction' },
      { status: 500 }
    );
  }
}
