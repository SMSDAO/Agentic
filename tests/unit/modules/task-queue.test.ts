import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryTaskQueue } from '@/modules/runtime/task-queue';
import { waitForFinalStatus } from '../helpers/wait-for-final-status';

describe('InMemoryTaskQueue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('processes queued tasks asynchronously', async () => {
    const queue = new InMemoryTaskQueue();
    queue.registerHandler('echo', async (payload) => payload);

    const task = queue.enqueue({ consumerId: 'tenant-a', taskType: 'echo', payload: { ok: true } });
    await waitForFinalStatus(queue, task.id);

    const record = queue.getByConsumer(task.id, 'tenant-a');
    expect(record?.status).toBe('completed');
    expect(record?.attempts).toBe(1);
    expect(record?.result).toEqual({ ok: true });
  });

  it('retries task failures and eventually fails', async () => {
    vi.useFakeTimers();

    const queue = new InMemoryTaskQueue();
    queue.registerHandler('flaky', async () => {
      throw new Error('boom');
    });

    const task = queue.enqueue({ consumerId: 'tenant-a', taskType: 'flaky', payload: {}, maxAttempts: 2 });

    await vi.runOnlyPendingTimersAsync();
    await vi.advanceTimersByTimeAsync(500);
    await vi.runOnlyPendingTimersAsync();

    const record = queue.getByConsumer(task.id, 'tenant-a');
    expect(record?.status).toBe('failed');
    expect(record?.attempts).toBe(2);
    expect(record?.error).toContain('boom');
  });
});
