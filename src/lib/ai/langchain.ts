/**
 * Re-exports the canonical LangChain service implementation.
 * Import directly from '@/services/ai' for new code.
 *
 * Server-only: this module re-exports server-only code and must not be
 * imported from client components.
 */
import 'server-only';
export { SolanaAgent, createLangChainService, createSolanaAgent } from '@/services/ai/langchain-service';
