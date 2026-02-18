import { supabase, Agent } from '../supabase';

export interface CreateAgentInput {
  name: string;
  type: 'builder' | 'worker' | 'crawler' | 'generator' | 'sync';
  description?: string;
  avatar_url?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  memory?: 'short' | 'long' | 'vector';
  config?: {
    retries?: number;
    timeout_ms?: number;
    concurrency?: number;
    memory_limit?: number;
  };
  limits?: {
    daily_calls?: number;
    monthly_calls?: number;
    per_user_limit?: number;
  };
  billing?: {
    cost_per_call?: number;
    cost_per_token?: number;
  };
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  id: string;
}

// Create a new agent
export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  const { data, error } = await supabase
    .from('agents')
    .insert([
      {
        name: input.name,
        type: input.type,
        description: input.description,
        avatar_url: input.avatar_url,
        model: input.model || 'gpt-4',
        temperature: input.temperature ?? 0.7,
        max_tokens: input.max_tokens || 2000,
        memory: input.memory || 'short',
        config: input.config || {
          retries: 3,
          timeout_ms: 30000,
          concurrency: 1,
          memory_limit: 1024,
        },
        limits: input.limits || {
          daily_calls: 1000,
          monthly_calls: 30000,
          per_user_limit: 100,
        },
        billing: input.billing || {
          cost_per_call: 0.01,
          cost_per_token: 0.00001,
        },
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// List all agents
export async function listAgents(filters?: {
  type?: string;
  status?: string;
}): Promise<Agent[]> {
  let query = supabase.from('agents').select('*').order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Get a single agent by ID
export async function getAgent(id: string): Promise<Agent> {
  const { data, error } = await supabase.from('agents').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

// Update an agent
export async function updateAgent(input: UpdateAgentInput): Promise<Agent> {
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete an agent
export async function deleteAgent(id: string): Promise<void> {
  const { error } = await supabase.from('agents').delete().eq('id', id);

  if (error) throw error;
}

// Pause an agent
export async function pauseAgent(id: string): Promise<Agent> {
  return updateAgent({ id, status: 'paused' });
}

// Resume an agent
export async function resumeAgent(id: string): Promise<Agent> {
  return updateAgent({ id, status: 'active' });
}

// Run agent once (manual trigger)
export async function runAgentOnce(id: string): Promise<{ success: boolean; message: string }> {
  // This would typically trigger a backend job/function
  // For now, just return success
  const agent = await getAgent(id);
  
  if (agent.status !== 'active') {
    throw new Error('Agent must be active to run');
  }

  // TODO: Implement actual agent execution logic
  return {
    success: true,
    message: `Agent ${agent.name} execution triggered`,
  };
}

// Reset agent state
export async function resetAgentState(id: string): Promise<void> {
  // Fetch agent to get its associated configuration ID
  const agent = await getAgent(id);
  const configurationId = (agent as any).configuration_id;

  // Delete agent memory keyed by configuration ID, if available
  if (configurationId) {
    await supabase.from('agent_memory').delete().eq('agent_id', configurationId);
  }

  // Reset status to active
  await updateAgent({ id, status: 'active' });
}

// Attach tool to agent
export async function attachTool(
  agentId: string,
  toolName: string,
  toolConfig: Record<string, any> = {}
): Promise<void> {
  const { error } = await supabase.from('agent_tools').upsert([
    {
      agent_id: agentId,
      tool_name: toolName,
      tool_config: toolConfig,
      enabled: true,
    },
  ]);

  if (error) throw error;
}

// Attach skill to agent
export async function attachSkill(
  agentId: string,
  skillName: string,
  skillConfig: Record<string, any> = {}
): Promise<void> {
  const { error } = await supabase.from('agent_skills').upsert([
    {
      agent_id: agentId,
      skill_name: skillName,
      skill_config: skillConfig,
      enabled: true,
    },
  ]);

  if (error) throw error;
}

// Attach pipeline to agent
export async function attachPipeline(
  agentId: string,
  stepOrder: number,
  stepName: string,
  stepConfig: Record<string, any> = {}
): Promise<void> {
  const { error } = await supabase.from('agent_pipelines').upsert([
    {
      agent_id: agentId,
      step_order: stepOrder,
      step_name: stepName,
      step_config: stepConfig,
      enabled: true,
    },
  ]);

  if (error) throw error;
}

// Set agent schedule
export async function setSchedule(
  agentId: string,
  cron: string,
  timezone: string = 'UTC'
  const { error } = await supabase
    .from('agent_schedules')
    .upsert(
      [
        {
          agent_id: agentId,
          cron,
          timezone,
          enabled: true,
        },
      ],
      { onConflict: 'agent_id' }
    );
  ]);

  if (error) throw error;
}

// Disable agent schedule
export async function disableSchedule(agentId: string): Promise<void> {
  const { error } = await supabase
    .from('agent_schedules')
    .update({ enabled: false })
    .eq('agent_id', agentId);

  if (error) throw error;
}

// Export agent config as JSON
export async function exportAgentConfig(id: string): Promise<string> {
  const agent = await getAgent(id);

  // Get tools
  const { data: tools } = await supabase
    .from('agent_tools')
    .select('*')
    .eq('agent_id', id);

  // Get skills
  const { data: skills } = await supabase
    .from('agent_skills')
    .select('*')
    .eq('agent_id', id);

  // Get pipelines
  const { data: pipelines } = await supabase
    .from('agent_pipelines')
    .select('*')
    .eq('agent_id', id)
    .order('step_order');

  // Get schedule
  const { data: schedule } = await supabase
    .from('agent_schedules')
    .select('*')
    .maybeSingle();
    .single();

  const config = {
    agent,
    tools: tools || [],
    skills: skills || [],
    pipelines: pipelines || [],
    schedule: schedule || null,
  };

  return JSON.stringify(config, null, 2);
}

// Import agent config from JSON
export async function importAgentConfig(configJson: string): Promise<Agent> {
  const config = JSON.parse(configJson);

  // Create agent
  const agent = await createAgent(config.agent);

  // Attach tools
  if (config.tools && Array.isArray(config.tools)) {
    for (const tool of config.tools) {
      await attachTool(agent.id, tool.tool_name, tool.tool_config);
    }
  }

  // Attach skills
  if (config.skills && Array.isArray(config.skills)) {
    for (const skill of config.skills) {
      await attachSkill(agent.id, skill.skill_name, skill.skill_config);
    }
  }

  // Attach pipelines
  if (config.pipelines && Array.isArray(config.pipelines)) {
    for (const pipeline of config.pipelines) {
      await attachPipeline(agent.id, pipeline.step_order, pipeline.step_name, pipeline.step_config);
    }
  }

  // Set schedule
  if (config.schedule && config.schedule.cron) {
    await setSchedule(agent.id, config.schedule.cron, config.schedule.timezone);
  }

  return agent;
}
