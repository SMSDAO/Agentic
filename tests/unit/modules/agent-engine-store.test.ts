import { describe, expect, it } from 'vitest';
import { AgentEngineStore } from '@/modules/agent-engine/store';

describe('AgentEngineStore', () => {
  it('creates and retrieves agents', () => {
    const store = new AgentEngineStore();
    const created = store.create({ name: 'alpha' });

    expect(created.id).toBeTruthy();
    expect(store.get(created.id)?.name).toBe('alpha');
  });

  it('updates existing agent and returns null for missing', () => {
    const store = new AgentEngineStore();
    const created = store.create({ name: 'beta' });

    const updated = store.update(created.id, { status: 'paused' });
    expect(updated?.status).toBe('paused');

    expect(store.update('missing', { status: 'active' })).toBeNull();
  });

  it('deletes agents', () => {
    const store = new AgentEngineStore();
    const created = store.create({ name: 'gamma' });

    expect(store.delete(created.id)).toBe(true);
    expect(store.get(created.id)).toBeNull();
  });
});
