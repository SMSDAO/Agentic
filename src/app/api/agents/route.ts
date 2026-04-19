import { NextRequest, NextResponse } from 'next/server';
import { agentEngineStore } from '@/modules/agent-engine/store';
import { withApiAccess } from '@/modules/api/access';
import { jsonError } from '@/modules/api/http';
import { createAgentSchema } from '@/modules/api/schemas';

export async function GET(request: NextRequest) {
  const access = withApiAccess(request);
  if ('error' in access) {
    return access.error;
  }

  return NextResponse.json({ agents: agentEngineStore.list() }, { headers: access.headers });
}

export async function POST(request: NextRequest) {
  const access = withApiAccess(request);
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
