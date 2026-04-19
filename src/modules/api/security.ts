import type { NextRequest } from 'next/server';
import { createRateLimiter } from '@/services/ai/rate-limiting';

export interface ApiConsumer {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  apiKey: string;
}

const DEFAULT_CONSUMER: ApiConsumer = {
  id: 'default-dev',
  plan: 'free',
  apiKey: 'dev-local-key',
};

const consumerRateLimiter = createRateLimiter({
  maxRequests: Number(process.env.SAAS_RATE_LIMIT_MAX ?? 60),
  windowMs: Number(process.env.SAAS_RATE_LIMIT_WINDOW_MS ?? 60_000),
});

const usageStore = new Map<string, number>();

function parseConsumersFromEnv(): ApiConsumer[] {
  const raw = process.env.SAAS_API_KEYS;
  if (!raw) {
    return [DEFAULT_CONSUMER];
  }

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, apiKey, plan] = entry.split(':');
      return {
        id: id || 'unknown',
        apiKey: apiKey || '',
        plan: plan === 'pro' || plan === 'enterprise' ? plan : 'free',
      } as ApiConsumer;
    })
    .filter((consumer) => consumer.apiKey.length > 0);
}

const consumers = parseConsumersFromEnv();

function getApiKeyFromRequest(request: NextRequest): string {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) {
    return headerKey;
  }

  const auth = request.headers.get('authorization');
  if (!auth) {
    return '';
  }

  const [, token] = auth.split(' ');
  return token ?? '';
}

export function authenticateApiKey(request: NextRequest): ApiConsumer | null {
  const apiKey = getApiKeyFromRequest(request);
  if (!apiKey) {
    return null;
  }

  return consumers.find((consumer) => consumer.apiKey === apiKey) ?? null;
}

export function enforceRateLimit(consumerId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  return consumerRateLimiter.check(consumerId);
}

export function recordUsage(consumerId: string): number {
  const current = usageStore.get(consumerId) ?? 0;
  const next = current + 1;
  usageStore.set(consumerId, next);
  return next;
}
