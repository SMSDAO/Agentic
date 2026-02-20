import { supabase, APIKey } from '../supabase';
import * as crypto from 'crypto';

function hashAPIKey(key: string): string {
  const hash = crypto.createHash('sha256').update(Buffer.from(key, 'utf8')).digest('hex');
  return hash;
}

function generateAPIKey(): { key: string; prefix: string; hash: string } {
  const key = `ag_${crypto.randomBytes(32).toString('hex')}`;
  const prefix = key.substring(0, 10);
  const hash = hashAPIKey(key);
  return { key, prefix, hash };
}

export async function listAPIKeys(userId?: string): Promise<APIKey[]> {
  let query = supabase.from('api_keys').select('*').order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export interface CreateAPIKeyInput {
  userId: string;
  name: string;
  scopes?: string[];
  rateLimits?: {
    requests_per_minute?: number;
    requests_per_hour?: number;
  };
  expiresAt?: string;
}

export async function createAPIKey(input: CreateAPIKeyInput): Promise<{
  apiKey: APIKey;
  plainKey: string;
}> {
  const { key, prefix, hash } = generateAPIKey();

  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      {
        user_id: input.userId,
        key_hash: hash,
        key_prefix: prefix,
        name: input.name,
        scopes: input.scopes || ['read'],
        rate_limits: input.rateLimits || {
          requests_per_minute: 60,
          requests_per_hour: 1000,
        },
        expires_at: input.expiresAt,
        enabled: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    apiKey: data,
    plainKey: key, // Return plain key only once
  };
}

export async function revokeAPIKey(keyId: string): Promise<void> {
  const { error } = await supabase.from('api_keys').update({ enabled: false }).eq('id', keyId);

  if (error) throw error;
}

export async function deleteAPIKey(keyId: string): Promise<void> {
  const { error } = await supabase.from('api_keys').delete().eq('id', keyId);

  if (error) throw error;
}

export async function updateAPIKeyRateLimits(
  keyId: string,
  rateLimits: {
    requests_per_minute?: number;
    requests_per_hour?: number;
  }
): Promise<APIKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ rate_limits: rateLimits })
    .eq('id', keyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAPIKeyBilling(
  keyId: string,
  billingConfig: Record<string, any>
): Promise<APIKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ billing_config: billingConfig })
    .eq('id', keyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// SDK Configs
export async function listSDKConfigs(): Promise<any[]> {
  const { data, error } = await supabase.from('sdk_configs').select('*').order('sdk_type');

  if (error) throw error;
  return data || [];
}

export async function updateSDKConfig(
  sdkType: string,
  updates: {
    version?: string;
    endpoint?: string;
    enabled?: boolean;
    config?: Record<string, any>;
  }
): Promise<any> {
  const { data, error } = await supabase
    .from('sdk_configs')
    .update(updates)
    .eq('sdk_type', sdkType)
    .select()
    .single();

  if (error) throw error;
  return data;
}
