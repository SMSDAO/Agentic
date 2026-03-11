# Security Guide

## Environment Variables

### Secret Management Policy

**Never** commit secrets to source code or place them in `vercel.json`'s public `env` section.

| Variable | Where to set | Notes |
|----------|-------------|-------|
| `OPENAI_API_KEY` | Vercel dashboard → Settings → Environment Variables | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel dashboard | Server-only, never expose to client |
| `SOLANA_PRIVATE_KEY` | Vercel dashboard | Server-only, high sensitivity |
| `NEXT_PUBLIC_SUPABASE_URL` | `vercel.json` `env` (Vercel secret ref) | Client-safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `vercel.json` `env` (Vercel secret ref) | Client-safe |
| `NEXT_PUBLIC_SOLANA_NETWORK` | `vercel.json` `env` | Client-safe |

### vercel.json Policy

- `env` section: public client-side variables only (referenced via `@secret-name`)
- `build.env` section: server-side secrets referenced via `@secret-name`
- Raw secret values must **never** appear in this file

## Blockchain Security

### Private Key Handling
- Private keys are loaded from environment variables server-side only
- The `SOLANA_PRIVATE_KEY` env var is validated at startup via `lib/env.ts`
- Keys are decoded in `lib/solana/client.ts` constructor and kept in memory only
- Private key decoding errors are logged; the process continues running, but Solana operations requiring a wallet may fail at runtime

### Wallet Signature Verification
- All wallet-authenticated actions must verify a signature before processing
- Use `PublicKey.verify()` or Supabase Auth with wallet adapter integration
- Never trust a wallet address claimed in a request body without signature proof

### Transaction Security
- Confirm all transaction parameters before sending
- Use `connection.simulateTransaction()` before `sendTransaction()` for critical ops
- Set appropriate compute unit limits via `ComputeBudgetProgram`

## AI Security

### API Key Exposure
- `OPENAI_API_KEY` is server-side only; never accessible from the browser
- Rate limiting is applied in `src/services/ai/rate-limiting.ts`
- Input validation happens in API routes before reaching the AI layer

### Prompt Injection
- User prompts are sanitized and bounded by `truncateToTokenLimit()` in `src/services/ai/prompt-optimization.ts`
- System prompt is fixed per request; user cannot override it
- AI responses are treated as untrusted text — do not eval or execute

## Content Security Policy

The application does **not** currently configure a custom Content Security Policy in middleware. When you add CSP middleware (for example in `src/app/middleware.ts`), you should set headers such as:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

If you enable a stricter CSP, note that `'unsafe-inline'` may be required for certain Next.js inline styles unless you refactor them.

## Admin System Isolation

The admin panels (Tauri, Electron) are in separate repositories and:
- Never deploy to Vercel
- Have their own authentication independent of the web app
- Do not share secrets with the web platform

## Dependency Security

- Run `npm audit` before each release
- The `.github/workflows/security-audit.yml` workflow runs weekly
- Dependabot is configured to auto-update dependencies
