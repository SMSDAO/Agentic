import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditLog } from '@/modules/safety/audit-log';

// Prevent real filesystem writes during tests.
vi.mock('node:fs', () => ({
  appendFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

describe('AuditLog', () => {
  let log: AuditLog;

  beforeEach(() => {
    log = new AuditLog();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('logThought does not throw', () => {
    expect(() => log.logThought('agent-1', 'gpt-4', 'I should check the balance')).not.toThrow();
  });

  it('logAction does not throw', () => {
    expect(() =>
      log.logAction('agent-1', 'gpt-4', 'Calling get_balance tool', {
        metadata: { tool: 'get_balance' },
      }),
    ).not.toThrow();
  });

  it('logThought with costEstimateUsd does not throw', () => {
    expect(() =>
      log.logThought('agent-2', 'gpt-3.5-turbo', 'Reasoning step', { costEstimateUsd: 0.002 }),
    ).not.toThrow();
  });

  it('logAction with metadata does not throw', () => {
    expect(() =>
      log.logAction('agent-2', 'gpt-4', 'send_message invoked', {
        costEstimateUsd: 0.005,
        metadata: { recipient: 'user@example.com' },
      }),
    ).not.toThrow();
  });

  it('calls appendFileSync for each logged entry', async () => {
    const { appendFileSync } = await import('node:fs');
    log.logThought('agent-3', 'gpt-4', 'Thought content');
    log.logAction('agent-3', 'gpt-4', 'Action content');
    expect(appendFileSync).toHaveBeenCalledTimes(2);
  });

  it('written line is valid JSON containing expected fields', async () => {
    const { appendFileSync } = await import('node:fs');
    log.logThought('agent-4', 'gpt-4-turbo', 'test thought', { costEstimateUsd: 0.01 });

    const calls = vi.mocked(appendFileSync).mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(1);
    const lastCall = calls[calls.length - 1];
    const line = String(lastCall[1]).trim();
    const parsed = JSON.parse(line);

    expect(parsed.agentId).toBe('agent-4');
    expect(parsed.modelId).toBe('gpt-4-turbo');
    expect(parsed.type).toBe('thought');
    expect(parsed.content).toBe('test thought');
    expect(parsed.costEstimateUsd).toBe(0.01);
    expect(typeof parsed.timestamp).toBe('string');
  });

  it('gracefully handles appendFileSync errors', async () => {
    const { appendFileSync } = await import('node:fs');
    vi.mocked(appendFileSync).mockImplementationOnce(() => {
      throw new Error('EROFS: read-only file system');
    });
    // Should not propagate the error.
    expect(() => log.logAction('agent-5', 'gpt-4', 'test action')).not.toThrow();
  });
});
