import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export interface Agent {
  id: string;
  name: string;
  type: 'builder' | 'worker' | 'crawler' | 'generator' | 'sync';
  status: 'active' | 'paused' | 'error';
  description?: string;
  avatar_url?: string;
  model: string;
  temperature: number;
  max_tokens: number;
  memory: 'short' | 'long' | 'vector';
  config: {
    retries: number;
    timeout_ms: number;
    concurrency: number;
    memory_limit: number;
  };
  limits: {
    daily_calls: number;
    monthly_calls: number;
    per_user_limit: number;
  };
  billing: {
    cost_per_call: number;
    cost_per_token: number;
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  wallet_address?: string;
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  status: 'active' | 'suspended' | 'banned';
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  credits_included: number;
  features: string[];
  limits: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Fee {
  id: string;
  fee_type: 'base' | 'network' | 'agent' | 'priority';
  amount: number;
  percentage?: number;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletConnector {
  id: string;
  name: string;
  display_name: string;
  connector_type: 'phantom' | 'solflare' | 'backpack' | 'ledger' | 'coinbase' | 'walletconnect';
  enabled: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PriceOracle {
  id: string;
  name: string;
  oracle_type: 'pyth' | 'coinbase' | 'chainlink' | 'custom';
  enabled: boolean;
  priority: number;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RPCEndpoint {
  id: string;
  name: string;
  url: string;
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  endpoint_type: 'http' | 'websocket';
  priority: number;
  enabled: boolean;
  rate_limit: number;
  proxy_mode: boolean;
  health_status: 'healthy' | 'unhealthy' | 'unknown';
  created_at: string;
  updated_at: string;
}

export interface Addon {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  addon_type: 'ai_builder' | 'nft_generator' | 'defi_automation' | 'market_scanner' | 'webhook' | 'custom_tool';
  version: string;
  enabled: boolean;
  installed: boolean;
  config_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface APIKey {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  name: string;
  scopes: string[];
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
  };
  billing_config: Record<string, any>;
  enabled: boolean;
  last_used?: string;
  expires_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  agent_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure' | 'error';
  created_at: string;
}

export interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}
