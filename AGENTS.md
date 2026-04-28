# AGENTS.md — Agent Native Repository Guide

> This file is the authoritative reference for autonomous coding agents (GitHub Copilot, Devin, OpenHands, etc.) working inside this repository. Read it before making any changes.

---

## 1. Canonical Entry Points

| Surface | Path | Purpose |
|---|---|---|
| **Web API** | `src/app/api/` | Next.js Route Handlers — all external HTTP entry points |
| **Agent engine** | `src/modules/agent-engine/` | In-process agent CRUD and lifecycle management |
| **Task runtime** | `src/modules/runtime/index.ts` | `getRuntimeQueue()` — the single queue/handler bootstrap |
| **Orchestrator** | `src/modules/runtime/orchestrator.ts` | `OrchestratorNode` — one-file portable execution node |
| **AI services** | `src/services/ai/index.ts` (server) / `src/services/ai/utils.ts` (client-safe) | LangChain, OpenAI, token tracking, rate limiting |
| **Safety layer** | `src/modules/safety/` | `SafetyGuard`, `AuditLog`, `logger`, `secrets` |

### Starting a task

1. For **new agent tasks**, enqueue them via `getRuntimeQueue().enqueue(...)` and register a handler with `queue.registerHandler(type, handler)`.
2. For **direct LLM calls**, import from `@/services/ai` (server) and use `createLangChainService()` or `createSolanaAgent()`.
3. For **production orchestration**, use `OrchestratorNode` from `src/modules/runtime/orchestrator.ts`.

---

## 2. Do-Not-Touch Zones

The following areas must **not** be modified without explicit human review and sign-off. They represent critical infrastructure whose correctness cannot be verified by automated tooling alone.

| Zone | Path(s) | Reason |
|---|---|---|
| **Auth handlers** | `src/app/api/auth/**`, `src/lib/supabase/admin-auth.ts` | Authentication and session management. Any change risks security regression. |
| **Solana key management** | `src/lib/solana/client.ts` | Handles private key loading; a bug can drain wallets. |
| **Cryptographic overrides** | `package.json` → `overrides.elliptic`, `overrides.crypto-js` | Pinned to audited safe versions; do not upgrade without security review. |
| **Core rate limiter** | `src/services/ai/rate-limiting.ts` | Changing window/max values affects billing and abuse protection. |
| **Task queue retry logic** | `src/modules/runtime/task-queue.ts` (lines 83–124) | Retry/back-off logic is load-tested; changes require regression tests. |
| **Safety guard thresholds** | `src/modules/safety/safety-guard.ts` → `MAX_RECURSION_DEPTH` | Hard-coded at 5; lowering it breaks legitimate chains, raising it opens DoS risk. |
| **Environment validation** | `src/lib/env.ts` | Must reject bad configs at startup; loosening checks silently disables safety. |

---

## 3. Error Recovery Map

Use this table when an LLM hallucinates a tool call or a dependency fails.

| Failure Mode | Symptom | Recovery Action |
|---|---|---|
| **Hallucinated tool call** | `No handler registered for task type: <unknown>` | The task fails with status `failed`. Log the hallucination to the AuditLog via `globalAuditLog.logAction(agentId, modelId, errorMessage)`. Do **not** retry blindly — surface to the caller. |
| **Missing API key** | `OPENAI_API_KEY is not configured` | Check `process.env.OPENAI_API_KEY`. In dev, set `.env.local`. In CI, the key is injected via GitHub Actions secret. |
| **Provider health check failure** | `OrchestratorNode: all providers unhealthy` | `OrchestratorNode` auto-activates `MockProvider` (self-healing). To re-link a real provider, call `node.selectProvider()` after the dependency is restored. |
| **HardStop (max depth)** | `HardStop: agent "<id>" exceeded max recursion depth` | Catch `HardStopError`, read `err.lastStableState`, return it to the caller. Do **not** re-enter — the guard blocks re-entry until `guard.reset(agentId)` is explicitly called. |
| **HardStop (token limit)** | `HardStop: agent "<id>" exceeded token budget` | Same as above. Review prompt size and reduce context window before retrying. |
| **Rate limit exceeded** | HTTP 429 / `enforceRateLimit` returns `allowed: false` | Wait until `resetAt` timestamp, then retry. Exponential back-off is recommended. |
| **Supabase connection failure** | `supabaseClient` throws on query | The `FallbackChain` in `src/services/ai/fallback-handlers.ts` can wrap DB calls. For read-only operations, consider returning cached/stale data. |
| **Build-time env missing** | Next.js build fails with `NEXT_PUBLIC_*` undefined | Supply the placeholder env vars listed in `.github/workflows/ci.yml` under the `Build` step. |

---

## 4. Agent Lifecycle Management

```
                  ┌────────────┐
          create  │   active   │  pause
  ────────────────►            ◄────────────────
                  └────┬───────┘
                       │ task enqueued
                  ┌────▼───────┐
                  │ processing │
                  └────┬───────┘
           success │   │ failure (< maxAttempts)
                   │   ▼
                   │  retrying ──► processing
                   │
                   ▼ failure (maxAttempts exhausted)
                  failed ──► (human review) ──► reset ──► active
```

### Rules

1. **Create** — Use `AgentEngineStore.create()`. Agents start in `active` status.
2. **Pause** — Use `updateByConsumer(id, consumerId, { status: 'paused' })`. Paused agents must not accept new tasks.
3. **Task execution** — Always enqueue tasks via `getRuntimeQueue().enqueue(...)`. Do not call handlers directly in production.
4. **Depth tracking** — When executing recursive/chained agent calls, call `guard.enter(agentId, state)` before each call and `guard.exit(agentId, result)` after. The default `globalSafetyGuard` is already wired into `OrchestratorNode`.
5. **Reset** — After a permanent failure, call `guard.reset(agentId)` before allowing re-activation to clear the circuit-breaker state.
6. **Deletion** — `deleteByConsumer` removes the agent record. Pending tasks in the queue are **not** automatically cancelled; drain the queue or mark them failed before deletion.

---

## 5. Safety Protocols & Escalation Procedures

### Circuit Breaker

`SafetyGuard` (`src/modules/safety/safety-guard.ts`) enforces two hard limits:

| Limit | Default | Config key |
|---|---|---|
| Recursion depth | **5** | `SafetyGuardConfig.maxDepth` |
| Token budget | ∞ (unlimited) | `SafetyGuardConfig.maxTokens` |

When either limit is breached a `HardStopError` is thrown. The error carries `lastStableState` — always return this to the caller rather than an empty response.

### Audit Log

Every agent reasoning step is appended to `.logs/agent_reasoning.jsonl` as a JSONL record:

```jsonc
{
  "timestamp": "2026-04-28T10:00:00.000Z",
  "agentId": "agent-abc",
  "modelId": "gpt-4",
  "type": "thought",          // or "action"
  "content": "I should ...",
  "costEstimateUsd": 0.003    // optional
}
```

The `.logs/` directory is git-ignored. Rotate or archive the file periodically in long-running deployments.

### Escalation Tiers

| Tier | Trigger | Response |
|---|---|---|
| **L1 – Auto-recover** | Single provider failure | `OrchestratorNode` self-heals to `MockProvider` |
| **L2 – Task retry** | Task handler throws (attempts < maxAttempts) | Queue retries with `TASK_RETRY_DELAY_MS` back-off |
| **L3 – HardStop** | Depth ≥ 5 or token budget exceeded | Return `lastStableState`, halt recursion, log to AuditLog |
| **L4 – Human review** | Task reaches `failed` after all retries | Alert on-call engineer; do not auto-retry without investigation |
| **L5 – Incident** | Auth breach, key exposure, or on-chain loss | Rotate credentials immediately, revert affected deployments, file incident report |

### Sensitive Zones

- Never log raw API keys. Use `maskSecret()` from `src/modules/safety/secrets.ts`.
- Never commit secrets to source control.
- The `.env` and `.env*.local` files are git-ignored; use GitHub Actions secrets for CI.
