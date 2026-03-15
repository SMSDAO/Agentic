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
