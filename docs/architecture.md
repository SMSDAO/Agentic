# Production SaaS Architecture

## Service Boundaries

Agentic is organized into explicit runtime boundaries:

1. **API Layer (`src/app/api/**`)**
   - HTTP request parsing and response contracts
   - API key authentication and per-consumer rate limiting
   - Input validation with Zod

2. **Agent Engine (`src/modules/agent-engine/**`)**
   - Agent CRUD state and lifecycle (`active`, `paused`)
   - Isolated from transport concerns (no HTTP coupling)

3. **Task Runner Runtime (`src/modules/runtime/**`)**
   - Async queue orchestration
   - Retry and failure transitions
   - Task handler registration (`execute_agent_prompt`, `send_message`)

4. **Safety + Platform Controls (`src/modules/safety/**`, `src/modules/api/security.ts`)**
   - Structured logging
   - Secret-safe error handling utilities
   - Usage metering and request control

## High-Level Data Flow

```text
Client
  -> API Layer (/api/agents, /api/tasks, /api/messages)
    -> API Key Auth + Rate Limits + Usage Meter
      -> Agent Engine (CRUD)
      -> Task Queue (async execution + retries)
         -> Task Handlers (AI execution, message dispatch hooks)
```

## Runtime Model

### Queue

- Current backend: in-memory queue (default)
- Docker stack includes Redis for migration-ready queue externalization
- Task status lifecycle:
  - `queued`
  - `processing`
  - `retrying`
  - `completed`
  - `failed`

### Failure Handling

- Each task has `maxAttempts`
- Failed executions automatically retry with delay
- Terminal failure records the error for status APIs

## API Surface

### `/api/agents`
- `GET` list agents
- `POST` create agent

### `/api/agents/{agentId}`
- `GET` retrieve agent
- `PATCH` update agent
- `DELETE` remove agent

### `/api/tasks`
- `POST` enqueue execution task
- `GET` list tasks or query by `taskId`

### `/api/tasks/{taskId}`
- `GET` fetch task status

### `/api/messages`
- `POST` enqueue outbound email/SMS hook payload

## Monetization Controls

### API Keys

- Header support:
  - `x-api-key: <key>`
  - `Authorization: Bearer <key>`
- Configured through `SAAS_API_KEYS` env (`id:key:plan` entries)

### Rate Limiting

- Per-consumer request windows
- Controlled via:
  - `SAAS_RATE_LIMIT_MAX`
  - `SAAS_RATE_LIMIT_WINDOW_MS`

### Usage Metering

- Per-consumer usage count tracked per runtime instance
- Response includes `x-usage-count`

## Security and Safety Baseline

- Input validation on all new SaaS endpoints
- Secret-safe utility layer to avoid accidental leakage in errors/logs
- Structured JSON logs for operational monitoring
- Service boundaries reduce privilege bleed between HTTP and execution internals

## Deployment Topology

### Containerized Production

- `web` container: Next.js app
- `redis` container: queue backend service dependency

### Suggested Managed Components

- Managed Redis (ElastiCache/Upstash/Redis Cloud)
- Managed Postgres/Supabase for durable data
- Centralized log sink (Datadog, Loki, ELK)
- CI release automation with semantic tagging
