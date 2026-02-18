import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin } from '@/lib/supabase/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = createSupabaseAdmin();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const role = searchParams.get('role') || 'all';

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range((page - 1) * perPage, page * perPage - 1)
      .order('created_at', { ascending: false });

    if (search) {
      // Sanitize search input by escaping special characters
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(`email.ilike.%${sanitizedSearch}%,full_name.ilike.%${sanitizedSearch}%`);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (role !== 'all') {
      query = query.eq('role', role);
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Failed to fetch users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      users: users || [],
      totalPages: Math.ceil((count || 0) / perPage),
      total: count || 0,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
