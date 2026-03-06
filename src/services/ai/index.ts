/**
 * AI service router — single entry point for all AI capabilities.
 *
 * Import from here rather than individual service files to allow
 * transparent provider switching and shared rate-limiting.
 */

export { createLangChainService, SolanaAgent } from './langchain-service';
export { createOpenAIService } from './openai-service';
export { optimizePrompt, buildSystemPrompt } from './prompt-optimization';
export { TokenTracker, createTokenTracker } from './token-tracking';
export { RateLimiter, createRateLimiter } from './rate-limiting';
export { withFallback, FallbackChain } from './fallback-handlers';
