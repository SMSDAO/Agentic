import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  OrchestratorNode,
  MockProvider,
  type AgentProvider,
} from '@/modules/runtime/orchestrator';
import { SafetyGuard } from '@/modules/safety/safety-guard';
import { AuditLog } from '@/modules/safety/audit-log';

// Prevent real filesystem writes.
vi.mock('node:fs', () => ({
  appendFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

function makeProvider(name: string, healthy = true, response = 'ok'): AgentProvider {
  return {
    name,
    execute: vi.fn().mockResolvedValue(response),
    healthCheck: vi.fn().mockResolvedValue(healthy),
  };
}

const opts = {
  agentId: 'test-agent',
  modelId: 'gpt-4',
  prompt: 'Hello',
};

describe('OrchestratorNode', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('selects first healthy provider', async () => {
    const p1 = makeProvider('primary');
    const node = new OrchestratorNode({
      providers: [p1],
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const provider = await node.selectProvider();
    expect(provider.name).toBe('primary');
  });

  it('skips unhealthy providers and selects next healthy one', async () => {
    const p1 = makeProvider('bad', false);
    const p2 = makeProvider('good', true);
    const node = new OrchestratorNode({
      providers: [p1, p2],
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const provider = await node.selectProvider();
    expect(provider.name).toBe('good');
  });

  it('falls back to MockProvider when all providers unhealthy (self-healing)', async () => {
    const p1 = makeProvider('bad', false);
    const node = new OrchestratorNode({
      providers: [p1],
      enableSelfHealing: true,
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const provider = await node.selectProvider();
    expect(provider.name).toBe('mock-fallback');
  });

  it('throws when all providers unhealthy and self-healing disabled', async () => {
    const p1 = makeProvider('bad', false);
    const node = new OrchestratorNode({
      providers: [p1],
      enableSelfHealing: false,
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    await expect(node.selectProvider()).rejects.toThrow('no healthy provider');
  });

  it('executes prompt and returns successful result', async () => {
    const p1 = makeProvider('primary', true, 'agent response');
    const node = new OrchestratorNode({
      providers: [p1],
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const result = await node.execute(opts);
    expect(result.success).toBe(true);
    expect(result.response).toBe('agent response');
    expect(result.provider).toBe('primary');
  });

  it('returns error result when provider throws', async () => {
    const p1: AgentProvider = {
      name: 'flaky',
      execute: vi.fn().mockRejectedValue(new Error('provider down')),
      healthCheck: vi.fn().mockResolvedValue(true),
    };
    const node = new OrchestratorNode({
      providers: [p1],
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const result = await node.execute(opts);
    expect(result.success).toBe(false);
    expect(result.error).toContain('provider down');
  });

  it('triggers HardStop when recursion depth exceeds limit', async () => {
    const guard = new SafetyGuard({ maxDepth: 2 });
    // Pre-fill depth to the limit.
    guard.enter('test-agent', 'state-1');
    guard.enter('test-agent', 'state-2');

    const p1 = makeProvider('primary');
    const node = new OrchestratorNode({
      providers: [p1],
      safetyGuard: guard,
      auditLog: new AuditLog(),
    });
    const result = await node.execute({ ...opts, currentState: 'state-2' });
    expect(result.success).toBe(false);
    expect(result.hardStop?.reason).toBe('max_depth');
  });

  it('reports provider health status', async () => {
    const p1 = makeProvider('p1', true);
    const p2 = makeProvider('p2', false);
    const node = new OrchestratorNode({
      providers: [p1, p2],
      safetyGuard: new SafetyGuard(),
      auditLog: new AuditLog(),
    });
    const status = await node.healthStatus();
    expect(status.providers).toHaveLength(2);
    expect(status.providers[0]).toEqual({ name: 'p1', healthy: true });
    expect(status.providers[1]).toEqual({ name: 'p2', healthy: false });
  });
});

describe('MockProvider', () => {
  it('healthCheck always returns true', async () => {
    const mock = new MockProvider();
    expect(await mock.healthCheck()).toBe(true);
  });

  it('execute returns a stub response containing the prompt', async () => {
    const mock = new MockProvider();
    const response = await mock.execute('test prompt');
    expect(response).toContain('test prompt');
  });
});
