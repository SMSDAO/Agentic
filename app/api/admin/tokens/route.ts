import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin } from '@/lib/supabase/auth';

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createSupabaseAdmin();

    // Aggregate token stats
    const { data: portfolios } = await supabase
      .from('token_portfolios')
      .select('token_address, token_symbol, balance, value_usd');

    // Group by token
    const tokenMap = new Map<string, any>();
    (portfolios || []).forEach((p) => {
      if (!tokenMap.has(p.token_address)) {
        tokenMap.set(p.token_address, {
          token_address: p.token_address,
          token_symbol: p.token_symbol,
          total_holders: 0,
          total_supply: 0,
          total_value_usd: 0,
        });
      }
      const token = tokenMap.get(p.token_address);
      token.total_holders++;
      token.total_supply += Number(p.balance);
      token.total_value_usd += Number(p.value_usd);
    });

    const tokens = Array.from(tokenMap.values());

    return NextResponse.json({
      tokens,
      stats: {
        totalTokens: tokens.length,
        totalHolders: (portfolios || []).length,
        totalValue: tokens.reduce((sum, t) => sum + t.total_value_usd, 0),
        activeTokens: tokens.filter(t => t.total_holders > 0).length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
