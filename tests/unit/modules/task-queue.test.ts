import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryTaskQueue } from '@/modules/runtime/task-queue';

describe('InMemoryTaskQueue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('processes queued tasks asynchronously', async () => {
    const queue = new InMemoryTaskQueue();
    queue.registerHandler('echo', async (payload) => payload);

    const task = queue.enqueue({ taskType: 'echo', payload: { ok: true } });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const record = queue.get(task.id);
    expect(record?.status).toBe('completed');
    expect(record?.result).toEqual({ ok: true });
  });

  it('retries task failures and eventually fails', async () => {
    vi.useFakeTimers();

    const queue = new InMemoryTaskQueue();
    queue.registerHandler('flaky', async () => {
      throw new Error('boom');
    });

    const task = queue.enqueue({ taskType: 'flaky', payload: {}, maxAttempts: 2 });

    await vi.runOnlyPendingTimersAsync();
    await vi.advanceTimersByTimeAsync(500);
    await vi.runOnlyPendingTimersAsync();

    const record = queue.get(task.id);
    expect(record?.status).toBe('failed');
    expect(record?.attempts).toBe(2);
    expect(record?.error).toContain('boom');
  });
});
