import { describe, it, expect } from 'vitest';
import { RateLimiter, createRateLimiter } from '@/services/ai/rate-limiting';

describe('RateLimiter', () => {
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
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1 });
    limiter.check('user1');
    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = limiter.check('user1');
        expect(result.allowed).toBe(true);
        resolve();
      }, 10);
    });
  });

  it('purges expired entries', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1 });
    limiter.check('user1');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        limiter.purgeExpired();
        // After purge, the key should be gone; new check should succeed
        const result = limiter.check('user1');
        expect(result.allowed).toBe(true);
        resolve();
      }, 10);
    });
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
