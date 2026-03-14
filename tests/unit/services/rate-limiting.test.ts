import { describe, it, expect, vi, afterEach } from 'vitest';
import { RateLimiter, createRateLimiter } from '@/services/ai/rate-limiting';

describe('RateLimiter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within the limit', () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60_000 });
    const result = limiter.check('user1');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('tracks requests per identifier', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check('user1');
    limiter.check('user1');
    const result = limiter.check('user1');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('does not share limits between identifiers', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 60_000 });
    limiter.check('user1');
    const result = limiter.check('user2');
    expect(result.allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    vi.useFakeTimers();
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1_000 });
    limiter.check('user1');
    vi.advanceTimersByTime(1_001);
    const result = limiter.check('user1');
    expect(result.allowed).toBe(true);
  });

  it('purges expired entries', () => {
    vi.useFakeTimers();
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1_000 });
    limiter.check('user1');
    vi.advanceTimersByTime(1_001);
    limiter.purgeExpired();
    // After purge, the key should be gone; new check should succeed
    const result = limiter.check('user1');
    expect(result.allowed).toBe(true);
  });
});

describe('createRateLimiter', () => {
  it('creates a rate limiter with default config', () => {
    const limiter = createRateLimiter();
    const result = limiter.check('test');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it('creates a rate limiter with custom config', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 30_000 });
    const result = limiter.check('test');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });
});
