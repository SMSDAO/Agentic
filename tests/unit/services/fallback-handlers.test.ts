import { describe, it, expect, vi } from 'vitest';
import { withFallback, FallbackChain } from '@/services/ai/fallback-handlers';

describe('withFallback', () => {
  it('returns primary result when primary succeeds', async () => {
    const result = await withFallback(
      () => Promise.resolve('primary'),
      () => Promise.resolve('fallback')
    );
    expect(result).toBe('primary');
  });

  it('returns fallback result when primary throws', async () => {
    const result = await withFallback(
      () => Promise.reject(new Error('primary failed')),
      () => Promise.resolve('fallback')
    );
    expect(result).toBe('fallback');
  });

  it('propagates fallback errors', async () => {
    await expect(
      withFallback(
        () => Promise.reject(new Error('primary failed')),
        () => Promise.reject(new Error('fallback failed'))
      )
    ).rejects.toThrow('fallback failed');
  });
});

describe('FallbackChain', () => {
  it('returns result from first successful provider', async () => {
    const chain = new FallbackChain<string>()
      .add(() => Promise.resolve('first'))
      .add(() => Promise.resolve('second'));
    const result = await chain.execute();
    expect(result).toBe('first');
  });

  it('falls through to second provider on failure', async () => {
    const chain = new FallbackChain<string>()
      .add(() => Promise.reject(new Error('first failed')))
      .add(() => Promise.resolve('second'));
    const result = await chain.execute();
    expect(result).toBe('second');
  });

  it('throws last error when all providers fail', async () => {
    const chain = new FallbackChain<string>()
      .add(() => Promise.reject(new Error('first failed')))
      .add(() => Promise.reject(new Error('second failed')));
    await expect(chain.execute()).rejects.toThrow('second failed');
  });

  it('throws when no providers are added', async () => {
    const chain = new FallbackChain<string>();
    await expect(chain.execute()).rejects.toThrow('FallbackChain has no providers');
  });

  it('supports chaining with .add()', async () => {
    const spy = vi.fn().mockResolvedValue('chained');
    const chain = new FallbackChain<string>().add(spy);
    await chain.execute();
    expect(spy).toHaveBeenCalledOnce();
  });
});
