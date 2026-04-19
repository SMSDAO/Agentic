import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryTaskQueue } from '@/modules/runtime/task-queue';
import { registerDefaultTaskHandlers } from '@/modules/runtime/task-handlers';

const executeMock = vi.fn();

vi.mock('@/lib/ai/langchain', () => ({
  createSolanaAgent: vi.fn(() => ({
    execute: executeMock,
  })),
}));

async function waitForTerminalStatus(queue: InMemoryTaskQueue, taskId: string): Promise<void> {
  for (let i = 0; i < 30; i += 1) {
    const task = queue.get(taskId);
    if (task?.status === 'completed' || task?.status === 'failed') {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  throw new Error('task did not reach terminal status');
}

describe('task handlers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  it('fails execute_agent_prompt when prompt is missing', async () => {
    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({ taskType: 'execute_agent_prompt', payload: {}, maxAttempts: 1 });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('failed');
    expect(result?.error).toContain('prompt is required');
  });

  it('fails execute_agent_prompt when OPENAI_API_KEY is missing', async () => {
    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({
      taskType: 'execute_agent_prompt',
      payload: { prompt: 'hello' },
      maxAttempts: 1,
    });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('failed');
    expect(result?.error).toContain('OPENAI_API_KEY is not configured');
  });

  it('completes execute_agent_prompt when configured', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    executeMock.mockResolvedValue('ok-response');

    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({
      taskType: 'execute_agent_prompt',
      payload: { prompt: 'hello' },
      maxAttempts: 1,
    });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('completed');
    expect(result?.result).toEqual({ response: 'ok-response' });
  });

  it('fails send_message for unsupported channels', async () => {
    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({
      taskType: 'send_message',
      payload: { channel: 'push', recipient: 'x', message: 'hi' },
      maxAttempts: 1,
    });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('failed');
    expect(result?.error).toContain('Unsupported channel');
  });

  it('fails send_message when recipient/message are missing', async () => {
    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({
      taskType: 'send_message',
      payload: { channel: 'sms', recipient: '', message: '' },
      maxAttempts: 1,
    });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('failed');
    expect(result?.error).toContain('recipient and message are required');
  });

  it('completes send_message with valid payload', async () => {
    const queue = new InMemoryTaskQueue();
    registerDefaultTaskHandlers(queue);

    const task = queue.enqueue({
      taskType: 'send_message',
      payload: { channel: 'email', recipient: 'user@example.com', message: 'done' },
      maxAttempts: 1,
    });
    await waitForTerminalStatus(queue, task.id);

    const result = queue.get(task.id);
    expect(result?.status).toBe('completed');
    expect(result?.result).toMatchObject({
      delivered: true,
      channel: 'email',
      recipient: 'user@example.com',
    });
  });
});
