# Web API Reference

## Authentication

All API routes are server-side Next.js Route Handlers. Authentication is handled via Supabase Auth headers where required.

## Endpoints

### POST /api/ai

Execute a Solana AI agent query via LangChain + OpenAI.

**Request Body**

```json
{
  "prompt": "What is the SOL balance of <address>?"
}
```

**Response (200)**

```json
{
  "response": "The SOL balance of <address> is 4.2 SOL."
}
```

**Error Responses**

| Status | Condition |
|--------|-----------|
| 400 | Missing `prompt` field |
| 500 | OpenAI API key not configured |
| 500 | Agent execution failed |

---

### GET /api/balance?address=\<address\>

Fetch the SOL balance for a Solana wallet address.

**Query Parameters**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `address` | Yes | Base58-encoded Solana public key |

**Response (200)**

```json
{
  "address": "8xrt...",
  "balance": 4.2,
  "unit": "SOL"
}
```

---

### GET /api/market

Fetch current cryptocurrency market data from CoinGecko.

**Response (200)**

```json
{
  "data": [...]
}
```

## Error Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

## Rate Limiting

API routes are protected by middleware-level rate limiting. Excessive requests return HTTP 429.
