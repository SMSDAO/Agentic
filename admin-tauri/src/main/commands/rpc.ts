import { supabase, RPCEndpoint } from '../supabase';

export async function listRPCEndpoints(network?: string): Promise<RPCEndpoint[]> {
  let query = supabase.from('rpc_endpoints').select('*').order('priority', { ascending: false });

  if (network) {
    query = query.eq('network', network);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export interface CreateRPCInput {
  name: string;
  url: string;
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  endpointType: 'http' | 'websocket';
  priority?: number;
  rateLimit?: number;
  proxyMode?: boolean;
}

export async function createRPC(input: CreateRPCInput): Promise<RPCEndpoint> {
  const { data, error } = await supabase
    .from('rpc_endpoints')
    .insert([
      {
        name: input.name,
        url: input.url,
        network: input.network,
        endpoint_type: input.endpointType,
        priority: input.priority || 0,
        rate_limit: input.rateLimit || 100,
        proxy_mode: input.proxyMode || false,
        enabled: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRPC(
  id: string,
  updates: {
    enabled?: boolean;
    priority?: number;
    rateLimit?: number;
    proxyMode?: boolean;
  }
): Promise<RPCEndpoint> {
  const { data, error } = await supabase
    .from('rpc_endpoints')
    .update({
      enabled: updates.enabled,
      priority: updates.priority,
      rate_limit: updates.rateLimit,
      proxy_mode: updates.proxyMode,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRPC(id: string): Promise<void> {
  const { error } = await supabase.from('rpc_endpoints').delete().eq('id', id);

  if (error) throw error;
}

export async function checkRPCHealth(id: string): Promise<'healthy' | 'unhealthy'> {
  // TODO: Implement actual health check
  // This would ping the RPC endpoint and check response
  const status: 'healthy' | 'unhealthy' = 'healthy';

  // Update health status in database
  await supabase
    .from('rpc_endpoints')
    .update({
      health_status: status,
      last_health_check: new Date().toISOString(),
    })
    .eq('id', id);

  return status;
}
