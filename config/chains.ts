/**
 * Solana network and program configuration.
 *
 * All RPC / cluster values are read at the call-site from environment variables
 * so this file remains framework-agnostic and usable outside Next.js.
 */

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';

export interface ChainConfig {
  network: SolanaNetwork;
  rpcUrl: string;
  wsUrl: string;
  explorerBaseUrl: string;
  /** Commitment level used by default for confirmations */
  commitment: 'processed' | 'confirmed' | 'finalized';
}

export const CHAIN_CONFIGS: Record<SolanaNetwork, ChainConfig> = {
  'mainnet-beta': {
    network: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    wsUrl: 'wss://api.mainnet-beta.solana.com',
    explorerBaseUrl: 'https://solscan.io',
    commitment: 'confirmed',
  },
  devnet: {
    network: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    wsUrl: 'wss://api.devnet.solana.com',
    explorerBaseUrl: 'https://solscan.io?cluster=devnet',
    commitment: 'confirmed',
  },
  testnet: {
    network: 'testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    wsUrl: 'wss://api.testnet.solana.com',
    explorerBaseUrl: 'https://solscan.io?cluster=testnet',
    commitment: 'confirmed',
  },
  localnet: {
    network: 'localnet',
    rpcUrl: 'http://127.0.0.1:8899',
    wsUrl: 'ws://127.0.0.1:8900',
    explorerBaseUrl: 'http://localhost:3000',
    commitment: 'confirmed',
  },
};

/**
 * Returns the active chain config from the provided network name.
 * Defaults to devnet when the network is unrecognised.
 */
export function getChainConfig(network?: string): ChainConfig {
  const key = (network ?? 'devnet') as SolanaNetwork;
  return CHAIN_CONFIGS[key] ?? CHAIN_CONFIGS['devnet'];
}

// ---------------------------------------------------------------------------
// Well-known program addresses
// ---------------------------------------------------------------------------

export const PROGRAMS = {
  /** Metaplex Token Metadata */
  TOKEN_METADATA: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  /** Metaplex Auction House */
  AUCTION_HOUSE: 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
  /** Metaplex Candy Machine v3 */
  CANDY_MACHINE_V3: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  /** Associated Token Program */
  ASSOCIATED_TOKEN: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRS',
  /** Token Program (SPL) */
  TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  /** System Program */
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
  /** Compute Budget */
  COMPUTE_BUDGET: 'ComputeBudget111111111111111111111111111111',
} as const;

// ---------------------------------------------------------------------------
// SPL token standards
// ---------------------------------------------------------------------------

export const TOKEN_STANDARDS = {
  /** Fungible token — standard SPL Token */
  FUNGIBLE: 'fungible',
  /** Non-fungible token — Metaplex NFT */
  NON_FUNGIBLE: 'non-fungible',
  /** Programmable NFT (pNFT) */
  PROGRAMMABLE_NFT: 'programmable-non-fungible',
} as const;

// ---------------------------------------------------------------------------
// Anchor / IDL helpers
// ---------------------------------------------------------------------------

/** Committed cluster identifier as expected by the Anchor provider */
export type AnchorCluster = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';

export function toAnchorCluster(network: SolanaNetwork): AnchorCluster {
  return network;
}
