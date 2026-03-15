import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_fee_audit_log')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/admin/fees/audit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
