import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// TODO: Implement authentication and authorization check here.
// This function should only be accessible to administrators.
async function isAdmin(request: NextRequest): Promise<boolean> {
  // Replace with your actual authentication logic
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase.from('budgets').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { address, budget } = await request.json();

  if (!address || budget === undefined) {
    return NextResponse.json({ error: 'Address and budget are required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('budgets').insert([{ address, budget }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { address, budget } = await request.json();

  if (!address || budget === undefined) {
    return NextResponse.json({ error: 'Address and budget are required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('budgets').update({ budget }).eq('address', address);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
