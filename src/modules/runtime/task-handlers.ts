import { createSolanaAgent } from '@/lib/ai/langchain';
import type { InMemoryTaskQueue } from '@/modules/runtime/task-queue';

const MESSAGE_CHANNELS = new Set(['email', 'sms']);

async function executeAgentPrompt(payload: Record<string, unknown>): Promise<unknown> {
  const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';
  if (!prompt) {
    throw new Error('prompt is required for execute_agent_prompt task');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const agent = createSolanaAgent(apiKey);
  const response = await agent.execute(prompt);
  return { response };
}

async function sendMessage(payload: Record<string, unknown>): Promise<unknown> {
  const channel = typeof payload.channel === 'string' ? payload.channel : '';
  const recipient = typeof payload.recipient === 'string' ? payload.recipient : '';
  const message = typeof payload.message === 'string' ? payload.message : '';

  if (!MESSAGE_CHANNELS.has(channel)) {
    throw new Error('Unsupported channel');
  }

  if (!recipient || !message) {
    throw new Error('recipient and message are required');
  }

  return {
    delivered: true,
    channel,
    recipient,
    acceptedAt: new Date().toISOString(),
  };
}

export function registerDefaultTaskHandlers(queue: InMemoryTaskQueue): void {
  queue.registerHandler('execute_agent_prompt', executeAgentPrompt);
  queue.registerHandler('send_message', sendMessage);
}
