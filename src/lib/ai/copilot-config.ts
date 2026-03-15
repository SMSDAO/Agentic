import 'server-only';
import { createSupabaseAdmin } from '@/lib/supabase/client';

export interface IntentMapping {
  id?: string;
  intentKeywords: string[];
  route: string;
  featureName: string;
  description: string;
  isActive: boolean;
  priority: number;
}

export interface FeeConfig {
  id?: string;
  feeType: string;
  amountSol: number;
  reserveAddress: string | null;
  autoForward: boolean;
  isActive: boolean;
}

export enum CopilotCapability {
  BALANCE_CHECK = 'balance_check',
  TOKEN_TRANSFER = 'token_transfer',
  ZK_AIRDROP = 'zk_airdrop',
  JUPITER_SWAP = 'jupiter_swap',
  NFT_MINT = 'nft_mint',
  NFT_COLLECTION = 'nft_collection',
  NFT_LISTING = 'nft_listing',
  MARKET_DATA = 'market_data',
  STAKING = 'staking',
  LIQUIDITY = 'liquidity',
  BRIDGE = 'bridge',
  SIGNALS = 'signals',
  TIMELINE = 'timeline',
  AI_CHAT = 'ai_chat',
  YIELD_FARMING = 'yield_farming',
  PERPETUALS = 'perpetuals',
  LENDING = 'lending',
  MEV_BUNDLES = 'mev_bundles',
  ORACLE = 'oracle',
}

export interface CopilotResponsePattern {
  capability: string;
  route: string;
  feature: string;
  description: string;
}

// Hardcoded defaults used as fallback when DB is unavailable
const DEFAULT_FEE_CONFIG: FeeConfig[] = [
  { feeType: 'admin_dev_fee',   amountSol: 0.0000022, reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'mint_fee',        amountSol: 0.000022,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'transfer_fee',    amountSol: 0.000005,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'airdrop_fee',     amountSol: 0.000001,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'nft_mint_fee',    amountSol: 0.000022,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'nft_listing_fee', amountSol: 0.000011,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
  { feeType: 'defi_swap_fee',   amountSol: 0.000010,  reserveAddress: 'monads.skr', autoForward: true, isActive: true },
];

const DEFAULT_INTENT_MAPPINGS: IntentMapping[] = [
  { intentKeywords: ['launch a token', 'create token', 'deploy token'], route: '/tokens',    featureName: 'Deploy SPL Token',   description: 'Deploy a new SPL token on Solana',               isActive: true, priority: 100 },
  { intentKeywords: ['send tokens', 'transfer'],                         route: '/tokens',    featureName: 'Transfer Tokens',    description: 'Send SPL tokens to another wallet',              isActive: true, priority: 90  },
  { intentKeywords: ['airdrop', 'mass send', 'zk airdrop'],             route: '/tokens',    featureName: 'ZK Airdrop',         description: 'Compressed airdrop via Light Protocol',          isActive: true, priority: 85  },
  { intentKeywords: ['swap', 'exchange', 'trade'],                       route: '/defi',      featureName: 'Jupiter Swap',       description: 'Token swap via Jupiter aggregator',              isActive: true, priority: 80  },
  { intentKeywords: ['mint nft', 'create nft'],                          route: '/nfts',      featureName: 'Mint NFT',           description: 'Mint a new NFT via Metaplex',                    isActive: true, priority: 75  },
  { intentKeywords: ['create collection', 'nft collection'],             route: '/nfts',      featureName: 'Create Collection',  description: 'Create Metaplex NFT collection',                 isActive: true, priority: 70  },
  { intentKeywords: ['list nft', 'sell nft'],                            route: '/nfts',      featureName: '3.Land Listing',     description: 'List NFT on 3.Land marketplace',                 isActive: true, priority: 65  },
  { intentKeywords: ['check balance', 'my portfolio', 'holdings'],       route: '/dashboard', featureName: 'Portfolio Overview', description: 'View wallet balances and holdings',              isActive: true, priority: 60  },
  { intentKeywords: ['market', 'trending', 'prices'],                    route: '/market',    featureName: 'Market Data',        description: 'View trending tokens and market data',           isActive: true, priority: 55  },
  { intentKeywords: ['stake', 'staking'],                                route: '/defi',      featureName: 'Staking',            description: 'Stake tokens via supported protocols',           isActive: true, priority: 50  },
  { intentKeywords: ['provide liquidity', 'LP', 'pool'],                 route: '/defi',      featureName: 'Liquidity Pool',     description: 'Add liquidity to DEX pools',                     isActive: true, priority: 45  },
  { intentKeywords: ['bridge', 'cross-chain'],                           route: '/defi',      featureName: 'deBridge DLN',       description: 'Cross-chain bridge via deBridge',                isActive: true, priority: 40  },
  { intentKeywords: ['signals', 'alerts', 'notifications'],              route: '/signals',   featureName: 'Trading Signals',    description: 'View and manage trading signals',                isActive: true, priority: 35  },
  { intentKeywords: ['timeline', 'activity', 'history'],                 route: '/timeline',  featureName: 'Activity Timeline',  description: 'View transaction and activity history',          isActive: true, priority: 30  },
  { intentKeywords: ['ask ai', 'chat', 'help'],                          route: '/ai-agent',  featureName: 'AI Agent Chat',      description: 'Interactive AI assistant',                       isActive: true, priority: 25  },
  { intentKeywords: ['farm', 'yield', 'farming'],                        route: '/defi',      featureName: 'Yield Farming',      description: 'Yield farming via Raydium/Orca/Meteora',         isActive: true, priority: 20  },
  { intentKeywords: ['leverage', 'perps', 'perpetuals'],                 route: '/defi',      featureName: 'Drift Perpetuals',   description: 'Leveraged trading via Drift Protocol',           isActive: true, priority: 15  },
  { intentKeywords: ['lend', 'borrow', 'lending'],                       route: '/defi',      featureName: 'Kamino Lending',     description: 'Lending/borrowing via Kamino',                   isActive: true, priority: 10  },
  { intentKeywords: ['bundle', 'jito', 'mev'],                           route: '/defi',      featureName: 'Jito Bundles',       description: 'MEV-protected transaction bundles',              isActive: true, priority: 5   },
  { intentKeywords: ['oracle', 'price feed'],                            route: '/market',    featureName: 'Pyth Oracle',        description: 'Real-time price feeds via Pyth',                 isActive: true, priority: 1   },
];

/**
 * Fetch active fee schedule from DB; falls back to hardcoded defaults on error.
 */
export async function getActiveFeeSchedule(): Promise<FeeConfig[]> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_fee_config')
      .select('*')
      .eq('is_active', true)
      .order('fee_type');
    if (error || !data || data.length === 0) {
      return DEFAULT_FEE_CONFIG;
    }
    return data.map((row) => ({
      id: row.id,
      feeType: row.fee_type,
      amountSol: Number(row.amount_sol),
      reserveAddress: row.reserve_address,
      autoForward: row.auto_forward,
      isActive: row.is_active,
    }));
  } catch {
    return DEFAULT_FEE_CONFIG;
  }
}

/**
 * Fetch active intent mappings from DB; falls back to hardcoded defaults on error.
 */
export async function getActiveIntentMappings(): Promise<IntentMapping[]> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_intent_mappings')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });
    if (error || !data || data.length === 0) {
      return DEFAULT_INTENT_MAPPINGS;
    }
    return data.map((row) => ({
      id: row.id,
      intentKeywords: row.intent_keywords,
      route: row.route,
      featureName: row.feature_name,
      description: row.description,
      isActive: row.is_active,
      priority: row.priority,
    }));
  } catch {
    return DEFAULT_INTENT_MAPPINGS;
  }
}

/**
 * Map a natural-language intent to a platform route + feature.
 * Tries DB mappings first, then falls back to hardcoded defaults.
 */
export async function mapIntentToRoute(
  intent: string,
): Promise<CopilotResponsePattern | null> {
  const mappings = await getActiveIntentMappings();
  const lower = intent.toLowerCase();

  const sorted = [...mappings].sort((a, b) => b.priority - a.priority);
  for (const mapping of sorted) {
    if (mapping.intentKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return {
        capability: mapping.featureName,
        route: mapping.route,
        feature: mapping.featureName,
        description: mapping.description,
      };
    }
  }
  return null;
}
