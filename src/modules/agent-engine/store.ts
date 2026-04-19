import { randomUUID } from 'node:crypto';
import type { AgentRecord, CreateAgentInput, UpdateAgentInput } from '@/modules/agent-engine/types';

/** Shared process-level agent registry for the singleton API runtime. */
const agents = new Map<string, AgentRecord>();

export class AgentEngineStore {
  listByConsumer(consumerId: string): AgentRecord[] {
    return Array.from(agents.values()).filter((agent) => agent.consumerId === consumerId);
  }

  getByConsumer(id: string, consumerId: string): AgentRecord | null {
    const agent = agents.get(id);
    if (!agent || agent.consumerId !== consumerId) {
      return null;
    }

    return agent;
  }

  create(input: CreateAgentInput): AgentRecord {
    const now = new Date().toISOString();
    const record: AgentRecord = {
      id: randomUUID(),
      consumerId: input.consumerId,
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

  updateByConsumer(id: string, consumerId: string, input: UpdateAgentInput): AgentRecord | null {
    const current = this.getByConsumer(id, consumerId);
    if (!current) {
      return null;
    }

    const updated: AgentRecord = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
      config: input.config ? { ...current.config, ...input.config } : current.config,
    };

    agents.set(id, updated);
    return updated;
  }

  deleteByConsumer(id: string, consumerId: string): boolean {
    const agent = this.getByConsumer(id, consumerId);
    if (!agent) {
      return false;
    }

    return agents.delete(id);
  }
}

export const agentEngineStore = new AgentEngineStore();
