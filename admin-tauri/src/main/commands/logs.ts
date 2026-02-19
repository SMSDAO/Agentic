import { supabase, AuditLog } from '../supabase';

export async function logAuditEvent(input: {
  userId?: string;
  agentId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failure' | 'error';
}): Promise<void> {
  const { error } = await supabase.from('audit_log').insert([
    {
      user_id: input.userId,
      agent_id: input.agentId,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId,
      details: input.details || {},
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
      status: input.status || 'success',
    },
  ]);

  if (error) throw error;
}

export async function getAuditLogs(filters?: {
  userId?: string;
  agentId?: string;
  action?: string;
  resourceType?: string;
  status?: string;
  limit?: number;
}): Promise<AuditLog[]> {
  let query = supabase.from('audit_log').select('*').order('created_at', { ascending: false });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.agentId) {
    query = query.eq('agent_id', filters.agentId);
  }
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
