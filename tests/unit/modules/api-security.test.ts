import { describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

function makeRequest(headers: Record<string, string>): NextRequest {
  return {
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  } as unknown as NextRequest;
}

describe('api security', () => {
  it('supports bearer authorization scheme only', async () => {
    process.env.SAAS_API_KEYS = 'tenant-a:key-a:pro';
    process.env.SAAS_RATE_LIMIT_MAX = '2';
    process.env.SAAS_RATE_LIMIT_WINDOW_MS = '60000';
    process.env.NODE_ENV = 'test';

    vi.resetModules();
    const security = await import('@/modules/api/security');

    const bearerRequest = makeRequest({ authorization: 'Bearer key-a' });
    expect(security.authenticateApiKey(bearerRequest)?.id).toBe('tenant-a');

    const basicRequest = makeRequest({ authorization: 'Basic key-a' });
    expect(security.authenticateApiKey(basicRequest)).toBeNull();
  });

  it('authenticates configured API keys and tracks usage', async () => {
    process.env.SAAS_API_KEYS = 'tenant-a:key-a:pro';
    process.env.SAAS_RATE_LIMIT_MAX = '2';
    process.env.SAAS_RATE_LIMIT_WINDOW_MS = '60000';
    process.env.NODE_ENV = 'test';

    vi.resetModules();
    const security = await import('@/modules/api/security');

    const request = makeRequest({ 'x-api-key': 'key-a' });
    const consumer = security.authenticateApiKey(request);

    expect(consumer?.id).toBe('tenant-a');
    expect(security.recordUsage('tenant-a')).toBe(1);
    expect(security.recordUsage('tenant-a')).toBe(2);
  });

  it('rejects unknown API keys and enforces limits', async () => {
    process.env.SAAS_API_KEYS = 'tenant-b:key-b:free';
    process.env.SAAS_RATE_LIMIT_MAX = '1';
    process.env.SAAS_RATE_LIMIT_WINDOW_MS = '60000';
    process.env.NODE_ENV = 'test';

    vi.resetModules();
    const security = await import('@/modules/api/security');

    const invalid = makeRequest({ 'x-api-key': 'wrong' });
    expect(security.authenticateApiKey(invalid)).toBeNull();

    const first = security.enforceRateLimit('tenant-b');
    const second = security.enforceRateLimit('tenant-b');

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(false);
  });

  it('fails closed in production when SAAS_API_KEYS is missing', async () => {
    delete process.env.SAAS_API_KEYS;
    process.env.NODE_ENV = 'production';

    vi.resetModules();
    const security = await import('@/modules/api/security');
    const request = makeRequest({ 'x-api-key': 'dev-local-key' });

    expect(security.authenticateApiKey(request)).toBeNull();
  });
});
