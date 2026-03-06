import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
export function createSupabaseClient() {
  return createClientComponentClient();
}

// Server-side Supabase client with service role
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types
export interface User {
  id: string;
  email: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  signature: string;
  type: 'transfer' | 'swap' | 'stake' | 'mint' | 'other';
  amount: number;
  token_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface TokenPortfolio {
  id: string;
  user_id: string;
  token_address: string;
  token_symbol: string;
  balance: number;
  value_usd: number;
  updated_at: string;
}

export interface NFTCollection {
  id: string;
  user_id: string;
  collection_address: string;
  name: string;
  symbol: string;
  total_supply: number;
  created_at: string;
}
