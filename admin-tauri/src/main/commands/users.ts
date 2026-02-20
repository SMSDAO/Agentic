import { supabase, User } from '../supabase';

export interface UpdateUserInput {
  id: string;
  credits?: number;
  plan?: 'free' | 'pro' | 'enterprise';
  status?: 'active' | 'suspended' | 'banned';
  role?: 'user' | 'admin' | 'super_admin';
  rate_limits?: {
    requests_per_minute?: number;
    requests_per_hour?: number;
    requests_per_day?: number;
  };
}

// List all users
export async function listUsers(filters?: {
  plan?: string;
  status?: string;
  role?: string;
}): Promise<User[]> {
  let query = supabase.from('users').select('*').order('created_at', { ascending: false });

  if (filters?.plan) {
    query = query.eq('plan', filters.plan);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Get a single user by ID
export async function getUser(id: string): Promise<User> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

// Update user
export async function updateUser(input: UpdateUserInput): Promise<User> {
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Adjust user credits
export async function adjustCredits(userId: string, amount: number): Promise<User> {
  const user = await getUser(userId);
  const newCredits = Math.max(0, user.credits + amount);

  return updateUser({ id: userId, credits: newCredits });
}

// Adjust user plan
export async function adjustPlan(
  userId: string,
  plan: 'free' | 'pro' | 'enterprise'
): Promise<User> {
  return updateUser({ id: userId, plan });
}

// Freeze user account
export async function freezeAccount(userId: string): Promise<User> {
  return updateUser({ id: userId, status: 'suspended' });
}

// Unfreeze user account
export async function unfreezeAccount(userId: string): Promise<User> {
  return updateUser({ id: userId, status: 'active' });
}

// Ban user account
export async function banAccount(userId: string): Promise<User> {
  return updateUser({ id: userId, status: 'banned' });
}

// Get user usage statistics
export async function getUserUsage(userId: string): Promise<{
  transactions: number;
  apiCalls: number;
  agentExecutions: number;
}> {
  // Count transactions
  const { count: transactionsCount } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Count agent configurations (as proxy for executions)
  const { count: agentCount } = await supabase
    .from('agent_configurations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    transactions: transactionsCount || 0,
    apiCalls: 0, // TODO: Implement API call tracking
    agentExecutions: agentCount || 0,
  };
}

// Get user billing history
export async function getUserBillingHistory(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('billing_invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
