import { supabase, PriceOracle } from '../supabase';

// ============================================================================
// Price Oracles
// ============================================================================

export async function listOracles(): Promise<PriceOracle[]> {
  const { data, error } = await supabase
    .from('price_oracles')
    .select('*')
    .order('priority');

  if (error) throw error;
  return data || [];
}

export async function updateOracle(
  id: string,
  updates: {
    enabled?: boolean;
    priority?: number;
    config?: Record<string, any>;
  }
): Promise<PriceOracle> {
  const { data, error } = await supabase
    .from('price_oracles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Oracle Feeds
// ============================================================================

export interface CreateFeedInput {
  oracleId: string;
  symbol: string;
  feedId: string;
  tokenAddress?: string;
  refreshIntervalSeconds?: number;
}

export async function listFeeds(oracleId?: string): Promise<any[]> {
  let query = supabase.from('oracle_feeds').select('*').order('symbol');

  if (oracleId) {
    query = query.eq('oracle_id', oracleId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createFeed(input: CreateFeedInput): Promise<any> {
  const { data, error } = await supabase
    .from('oracle_feeds')
    .insert([
      {
        oracle_id: input.oracleId,
        symbol: input.symbol,
        feed_id: input.feedId,
        token_address: input.tokenAddress,
        refresh_interval_seconds: input.refreshIntervalSeconds || 60,
        enabled: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFeed(
  id: string,
  updates: {
    refreshIntervalSeconds?: number;
    enabled?: boolean;
    lastPrice?: number;
  }
): Promise<any> {
  const { data, error } = await supabase
    .from('oracle_feeds')
    .update({
      refresh_interval_seconds: updates.refreshIntervalSeconds,
      enabled: updates.enabled,
      last_price: updates.lastPrice,
      last_updated:
        updates.lastPrice !== undefined ? new Date().toISOString() : undefined,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFeed(id: string): Promise<void> {
  const { error } = await supabase.from('oracle_feeds').delete().eq('id', id);

  if (error) throw error;
}

export async function overridePrice(feedId: string, price: number): Promise<void> {
  await updateFeed(feedId, { lastPrice: price });
}
