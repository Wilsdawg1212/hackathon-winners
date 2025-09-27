import { NextRequest, NextResponse } from 'next/server';
import { listActivity, appendActivity } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'EXECUTED' | 'PENDING' | 'BLOCKED' | undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const activities = await listActivity({ type, limit });
    
    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const activity = await appendActivity(body);
    
    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error appending activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to append activity' },
      { status: 500 }
    );
  }
}