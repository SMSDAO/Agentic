import { NextRequest, NextResponse } from 'next/server';
import { withApiAccess } from '@/modules/api/access';
import { jsonError } from '@/modules/api/http';
import { messageHookSchema } from '@/modules/api/schemas';
import { getRuntimeQueue } from '@/modules/runtime';

export async function POST(request: NextRequest) {
  const access = withApiAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const parsed = messageHookSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid message payload', 400, { headers: access.headers });
  }

  const task = getRuntimeQueue().enqueue({
    consumerId: access.consumerId,
    taskType: 'send_message',
    payload: parsed.data,
    maxAttempts: 5,
  });

  return NextResponse.json(
    { taskId: task.id, status: task.status },
    { status: 202, headers: access.headers }
  );
}
