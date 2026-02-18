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
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .range((page - 1) * perPage, page * perPage - 1)
      .order('created_at', { ascending: false });

    if (type !== 'all') {
      query = query.eq('type', type);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: transactions, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      transactions: transactions || [],
      totalPages: Math.ceil((count || 0) / perPage),
      total: count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
