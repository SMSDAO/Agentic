import { NextRequest, NextResponse } from 'next/server';
import { agentEngineStore } from '@/modules/agent-engine/store';
import { jsonError } from '@/modules/api/http';
import { updateAgentSchema } from '@/modules/api/schemas';
import { authenticateApiKey, enforceRateLimit, recordUsage } from '@/modules/api/security';

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
  params: Promise<{ agentId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { agentId } = await context.params;
  const agent = agentEngineStore.get(agentId);
  if (!agent) {
    return jsonError('Agent not found', 404);
  }

  return NextResponse.json({ agent }, { headers: access.headers });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { agentId } = await context.params;
  const parsed = updateAgentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid update payload', 400);
  }

  const agent = agentEngineStore.update(agentId, parsed.data);
  if (!agent) {
    return jsonError('Agent not found', 404);
  }

  return NextResponse.json({ agent }, { headers: access.headers });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const { agentId } = await context.params;
  const deleted = agentEngineStore.delete(agentId);
  if (!deleted) {
    return jsonError('Agent not found', 404);
  }

  return NextResponse.json({ deleted: true }, { headers: access.headers });
}
