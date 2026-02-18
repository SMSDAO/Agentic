import { NextResponse } from 'next/server';
import { getSession, getUser } from '@/lib/supabase/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ session: null, user: null });
    }

    const user = await getUser();

    return NextResponse.json({ session, user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
