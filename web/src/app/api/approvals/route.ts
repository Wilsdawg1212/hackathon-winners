import { NextResponse } from 'next/server';
import { getQueued } from '@/lib/store';

export async function GET() {
  try {
    const queuedItems = getQueued();
    return NextResponse.json(queuedItems);
  } catch (error) {
    console.error('Approvals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
