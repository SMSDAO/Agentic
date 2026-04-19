import { NextRequest, NextResponse } from 'next/server';
import { withApiAccess } from '@/modules/api/access';
import { jsonError } from '@/modules/api/http';
import { getRuntimeQueue } from '@/modules/runtime';

interface RouteContext {
  params: Promise<{ taskId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const access = withApiAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { taskId } = await context.params;
  const task = getRuntimeQueue().getByConsumer(taskId, access.consumerId);

  if (!task) {
    return jsonError('Task not found', 404, { headers: access.headers });
  }

  return NextResponse.json({ task }, { headers: access.headers });
}
