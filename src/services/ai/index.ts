/**
 * AI service router — single entry point for all AI capabilities.
 *
 * Server-only: this index re-exports modules that read server secrets and
 * import Node-only SDKs. Do not import from client components.
 * Client-safe utilities (prompt helpers) are available directly from
 * '@/services/ai/prompt-optimization'.
 */

import 'server-only';

export { createLangChainService, SolanaAgent } from './langchain-service';
export { createOpenAIService } from './openai-service';
export { optimizePrompt, buildSystemPrompt, truncateToTokenLimit } from './prompt-optimization';
export { TokenTracker, createTokenTracker } from './token-tracking';
export { RateLimiter, createRateLimiter } from './rate-limiting';
export { withFallback, FallbackChain } from './fallback-handlers';
