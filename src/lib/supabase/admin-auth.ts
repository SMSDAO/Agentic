import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from './client';

/**
 * Verifies the current request is authenticated as an admin or super_admin.
 * Returns a 401/403 NextResponse on failure, or null on success.
 */
export async function requireAdminRole(): Promise<NextResponse | null> {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminSupabase = createSupabaseAdmin();
  const { data, error: roleError } = await adminSupabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError) {
    // eslint-disable-next-line no-console
    console.error('Admin role lookup failed:', roleError);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!data || !['admin', 'super_admin'].includes(data.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
