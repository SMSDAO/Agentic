import { describe, expect, it } from 'vitest';
import { AgentEngineStore } from '@/modules/agent-engine/store';

describe('AgentEngineStore', () => {
  it('creates and retrieves agents', () => {
    const store = new AgentEngineStore();
    const created = store.create({ consumerId: 'tenant-a', name: 'alpha' });

    expect(created.id).toBeTruthy();
    expect(store.getByConsumer(created.id, 'tenant-a')?.name).toBe('alpha');
  });

  it('updates existing agent and returns null for missing', () => {
    const store = new AgentEngineStore();
    const created = store.create({ consumerId: 'tenant-a', name: 'beta' });

    const updated = store.updateByConsumer(created.id, 'tenant-a', { status: 'paused' });
    expect(updated?.status).toBe('paused');

    expect(store.updateByConsumer('missing', 'tenant-a', { status: 'active' })).toBeNull();
  });

  it('deletes agents', () => {
    const store = new AgentEngineStore();
    const created = store.create({ consumerId: 'tenant-a', name: 'gamma' });

    expect(store.deleteByConsumer(created.id, 'tenant-a')).toBe(true);
    expect(store.getByConsumer(created.id, 'tenant-a')).toBeNull();
  });
});
