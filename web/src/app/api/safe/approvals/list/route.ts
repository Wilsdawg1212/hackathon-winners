import { NextResponse } from 'next/server';

const SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS || '0x0000000000000000000000000000000000000000';

export async function GET() {
  try {
    // Return empty array for now since Safe integration is not fully set up
    // This prevents the JSON parsing error
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending transactions' },
      { status: 500 }
    );
  }
}
