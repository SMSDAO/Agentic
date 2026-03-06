/**
 * Token usage tracking for OpenAI API calls.
 *
 * In serverless environments each invocation is stateless; aggregated
 * metrics should be persisted to Supabase or another store if needed.
 */

export interface TokenUsageRecord {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: number;
  requestId?: string;
}

export interface TokenStats {
  totalRequests: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
}

/**
 * Per-model pricing (USD per 1 000 tokens) — update as OpenAI revises rates.
 */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
};

export class TokenTracker {
  private records: TokenUsageRecord[] = [];

  record(usage: TokenUsageRecord): void {
    this.records.push(usage);
  }

  getStats(): TokenStats {
    const stats: TokenStats = {
      totalRequests: this.records.length,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      estimatedCostUsd: 0,
    };

    for (const r of this.records) {
      stats.totalTokens += r.totalTokens;
      stats.promptTokens += r.promptTokens;
      stats.completionTokens += r.completionTokens;

      const pricing = MODEL_PRICING[r.model];
      if (pricing) {
        stats.estimatedCostUsd +=
          (r.promptTokens / 1000) * pricing.input +
          (r.completionTokens / 1000) * pricing.output;
      }
    }

    return stats;
  }

  reset(): void {
    this.records = [];
  }
}

export function createTokenTracker(): TokenTracker {
  return new TokenTracker();
}
