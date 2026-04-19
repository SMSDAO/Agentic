import { randomUUID } from 'node:crypto';
import type { AgentRecord, CreateAgentInput, UpdateAgentInput } from '@/modules/agent-engine/types';

const agents = new Map<string, AgentRecord>();

export class AgentEngineStore {
  list(): AgentRecord[] {
    return Array.from(agents.values());
  }

  get(id: string): AgentRecord | null {
    return agents.get(id) ?? null;
  }

  create(input: CreateAgentInput): AgentRecord {
    const now = new Date().toISOString();
    const record: AgentRecord = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      config: input.config ?? {},
    };

    agents.set(record.id, record);
    return record;
  }

  update(id: string, input: UpdateAgentInput): AgentRecord | null {
    const current = this.get(id);
    if (!current) {
      return null;
    }

    const updated: AgentRecord = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
      config: input.config ?? current.config,
    };

    agents.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return agents.delete(id);
  }
}

export const agentEngineStore = new AgentEngineStore();
