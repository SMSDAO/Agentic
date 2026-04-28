/**
 * Shadow Audit Log – append-only JSONL pipeline for agent reasoning traces.
 *
 * Every agent "Thought" and "Action" is recorded with a timestamp, model ID,
 * and optional cost estimate. Entries are written to `.logs/agent_reasoning.jsonl`
 * in the repository root. If the file system is unavailable (e.g., Edge/serverless
 * runtimes) the write is silently skipped and the entry is still surfaced via the
 * standard logger so observability is never lost.
 */

import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '@/modules/safety/logger';

/** Discriminated union of the two loggable event types. */
export type AuditEventType = 'thought' | 'action';

/** A single structured entry written to the JSONL audit log. */
export interface AuditEntry {
  /** ISO-8601 UTC timestamp. */
  timestamp: string;
  /** Logical agent identifier. */
  agentId: string;
  /** LLM model identifier (e.g. "gpt-4"). */
  modelId: string;
  /** Event category: internal reasoning step or external tool/action call. */
  type: AuditEventType;
  /** Human-readable description of the thought or action. */
  content: string;
  /** Estimated USD cost for this step, if calculable. */
  costEstimateUsd?: number;
  /** Additional arbitrary metadata. */
  metadata?: Record<string, unknown>;
}

/** Resolved path for the runtime log directory. */
const LOG_DIR = join(process.cwd(), '.logs');
/** Full path to the JSONL audit file. */
const LOG_FILE = join(LOG_DIR, 'agent_reasoning.jsonl');

function ensureLogDir(): void {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
  } catch {
    // Ignore; if the dir can't be created the write below will also fail and
    // be caught there.
  }
}

function writeEntry(entry: AuditEntry): void {
  try {
    ensureLogDir();
    appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', { encoding: 'utf-8' });
  } catch {
    // File system unavailable (Edge runtime, read-only FS, etc.) – fall through
    // to the console logger so the entry is still visible in process output.
  }
}

/**
 * AuditLog appends structured reasoning traces to a JSONL file and mirrors
 * entries to the process logger for real-time visibility.
 */
export class AuditLog {
  /**
   * Log an agent's internal reasoning step ("Thought").
   */
  logThought(
    agentId: string,
    modelId: string,
    content: string,
    opts: { costEstimateUsd?: number; metadata?: Record<string, unknown> } = {},
  ): void {
    this.append({ agentId, modelId, type: 'thought', content, ...opts });
  }

  /**
   * Log an agent's external tool or action call ("Action").
   */
  logAction(
    agentId: string,
    modelId: string,
    content: string,
    opts: { costEstimateUsd?: number; metadata?: Record<string, unknown> } = {},
  ): void {
    this.append({ agentId, modelId, type: 'action', content, ...opts });
  }

  private append(
    params: Omit<AuditEntry, 'timestamp'>,
  ): void {
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      ...params,
    };

    writeEntry(entry);

    logger.info('audit', {
      agentId: entry.agentId,
      modelId: entry.modelId,
      type: entry.type,
      content: entry.content,
      ...(entry.costEstimateUsd !== undefined ? { costEstimateUsd: entry.costEstimateUsd } : {}),
      ...(entry.metadata ? { metadata: entry.metadata } : {}),
    });
  }
}

/** Process-level AuditLog singleton. */
export const globalAuditLog = new AuditLog();
