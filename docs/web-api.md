# Web API Reference

## Authentication

All SaaS endpoints require API key authentication:

- `x-api-key: <key>`
- `Authorization: Bearer <key>`

Keys are configured via `SAAS_API_KEYS` (`id:key:plan,id:key:plan`).

## Monetization Headers

Every authenticated response includes:

- `x-usage-count`: consumer usage count in current runtime

Rate limits return `429` when exceeded.

---

## Agents API

### GET `/api/agents`
List all agents.

### POST `/api/agents`
Create an agent.

Request body:

```json
{
  "name": "market-bot",
  "description": "Monitors market conditions",
  "config": { "mode": "analysis" }
}
```

### GET `/api/agents/{agentId}`
Fetch one agent.

### PATCH `/api/agents/{agentId}`
Update one agent.

### DELETE `/api/agents/{agentId}`
Delete one agent.

---

## Tasks API

### POST `/api/tasks`
Enqueue a task for async execution.

Request body:

```json
{
  "taskType": "execute_agent_prompt",
  "payload": { "prompt": "Give me SOL market summary" },
  "maxAttempts": 3
}
```

Supported `taskType` values:

- `execute_agent_prompt`
- `send_message`

Response: `202 Accepted`

```json
{
  "taskId": "<uuid>",
  "status": "queued"
}
```

### GET `/api/tasks`
List all tasks, or use query parameter:

- `/api/tasks?taskId=<uuid>`

### GET `/api/tasks/{taskId}`
Fetch a single task status.

Task lifecycle:

- `queued`
- `processing`
- `retrying`
- `completed`
- `failed`

---

## Messages API

### POST `/api/messages`
Queue outbound email/SMS message hooks.

Request body:

```json
{
  "channel": "sms",
  "recipient": "+15555555555",
  "message": "Your task completed",
  "metadata": { "tenant": "acme" }
}
```

Response: `202 Accepted` with queued `taskId`.

---

## Error Format

```json
{
  "error": "Human-readable message"
}
```
