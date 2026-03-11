# AI Services Guide

## Overview

AI functionality is provided by LangChain (`@langchain/openai`, `@langchain/core`) with an optional direct OpenAI path for simpler use cases.

The service layer lives in `src/services/ai/`:

| Module | Purpose |
|--------|---------|
| `langchain-service.ts` | LangChain-based Solana agent |
| `openai-service.ts` | Direct OpenAI completions and image generation |
| `prompt-optimization.ts` | Prompt engineering utilities |
| `token-tracking.ts` | Usage monitoring |
| `rate-limiting.ts` | API call protection |
| `fallback-handlers.ts` | Error recovery |

### Entry points

| Import path | Guard | Use in |
|-------------|-------|--------|
| `@/services/ai` | `server-only` | Server components, API routes, Server Actions |
| `@/services/ai/utils` | *(none)* | Server **and** client components |

`@/services/ai` re-exports everything — use it in server-only code.  
`@/services/ai/utils` exports only client-safe utilities (prompt helpers, token tracking, rate limiting, fallback) — no environment variables or Node-only SDKs.

## LangChain Solana Agent

```typescript
import { createLangChainService } from '@/services/ai';

const agent = createLangChainService(); // reads OPENAI_API_KEY from env
const response = await agent.execute('What is the SOL balance of 8xrt...');
```

Built-in tools:
- `get_balance` — SOL balance for any address
- `get_token_balance` — SPL token balance

## Direct OpenAI Service

```typescript
import { createOpenAIService } from '@/services/ai';

const ai = createOpenAIService();

// Text completion
const text = await ai.complete('Explain liquid staking on Solana', {
  model: 'gpt-4',
  systemPrompt: 'You are a Solana DeFi expert.',
});

// Image generation
const urls = await ai.generateImage('Solana blockchain visualization', {
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'hd',
});
```

## Prompt Engineering

These utilities are **client-safe** — import from `@/services/ai/utils` in both server
and client components:

```typescript
import { buildSystemPrompt, optimizePrompt, truncateToTokenLimit } from '@/services/ai/utils';

const systemPrompt = buildSystemPrompt({
  network: 'mainnet-beta',
  walletAddress: '8xrt...',
  availableTools: ['get_balance', 'get_token_balance'],
});

const prompt = optimizePrompt(userInput, { network: 'mainnet-beta' });
const safe = truncateToTokenLimit(prompt, 2048);
```

## Rate Limiting

```typescript
import { createRateLimiter } from '@/services/ai/utils';

const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });
const result = limiter.check(userIp);
if (!result.allowed) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

> **Note**: The in-memory rate limiter does not persist across serverless invocations. For production use, replace with Vercel KV or similar.

## Fallback Handling

```typescript
import { withFallback, FallbackChain } from '@/services/ai/utils';

const result = await withFallback(
  () => gpt4Service.complete(prompt),
  () => gpt35Service.complete(prompt)
);

// Multiple providers
const chain = new FallbackChain<string>()
  .add(() => primaryProvider.complete(prompt))
  .add(() => fallbackProvider.complete(prompt));
const answer = await chain.execute();
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key (server-side only) |
