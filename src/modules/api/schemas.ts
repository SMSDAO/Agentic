import { z } from 'zod';
import { MESSAGE_CHANNELS } from '@/modules/api/constants';

export const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  config: z.record(z.unknown()).optional(),
});

export const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'paused']).optional(),
  config: z.record(z.unknown()).optional(),
});

export const executeTaskSchema = z.object({
  taskType: z.enum(['execute_agent_prompt', 'send_message']),
  payload: z.record(z.unknown()),
  maxAttempts: z.number().int().min(1).max(10).optional(),
});

export const messageHookSchema = z.object({
  channel: z.enum(MESSAGE_CHANNELS),
  recipient: z.string().min(1),
  message: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});
