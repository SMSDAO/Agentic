/**
 * Client-safe AI utilities — no server secrets, no Node-only SDKs.
 *
 * Import from here in both server and client components:
 *   import { truncateToTokenLimit } from '@/services/ai/utils';
 *
 * For server-only AI clients (LangChain / OpenAI) use '@/services/ai'.
 */

export { optimizePrompt, buildSystemPrompt, truncateToTokenLimit } from './prompt-optimization';
export type { PromptContext } from './prompt-optimization';

export { TokenTracker, createTokenTracker } from './token-tracking';
export type { TokenUsageRecord, TokenStats } from './token-tracking';

export { RateLimiter, createRateLimiter } from './rate-limiting';
export type { RateLimitConfig, RateLimitResult } from './rate-limiting';

export { withFallback, FallbackChain } from './fallback-handlers';
export type { AsyncFn } from './fallback-handlers';
