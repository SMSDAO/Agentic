import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createSupabaseAdmin } from '@/lib/supabase/client';

/**
 * Server-side layout that guards all /admin routes.
 * Redirects to / if the user is not authenticated or does not have the
 * admin or super_admin role in public.users.
 */
export default async function AdminRouteLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const adminSupabase = createSupabaseAdmin();
  const { data: userData, error: roleError } = await adminSupabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError) {
    // eslint-disable-next-line no-console
    console.error('Admin role lookup failed in layout:', roleError);
    redirect('/');
  }

  if (!userData || !['admin', 'super_admin'].includes(userData.role as string)) {
    redirect('/');
  }

  return <>{children}</>;
}
