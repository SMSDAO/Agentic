import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/modules/api/http';
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

interface RouteContext {
  params: Promise<{ taskId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { taskId } = await context.params;
  const task = getRuntimeQueue().get(taskId);

  if (!task) {
    return jsonError('Task not found', 404);
  }

  return NextResponse.json({ task }, { headers: access.headers });
}
