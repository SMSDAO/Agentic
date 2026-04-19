import type { NextRequest } from 'next/server';
import { createRateLimiter } from '@/services/ai/rate-limiting';
import { logger } from '@/modules/safety/logger';

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

/**
 * In-memory usage storage resets on deploy/restart.
 * Replace with Redis/Postgres-backed usage metering for billing-grade durability.
 */
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
      const parts = entry.split(':');
      if (parts.length !== 3) {
        logger.warn('Skipping malformed SAAS_API_KEYS entry', { entry });
        return null;
      }

      const [id, apiKey, plan] = parts;
      return {
        id: id || 'unknown',
        apiKey: apiKey || '',
        plan: plan === 'pro' || plan === 'enterprise' ? plan : 'free',
      } as ApiConsumer;
    })
    .filter((consumer): consumer is ApiConsumer => consumer !== null && consumer.apiKey.length > 0);
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

  const parts = auth.split(' ');
  if (parts.length < 2) {
    return '';
  }

  return parts[1];
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
