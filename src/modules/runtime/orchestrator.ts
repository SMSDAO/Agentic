/**
 * OrchestratorNode – Self-contained "One-File Node" orchestrator.
 *
 * Provides a portable, self-healing execution surface for agent tasks:
 *   • Dependency health checks with automatic virtual re-link fallback.
 *   • SafetyGuard integration (HardStop on depth/token breach).
 *   • AuditLog integration (Thought/Action traces).
 *   • Graceful degradation when the primary AI provider is unavailable.
 *
 * Design goals:
 *   – Zero architectural drift from the static-state model used across the repo.
 *   – Backward-compatible: existing InMemoryTaskQueue and task handlers are
 *     unmodified; the orchestrator wraps them.
 */

import { globalSafetyGuard, HardStopError } from '@/modules/safety/safety-guard';
import type { SafetyGuard } from '@/modules/safety/safety-guard';
import { globalAuditLog } from '@/modules/safety/audit-log';
import type { AuditLog } from '@/modules/safety/audit-log';
import { logger } from '@/modules/safety/logger';

// ---------------------------------------------------------------------------
// Provider contracts
// ---------------------------------------------------------------------------

/** Minimal interface required of an AI provider. */
export interface AgentProvider {
  /** Human-readable name used in logs and health checks. */
  readonly name: string;
  /** Execute a prompt and return a response string. */
  execute(prompt: string): Promise<string>;
  /** Returns true when the provider is healthy and ready to accept calls. */
  healthCheck(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Mock / fallback provider
// ---------------------------------------------------------------------------

/**
 * MockProvider is used as the fallback when every real provider fails its
 * health check.  It returns deterministic stub responses so the orchestrator
 * can degrade gracefully rather than hard-fail.
 */
export class MockProvider implements AgentProvider {
  readonly name = 'mock-fallback';

  async execute(prompt: string): Promise<string> {
    logger.warn('MockProvider: returning stub response for prompt', {
      promptSnippet: prompt.slice(0, 60),
    });
    return `[mock] Received: ${prompt.slice(0, 100)}`;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Orchestrator configuration
// ---------------------------------------------------------------------------

export interface OrchestratorConfig {
  /** Ordered list of providers to try (primary first, then fallbacks). */
  providers?: AgentProvider[];
  /**
   * When true the orchestrator will attempt a "virtual re-link" by falling
   * back to MockProvider if all real providers fail their health check.
   * Default: true.
   */
  enableSelfHealing?: boolean;
  /** Injected SafetyGuard instance (defaults to the process-level singleton). */
  safetyGuard?: SafetyGuard;
  /** Injected AuditLog instance (defaults to the process-level singleton). */
  auditLog?: AuditLog;
}

// ---------------------------------------------------------------------------
// Execution types
// ---------------------------------------------------------------------------

export interface ExecuteOptions {
  /** Logical agent identifier (used for depth / token tracking). */
  agentId: string;
  /** Model identifier to record in audit entries. */
  modelId?: string;
  /** Prompt to execute. */
  prompt: string;
  /** Current stable state to preserve in case a HardStop is triggered. */
  currentState?: unknown;
}

export interface ExecuteResult {
  success: boolean;
  response?: string;
  /** Populated when a HardStop interrupts execution. */
  hardStop?: { reason: string; lastStableState: unknown };
  /** Name of the provider that served the request. */
  provider?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// OrchestratorNode
// ---------------------------------------------------------------------------

/**
 * OrchestratorNode is the single entry-point for agent task execution in
 * production.  It wires together provider selection, circuit-breaking, and
 * audit logging in one portable unit.
 */
export class OrchestratorNode {
  private providers: AgentProvider[];
  private readonly enableSelfHealing: boolean;
  private readonly guard: SafetyGuard;
  private readonly audit: AuditLog;
  private activeProvider: AgentProvider | null = null;

  constructor(config: OrchestratorConfig = {}) {
    this.providers = config.providers ?? [];
    this.enableSelfHealing = config.enableSelfHealing ?? true;
    this.guard = config.safetyGuard ?? globalSafetyGuard;
    this.audit = config.auditLog ?? globalAuditLog;
  }

  // ---------------------------------------------------------------------------
  // Health & self-healing
  // ---------------------------------------------------------------------------

  /**
   * Runs health checks on all configured providers and selects the first
   * healthy one.  If none pass and self-healing is enabled, a MockProvider
   * is automatically linked as a fallback ("virtual re-link").
   */
  async selectProvider(): Promise<AgentProvider> {
    for (const provider of this.providers) {
      try {
        const healthy = await provider.healthCheck();
        if (healthy) {
          this.activeProvider = provider;
          logger.info('OrchestratorNode: provider selected', { name: provider.name });
          return provider;
        }
      } catch (err) {
        logger.warn('OrchestratorNode: provider health check threw', {
          name: provider.name,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (this.enableSelfHealing) {
      const mock = new MockProvider();
      logger.warn('OrchestratorNode: all providers unhealthy – activating MockProvider (self-heal)');
      this.activeProvider = mock;
      return mock;
    }

    throw new Error('OrchestratorNode: no healthy provider available and self-healing is disabled');
  }

  /** Returns a snapshot of current system health. */
  async healthStatus(): Promise<{ providers: Array<{ name: string; healthy: boolean }> }> {
    const results = await Promise.all(
      this.providers.map(async (p) => {
        try {
          return { name: p.name, healthy: await p.healthCheck() };
        } catch {
          return { name: p.name, healthy: false };
        }
      }),
    );
    return { providers: results };
  }

  // ---------------------------------------------------------------------------
  // Task execution
  // ---------------------------------------------------------------------------

  /**
   * Execute a prompt through the active provider with full circuit-breaker and
   * audit-log instrumentation.
   *
   * The caller may pass `currentState` which will be preserved as the last
   * stable state if a HardStop is triggered at a deeper recursion level.
   */
  async execute(opts: ExecuteOptions): Promise<ExecuteResult> {
    const { agentId, prompt, modelId = 'unknown', currentState = null } = opts;

    // Ensure a provider is selected before executing.
    const provider = this.activeProvider ?? (await this.selectProvider());

    // --- Circuit breaker: depth check ---
    try {
      this.guard.enter(agentId, currentState);
    } catch (err) {
      if (err instanceof HardStopError) {
        logger.error('OrchestratorNode: HardStop on enter', {
          agentId,
          reason: err.reason,
        });
        return {
          success: false,
          hardStop: { reason: err.reason, lastStableState: err.lastStableState },
        };
      }
      throw err;
    }

    try {
      // Audit the incoming thought.
      this.audit.logThought(agentId, modelId, prompt);

      // Call the provider.
      const response = await provider.execute(prompt);

      // Audit the resulting action/response.
      this.audit.logAction(agentId, modelId, response);

      this.guard.exit(agentId, response);

      return { success: true, response, provider: provider.name };
    } catch (err) {
      if (err instanceof HardStopError) {
        logger.error('OrchestratorNode: HardStop during execution', {
          agentId,
          reason: err.reason,
        });
        this.guard.exit(agentId, err.lastStableState);
        return {
          success: false,
          hardStop: { reason: err.reason, lastStableState: err.lastStableState },
        };
      }

      const message = err instanceof Error ? err.message : String(err);
      logger.error('OrchestratorNode: execution error', { agentId, error: message });
      this.guard.exit(agentId, null);
      return { success: false, error: message, provider: provider.name };
    }
  }
}

/** Process-level OrchestratorNode singleton (self-healing enabled, no providers pre-loaded). */
export const globalOrchestrator = new OrchestratorNode({ enableSelfHealing: true });
