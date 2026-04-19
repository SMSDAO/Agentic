import { NextRequest, NextResponse } from 'next/server';
import { agentEngineStore } from '@/modules/agent-engine/store';
import { jsonError } from '@/modules/api/http';
import { createAgentSchema } from '@/modules/api/schemas';
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

export async function GET(request: NextRequest) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  return NextResponse.json({ agents: agentEngineStore.list() }, { headers: access.headers });
}

export async function POST(request: NextRequest) {
  const access = withAccess(request);
  if ('error' in access) {
    return access.error;
  }

  const body = await request.json();
  const parsed = createAgentSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError('Invalid agent payload', 400);
  }

  const agent = agentEngineStore.create(parsed.data);
  return NextResponse.json({ agent }, { status: 201, headers: access.headers });
}
