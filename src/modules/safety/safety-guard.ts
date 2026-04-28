/**
 * SafetyGuard – Circuit Breaker for agent execution depth and token consumption.
 *
 * Monitors per-agent recursion depth and cumulative token spend.
 * Triggers a HardStop when either threshold is breached and returns the last
 * stable state recorded before the breach, preventing runaway agent loops.
 */

/** Maximum allowed recursive call depth before a HardStop is triggered. */
export const MAX_RECURSION_DEPTH = 5;

/** Reason codes for a HardStop event. */
export type HardStopReason = 'max_depth' | 'token_limit';

/**
 * Thrown by SafetyGuard when a circuit-breaker threshold is exceeded.
 * Callers can inspect `lastStableState` to recover the last known-good result.
 */
export class HardStopError extends Error {
  readonly reason: HardStopReason;
  readonly lastStableState: unknown;

  constructor(reason: HardStopReason, lastStableState: unknown, message: string) {
    super(message);
    this.name = 'HardStopError';
    this.reason = reason;
    this.lastStableState = lastStableState;
  }
}

export interface SafetyGuardConfig {
  /** Maximum recursion depth before HardStop (default: 5). */
  maxDepth?: number;
  /** Cumulative token budget per agent before HardStop (default: unlimited). */
  maxTokens?: number;
}

interface DepthState {
  depth: number;
  lastStableState: unknown;
}

/**
 * SafetyGuard monitors agent execution depth and token consumption.
 *
 * Usage:
 * ```ts
 * guard.enter(agentId, currentState);  // before each recursive call
 * // … perform work …
 * guard.exit(agentId, result);         // after each successful call
 * guard.recordTokens(agentId, usage);  // after each LLM response
 * ```
 */
export class SafetyGuard {
  private readonly maxDepth: number;
  private readonly maxTokens: number;
  private readonly depthMap = new Map<string, DepthState>();
  private readonly tokenMap = new Map<string, number>();

  constructor(config: SafetyGuardConfig = {}) {
    this.maxDepth = config.maxDepth ?? MAX_RECURSION_DEPTH;
    this.maxTokens = config.maxTokens ?? Infinity;
  }

  /**
   * Enter a new execution frame for the given agent, recording `currentState`
   * as the stable state to return if a HardStop fires at a deeper level.
   *
   * @throws {HardStopError} when the next depth would exceed `maxDepth`.
   */
  enter(agentId: string, currentState: unknown = null): void {
    const state = this.depthMap.get(agentId) ?? { depth: 0, lastStableState: null };
    const nextDepth = state.depth + 1;

    if (nextDepth > this.maxDepth) {
      throw new HardStopError(
        'max_depth',
        state.lastStableState,
        `HardStop: agent "${agentId}" exceeded max recursion depth of ${this.maxDepth}`,
      );
    }

    this.depthMap.set(agentId, { depth: nextDepth, lastStableState: currentState });
  }

  /**
   * Exit an execution frame, recording `stableState` as the last known-good result.
   * When depth returns to zero the entry is removed from the depth map.
   */
  exit(agentId: string, stableState: unknown = null): void {
    const state = this.depthMap.get(agentId);
    if (!state) return;

    const newDepth = state.depth - 1;
    if (newDepth <= 0) {
      this.depthMap.delete(agentId);
    } else {
      this.depthMap.set(agentId, { depth: newDepth, lastStableState: stableState });
    }
  }

  /**
   * Record token consumption for an agent.
   *
   * @throws {HardStopError} when cumulative tokens exceed `maxTokens`.
   */
  recordTokens(agentId: string, tokens: number): void {
    const total = (this.tokenMap.get(agentId) ?? 0) + tokens;
    this.tokenMap.set(agentId, total);

    if (total > this.maxTokens) {
      const state = this.depthMap.get(agentId);
      throw new HardStopError(
        'token_limit',
        state?.lastStableState ?? null,
        `HardStop: agent "${agentId}" exceeded token budget (${total} > ${this.maxTokens})`,
      );
    }
  }

  /** Returns the current recursion depth for an agent (0 if not active). */
  getDepth(agentId: string): number {
    return this.depthMap.get(agentId)?.depth ?? 0;
  }

  /** Returns cumulative tokens consumed by an agent. */
  getTokens(agentId: string): number {
    return this.tokenMap.get(agentId) ?? 0;
  }

  /** Resets all tracked state for an agent (depth and token counters). */
  reset(agentId: string): void {
    this.depthMap.delete(agentId);
    this.tokenMap.delete(agentId);
  }
}

/** Process-level SafetyGuard singleton. */
export const globalSafetyGuard = new SafetyGuard();
