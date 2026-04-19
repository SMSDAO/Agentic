import type { InMemoryTaskQueue } from '@/modules/runtime/task-queue';

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 25;

export async function waitForFinalStatus(queue: InMemoryTaskQueue, taskId: string): Promise<void> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i += 1) {
    const task = queue.get(taskId);
    if (task?.status === 'completed' || task?.status === 'failed') {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error('task did not reach final status');
}
