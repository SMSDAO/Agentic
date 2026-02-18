import { supabase, Fee } from '../supabase';

// ============================================================================
// Global Fees
// ============================================================================

export async function listFees(): Promise<Fee[]> {
  const { data, error } = await supabase.from('fees').select('*').order('fee_type');

  if (error) throw error;
  return data || [];
}

export async function updateFee(
  feeType: 'base' | 'network' | 'agent' | 'priority',
  updates: { amount?: number; percentage?: number; active?: boolean }
): Promise<Fee> {
  const { data, error } = await supabase
    .from('fees')
    .update(updates)
    .eq('fee_type', feeType)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Fee Overrides
// ============================================================================

export async function setAgentFeeOverride(
  agentId: string,
  feeType: 'base' | 'network' | 'agent' | 'priority',
  amount: number,
  percentage?: number
): Promise<void> {
  const { error } = await supabase.from('fee_overrides').upsert([
    {
      agent_id: agentId,
      fee_type: feeType,
      amount,
      percentage,
      active: true,
    },
  ]);

  if (error) throw error;
}

export async function setUserFeeOverride(
  userId: string,
  feeType: 'base' | 'network' | 'agent' | 'priority',
  amount: number,
  percentage?: number
): Promise<void> {
  const { error } = await supabase.from('fee_overrides').upsert([
    {
      user_id: userId,
      fee_type: feeType,
      amount,
      percentage,
      active: true,
    },
  ]);

  if (error) throw error;
}

export async function listFeeOverrides(filters?: {
  agentId?: string;
  userId?: string;
}): Promise<any[]> {
  let query = supabase.from('fee_overrides').select('*');

  if (filters?.agentId) {
    query = query.eq('agent_id', filters.agentId);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function deleteFeeOverride(overrideId: string): Promise<void> {
  const { error } = await supabase.from('fee_overrides').delete().eq('id', overrideId);

  if (error) throw error;
}
