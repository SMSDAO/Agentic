import { randomUUID } from 'node:crypto';

export type TaskStatus = 'queued' | 'processing' | 'retrying' | 'completed' | 'failed';

export interface TaskRecord {
  id: string;
  consumerId: string;
  taskType: string;
  payload: Record<string, unknown>;
  status: TaskStatus;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: unknown;
  createdAt: string;
  updatedAt: string;
}

export type TaskHandler = (payload: Record<string, unknown>) => Promise<unknown>;

interface EnqueueInput {
  consumerId: string;
  taskType: string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}

function parseRetryDelayMs(): number {
  const parsed = Number(process.env.TASK_RETRY_DELAY_MS ?? 500);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 500;
  }

  return parsed;
}

const RETRY_DELAY_MS = parseRetryDelayMs();

export class InMemoryTaskQueue {
  private tasks = new Map<string, TaskRecord>();
  private handlers = new Map<string, TaskHandler>();

  registerHandler(taskType: string, handler: TaskHandler): void {
    this.handlers.set(taskType, handler);
  }

  enqueue(input: EnqueueInput): TaskRecord {
    const now = new Date().toISOString();
    const task: TaskRecord = {
      id: randomUUID(),
      consumerId: input.consumerId,
      taskType: input.taskType,
      payload: input.payload,
      status: 'queued',
      attempts: 0,
      maxAttempts: input.maxAttempts ?? 3,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    queueMicrotask(() => {
      void this.process(task.id);
    });

    return task;
  }

  getByConsumer(id: string, consumerId: string): TaskRecord | null {
    const task = this.tasks.get(id);
    if (!task || task.consumerId !== consumerId) {
      return null;
    }

    return task;
  }

  listByConsumer(consumerId: string): TaskRecord[] {
    return Array.from(this.tasks.values()).filter((task) => task.consumerId === consumerId);
  }

  private async process(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return;
    }

    const handler = this.handlers.get(task.taskType);
    if (!handler) {
      this.updateTask(taskId, {
        status: 'failed',
        error: `No handler registered for task type: ${task.taskType}`,
      });
      return;
    }

    const attempts = task.attempts + 1;
    this.updateTask(taskId, { status: 'processing', attempts, error: undefined });

    try {
      const result = await handler(task.payload);
      this.updateTask(taskId, { status: 'completed', result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown task failure';

      if (attempts < task.maxAttempts) {
        this.updateTask(taskId, {
          status: 'retrying',
          error: message,
        });

        setTimeout(() => {
          void this.process(taskId);
        }, RETRY_DELAY_MS);
        return;
      }

      this.updateTask(taskId, {
        status: 'failed',
        error: message,
      });
    }
  }

  private updateTask(taskId: string, updates: Partial<TaskRecord>): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      return;
    }

    this.tasks.set(taskId, {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}

const queueSingleton = new InMemoryTaskQueue();

export function getTaskQueue(): InMemoryTaskQueue {
  return queueSingleton;
}
