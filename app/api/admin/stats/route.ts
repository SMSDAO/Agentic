import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin } from '@/lib/supabase/auth';

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createSupabaseAdmin();

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active users (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', yesterday);

    // Get total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get transaction volume
    const { data: volumeData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'confirmed');

    const totalVolume = (volumeData || []).reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Get active agents
    const { count: activeAgents } = await supabase
      .from('agent_configurations')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get total value (from DeFi positions)
    const { data: positions } = await supabase
      .from('defi_positions')
      .select('value_usd');

    const totalValue = (positions || []).reduce((sum, pos) => sum + Number(pos.value_usd), 0);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalTransactions: totalTransactions || 0,
      totalVolume,
      activeAgents: activeAgents || 0,
      totalValue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
