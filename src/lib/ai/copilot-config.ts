/**
 * Agentic Copilot configuration.
 *
 * Exports the system prompt, capability enum, response-pattern type, and a
 * helper that maps natural-language user intents to platform routes.
 *
 * Server-only: do not import from client components.
 */
import 'server-only';
export { AGENTIC_COPILOT_SYSTEM_PROMPT as COPILOT_SYSTEM_PROMPT } from './agentic-copilot-system-prompt';
import { createSupabaseAdmin } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------

/** Supported Agentic Copilot capabilities. */
export enum CopilotCapability {
  BALANCE_CHECK = 'balance_check',
  TOKEN_TRANSFER = 'token_transfer',
  JUPITER_SWAP = 'jupiter_swap',
  NFT_MINT = 'nft_mint',
  NFT_LIST = 'nft_list',
  MARKET_ANALYSIS = 'market_analysis',
  DEFI_OPERATIONS = 'defi_operations',
  PORTFOLIO_SUMMARY = 'portfolio_summary',
}

// ---------------------------------------------------------------------------
// Response pattern
// ---------------------------------------------------------------------------

/**
 * Structured shape that every Agentic Copilot response should follow.
 * `direct_answer` is mandatory; all other fields are optional.
 */
export interface CopilotResponsePattern {
  /** Direct explanation of what the user asked. */
  direct_answer: string;
  /** Step-by-step instructions for the web app. */
  steps_web?: string[];
  /** Step-by-step instructions for the mobile app. */
  steps_mobile?: string[];
  /** Risks, caveats, or things to double-check before confirming. */
  risks?: string[];
  /** Suggested follow-up action or question. */
  next_action?: string;
}

// ---------------------------------------------------------------------------
// Intent → route mapping
// ---------------------------------------------------------------------------

/** Describes a platform feature mapped from a user intent. */
export interface IntentRouteMapping {
  /** App route, e.g. "/tokens". */
  route: string;
  /** Feature name within that route. */
  feature: string;
  /** Short description of what the user can do there. */
  description: string;
}

/**
 * Maps a natural-language intent string to the corresponding platform route
 * and feature.  The matching is case-insensitive and keyword-based.
 *
 * @param intent - Free-text description of what the user wants to do.
 * @returns The best-matching {@link IntentRouteMapping}, or the dashboard
 *   fallback when no keyword matches.
 */
export function mapIntentToRoute(intent: string): IntentRouteMapping {
  const lower = intent.toLowerCase();

  if (lower.includes('airdrop') || lower.includes('zk-airdrop')) {
    return {
      route: '/tokens',
      feature: 'ZK Airdrop (Light Protocol)',
      description: 'Perform a ZK-compressed airdrop to many recipients at low cost.',
    };
  }

  if (
    lower.includes('deploy token') ||
    lower.includes('launch token') ||
    lower.includes('create token') ||
    lower.includes('spl token')
  ) {
    return {
      route: '/tokens',
      feature: 'Deploy SPL Token',
      description: 'Deploy a new SPL token with name, symbol, logo, and supply.',
    };
  }

  if (lower.includes('transfer token') || lower.includes('send token')) {
    return {
      route: '/tokens',
      feature: 'Transfer Token',
      description: 'Transfer SPL tokens to one or more recipient addresses.',
    };
  }

  if (lower.includes('token')) {
    return {
      route: '/tokens',
      feature: 'Tokens',
      description: 'Manage SPL tokens: deploy, transfer, and airdrop.',
    };
  }

  if (lower.includes('mint nft') || lower.includes('create nft') || lower.includes('create collection')) {
    return {
      route: '/nfts',
      feature: 'Mint NFT / Create Collection',
      description: 'Mint Metaplex NFTs or create a new NFT collection.',
    };
  }

  if (lower.includes('list nft') || lower.includes('sell nft') || lower.includes('marketplace')) {
    return {
      route: '/nfts',
      feature: '3.Land Marketplace Listing',
      description: 'List an NFT for sale on the 3.Land marketplace.',
    };
  }

  if (lower.includes('nft') || lower.includes('gallery') || lower.includes('upload')) {
    return {
      route: '/nfts',
      feature: 'NFTs',
      description: 'Browse NFT gallery, upload artwork, create collections, and list on 3.Land.',
    };
  }

  if (lower.includes('swap')) {
    return {
      route: '/defi',
      feature: 'Jupiter Swap',
      description: 'Swap tokens using Jupiter aggregator for best-price routing.',
    };
  }

  if (lower.includes('stake') || lower.includes('farm') || lower.includes('liquidity') || lower.includes('pool')) {
    return {
      route: '/defi',
      feature: 'Liquidity / Staking',
      description: 'Provide liquidity, stake tokens, or farm yield via Raydium, Orca, Meteora, or Kamino.',
    };
  }

  if (lower.includes('defi') || lower.includes('raydium') || lower.includes('orca') ||
      lower.includes('meteora') || lower.includes('kamino') || lower.includes('drift') ||
      lower.includes('jupiter') || lower.includes('bridge') || lower.includes('jito')) {
    return {
      route: '/defi',
      feature: 'DeFi Protocols',
      description: 'Access Jupiter, Raydium, Orca, Meteora, Kamino, Drift, deBridge, and Jito.',
    };
  }

  if (lower.includes('market') || lower.includes('trend') || lower.includes('price') ||
      lower.includes('volume') || lower.includes('dominance') || lower.includes('cap')) {
    return {
      route: '/market',
      feature: 'Market Data',
      description: 'View trending tokens, market caps, volume, and BTC dominance.',
    };
  }

  if (lower.includes('signal')) {
    return {
      route: '/signals',
      feature: 'Signals',
      description: 'View trading signals and alerts.',
    };
  }

  if (lower.includes('timeline') || lower.includes('activity') || lower.includes('history')) {
    return {
      route: '/timeline',
      feature: 'Timeline',
      description: 'Browse recent on-chain activity and transaction history.',
    };
  }

  if (lower.includes('ai') || lower.includes('agent') || lower.includes('chat') || lower.includes('assistant')) {
    return {
      route: '/ai-agent',
      feature: 'AI Agent',
      description: 'Use the AI agent chat with capabilities sidebar and quick actions.',
    };
  }

  if (lower.includes('balance') || lower.includes('portfolio') || lower.includes('transaction')) {
    return {
      route: '/dashboard',
      feature: 'Portfolio Overview',
      description: 'View portfolio balance, recent transactions, and token/NFT distribution.',
    };
  }

  // Default fallback
  return {
    route: '/dashboard',
    feature: 'Dashboard',
    description: 'Start at the dashboard for a portfolio overview and quick navigation.',
  };
}

// ---------------------------------------------------------------------------
// Admin-configurable fee schedule and DB-backed intent mappings
// ---------------------------------------------------------------------------

/** Admin fee configuration row. */
export interface FeeConfig {
  id?: string;
  feeType: string;
  amountSol: number;
  reserveAddress: string | null;
  autoForward: boolean;
  isActive: boolean;
}

/** Admin intent mapping row (DB-backed). */
export interface IntentMapping {
  id?: string;
  intentKeywords: string[];
  route: string;
  featureName: string;
  description: string;
  isActive: boolean;
  priority: number;
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
      id: row.id as string,
      feeType: row.fee_type as string,
      amountSol: Number(row.amount_sol),
      reserveAddress: row.reserve_address as string | null,
      autoForward: row.auto_forward as boolean,
      isActive: row.is_active as boolean,
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
      id: row.id as string,
      intentKeywords: row.intent_keywords as string[],
      route: row.route as string,
      featureName: row.feature_name as string,
      description: (row.description as string | null) ?? '',
      isActive: row.is_active as boolean,
      priority: Number(row.priority),
    }));
  } catch {
    return DEFAULT_INTENT_MAPPINGS;
  }
}

/**
 * DB-backed async version of intent-to-route mapping.
 * Tries DB mappings first (sorted by priority), then falls back to hardcoded defaults.
 * Returns null when no keyword matches.
 *
 * @param intent - Free-text description of what the user wants to do.
 */
export async function mapIntentToRouteDB(intent: string): Promise<IntentRouteMapping | null> {
  const mappings = await getActiveIntentMappings();
  const lower = intent.toLowerCase();
  const sorted = [...mappings].sort((a, b) => b.priority - a.priority);
  for (const mapping of sorted) {
    if (mapping.intentKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return {
        route: mapping.route,
        feature: mapping.featureName,
        description: mapping.description,
      };
    }
  }
  return null;
}
