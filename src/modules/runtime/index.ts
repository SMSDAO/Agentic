import { getTaskQueue } from '@/modules/runtime/task-queue';
import { registerDefaultTaskHandlers } from '@/modules/runtime/task-handlers';

let initialized = false;

export function getRuntimeQueue() {
  const queue = getTaskQueue();

  if (!initialized) {
    registerDefaultTaskHandlers(queue);
    initialized = true;
  }

  return queue;
}
