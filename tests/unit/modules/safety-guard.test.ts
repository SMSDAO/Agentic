import { describe, expect, it } from 'vitest';
import { SafetyGuard, HardStopError, MAX_RECURSION_DEPTH } from '@/modules/safety/safety-guard';

describe('SafetyGuard', () => {
  it('allows entry up to the maximum depth', () => {
    const guard = new SafetyGuard({ maxDepth: 5 });
    for (let i = 0; i < 5; i++) {
      expect(() => guard.enter('agent-a')).not.toThrow();
    }
  });

  it('throws HardStopError when max depth is exceeded', () => {
    const guard = new SafetyGuard({ maxDepth: 5 });
    for (let i = 0; i < 5; i++) {
      guard.enter('agent-a');
    }
    expect(() => guard.enter('agent-a')).toThrowError(HardStopError);
  });

  it('HardStopError has reason max_depth', () => {
    const guard = new SafetyGuard({ maxDepth: 1 });
    guard.enter('agent-a', 'stable-state');
    try {
      guard.enter('agent-a');
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(HardStopError);
      expect((err as HardStopError).reason).toBe('max_depth');
    }
  });

  it('preserves lastStableState in HardStopError', () => {
    const guard = new SafetyGuard({ maxDepth: 1 });
    const stable = { value: 42 };
    guard.enter('agent-a', stable);
    try {
      guard.enter('agent-a');
      expect.fail('should have thrown');
    } catch (err) {
      expect((err as HardStopError).lastStableState).toEqual(stable);
    }
  });

  it('tracks depth correctly across enter/exit cycles', () => {
    const guard = new SafetyGuard();
    guard.enter('agent-b');
    guard.enter('agent-b');
    expect(guard.getDepth('agent-b')).toBe(2);
    guard.exit('agent-b');
    expect(guard.getDepth('agent-b')).toBe(1);
    guard.exit('agent-b');
    expect(guard.getDepth('agent-b')).toBe(0);
  });

  it('depth reaches zero after all exits and allows re-entry', () => {
    const guard = new SafetyGuard({ maxDepth: 5 });
    guard.enter('agent-c');
    guard.exit('agent-c');
    expect(guard.getDepth('agent-c')).toBe(0);
    // Should not throw – depth is back to 0.
    expect(() => guard.enter('agent-c')).not.toThrow();
  });

  it('isolates depth tracking per agent', () => {
    const guard = new SafetyGuard({ maxDepth: 2 });
    guard.enter('agent-x');
    guard.enter('agent-x');
    // agent-x is at max; agent-y should be unaffected
    expect(() => guard.enter('agent-y')).not.toThrow();
    expect(guard.getDepth('agent-y')).toBe(1);
  });

  it('throws HardStopError when token budget is exceeded', () => {
    const guard = new SafetyGuard({ maxTokens: 100 });
    guard.recordTokens('agent-d', 60);
    expect(() => guard.recordTokens('agent-d', 50)).toThrowError(HardStopError);
  });

  it('HardStopError has reason token_limit', () => {
    const guard = new SafetyGuard({ maxTokens: 10 });
    try {
      guard.recordTokens('agent-e', 11);
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(HardStopError);
      expect((err as HardStopError).reason).toBe('token_limit');
    }
  });

  it('accumulates tokens correctly', () => {
    const guard = new SafetyGuard({ maxTokens: 1000 });
    guard.recordTokens('agent-f', 300);
    guard.recordTokens('agent-f', 200);
    expect(guard.getTokens('agent-f')).toBe(500);
  });

  it('reset clears depth and token state', () => {
    const guard = new SafetyGuard({ maxDepth: 3, maxTokens: 200 });
    guard.enter('agent-g');
    guard.recordTokens('agent-g', 150);
    guard.reset('agent-g');
    expect(guard.getDepth('agent-g')).toBe(0);
    expect(guard.getTokens('agent-g')).toBe(0);
  });

  it('uses MAX_RECURSION_DEPTH=5 as the exported constant', () => {
    expect(MAX_RECURSION_DEPTH).toBe(5);
  });

  it('default config applies MAX_RECURSION_DEPTH', () => {
    const guard = new SafetyGuard();
    for (let i = 0; i < MAX_RECURSION_DEPTH; i++) {
      guard.enter('agent-h');
    }
    expect(() => guard.enter('agent-h')).toThrowError(HardStopError);
  });
});
