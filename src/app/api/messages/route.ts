import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/modules/api/http';
import { messageHookSchema } from '@/modules/api/schemas';
import { authenticateApiKey, enforceRateLimit, recordUsage } from '@/modules/api/security';
import { getRuntimeQueue } from '@/modules/runtime';

function withAccess(request: NextRequest) {
  const consumer = authenticateApiKey(request);
  if (!consumer) {
    return { error: jsonError('Invalid API key', 401) };
  }

  const limit = enforceRateLimit(consumer.id);
  if (!limit.allowed) {
    return { error: jsonError('Rate limit exceeded', 429) };
  }

  const usage = recordUsage(consumer.id);
  return { headers: { 'x-usage-count': String(usage) } };
}

export async function POST(request: NextRequest) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const parsed = messageHookSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid message payload', 400);
  }

  const task = getRuntimeQueue().enqueue({
    taskType: 'send_message',
    payload: parsed.data,
    maxAttempts: 5,
  });

  return NextResponse.json(
    { taskId: task.id, status: task.status },
    { status: 202, headers: access.headers }
  );
}
