import type { NextRequest } from 'next/server';
import { jsonError } from '@/modules/api/http';
import { authenticateApiKey, enforceRateLimit, recordUsage } from '@/modules/api/security';

export function withApiAccess(request: NextRequest):
  | { headers: Record<string, string> }
  | { error: ReturnType<typeof jsonError> } {
  const consumer = authenticateApiKey(request);
  if (!consumer) {
    return { error: jsonError('Invalid API key', 401) };
  }

  const limit = enforceRateLimit(consumer.id);
  if (!limit.allowed) {
    return { error: jsonError('Rate limit exceeded', 429) };
  }

  const usage = recordUsage(consumer.id);
  return { headers: { 'x-usage-count': String(usage) } };
}
