export type AgentStatus = 'active' | 'paused';

export interface AgentRecord {
  id: string;
  consumerId: string;
  name: string;
  description?: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
  config: Record<string, unknown>;
}

export interface CreateAgentInput {
  consumerId: string;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  status?: AgentStatus;
  config?: Record<string, unknown>;
}
