export interface AgentStatus {
  id: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
  timestamp: number;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: number;
  price?: number;
}

export interface NFTMetadata {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface WalletSession {
  address: string;
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  authenticated: boolean;
  nftGated?: boolean;
}
