import { NextRequest, NextResponse } from 'next/server';
import { withApiAccess } from '@/modules/api/access';
import { jsonError } from '@/modules/api/http';
import { executeTaskSchema } from '@/modules/api/schemas';
import { getRuntimeQueue } from '@/modules/runtime';

export async function GET(request: NextRequest) {
  const access = withApiAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const queue = getRuntimeQueue();

  if (!taskId) {
    return NextResponse.json({ tasks: queue.list() }, { headers: access.headers });
  }

  const task = queue.get(taskId);
  if (!task) {
    return jsonError('Task not found', 404);
  }

  return NextResponse.json({ task }, { headers: access.headers });
}

export async function POST(request: NextRequest) {
  const access = withApiAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const parsed = executeTaskSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid task payload', 400);
  }

  const queue = getRuntimeQueue();
  const task = queue.enqueue(parsed.data);

  return NextResponse.json(
    { taskId: task.id, status: task.status },
    { status: 202, headers: access.headers }
  );
}
