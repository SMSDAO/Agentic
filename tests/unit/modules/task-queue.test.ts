import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryTaskQueue } from '@/modules/runtime/task-queue';

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 25;

async function waitForTerminalStatus(queue: InMemoryTaskQueue, taskId: string): Promise<void> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i += 1) {
    const task = queue.get(taskId);
    if (task?.status === 'completed' || task?.status === 'failed') {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error('task did not reach terminal status');
}

describe('InMemoryTaskQueue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('processes queued tasks asynchronously', async () => {
    const queue = new InMemoryTaskQueue();
    queue.registerHandler('echo', async (payload) => payload);

    const task = queue.enqueue({ taskType: 'echo', payload: { ok: true } });
    await waitForTerminalStatus(queue, task.id);

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
