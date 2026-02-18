import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, wallet_address } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const data = await signUp(email, password, {
      full_name,
      wallet_address,
    });

    return NextResponse.json({ session: data.session, user: data.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sign up' },
      { status: 400 }
    );
  }
}
