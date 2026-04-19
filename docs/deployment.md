# Deployment Guide (Production SaaS)

## 1) Environment Setup

Copy the SaaS template:

```bash
cp .env.saas.example .env.saas
```

Set required values:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SOLANA_PRIVATE_KEY`
- `SAAS_API_KEYS`

## 2) Docker Build and Run

```bash
docker compose --env-file .env.saas up -d --build
```

Services:

- `web` on `http://localhost:3000`

Stop:

```bash
docker compose down
```

## 3) Health Verification

```bash
curl -H 'x-api-key: <your-key>' http://localhost:3000/api/agents
```

Expected:

- `200` with `agents` array
- `x-usage-count` response header

## 4) Runtime Configuration

- `QUEUE_BACKEND=memory` (default)
- `REDIS_URL` is reserved for future Redis-backed queue support and is not used by the current runtime
- `SAAS_RATE_LIMIT_MAX` / `SAAS_RATE_LIMIT_WINDOW_MS` for API protection

## 5) CI/CD Release System

Semantic release automation is configured via:

- `.github/workflows/release-please.yml`
- `release-please-config.json`
- `.release-please-manifest.json`

Behavior:

- On push to `main`, release-please updates version + changelog and creates tags
- Tags follow semantic versioning (`vMAJOR.MINOR.PATCH`)

## 6) Recommended Production Hardening

- Replace in-memory queue + metering with Redis-backed implementations
- Add persistent task and usage tables in Supabase/Postgres
- Route logs to a centralized platform
- Rotate API keys regularly and enforce short-lived scoped keys for enterprise tenants
