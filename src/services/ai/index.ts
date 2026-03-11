/**
 * Server-only AI service entry point.
 *
 * Imports Node-only SDKs and reads OPENAI_API_KEY from process.env.
 * Do NOT import from client components — use '@/services/ai/utils' instead
 * for client-safe utilities (prompt helpers, token tracking, rate limiting).
 */

import 'server-only';

export { createLangChainService, SolanaAgent } from './langchain-service';
export { createOpenAIService } from './openai-service';

// Re-export client-safe utilities so server code can use a single import path.
export * from './utils';
