import { supabase, WalletConnector } from '../supabase';

export async function listWalletConnectors(): Promise<WalletConnector[]> {
  const { data, error } = await supabase
    .from('wallet_connectors')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function updateWalletConnector(
  id: string,
  updates: {
    enabled?: boolean;
    config?: Record<string, any>;
  }
): Promise<WalletConnector> {
  const { data, error } = await supabase
    .from('wallet_connectors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setRPCEndpoint(
  connectorId: string,
  rpcEndpoint: string,
  fallbackRPC?: string
): Promise<WalletConnector> {
  return updateWalletConnector(connectorId, {
    config: {
      rpc_endpoint: rpcEndpoint,
      fallback_rpc: fallbackRPC,
    },
  });
}
