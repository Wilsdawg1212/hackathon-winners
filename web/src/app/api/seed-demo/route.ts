import { NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/store';

export async function POST() {
  try {
    seedDemoData();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to seed demo data:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}
