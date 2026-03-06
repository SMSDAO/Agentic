# Deployment Guide

## Vercel Deployment

### Prerequisites

1. Vercel account with the project linked to `SMSDAO/Agentic`
2. Vercel CLI: `npm install -g vercel`

### Required Secrets (Vercel Dashboard)

Add these in **Settings → Environment Variables** (not in `vercel.json`):

| Secret Name | Environment |
|-------------|------------|
| `OPENAI_API_KEY` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview |
| `SOLANA_PRIVATE_KEY` | Production |
| `supabase-url` | Production, Preview |
| `supabase-anon-key` | Production, Preview |
| `app-url` | Production |

### vercel.json

The `vercel.json` references Vercel secret names via `@secret-name` syntax. Raw values must **never** appear in this file.

### Deployment

```bash
# Deploy to production
vercel --prod

# Or push to main branch for automatic deployment
git push origin main
```

### Build Configuration

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install --legacy-peer-deps` |
| Node.js Version | 20.x |
| Region | `iad1` (US East) |

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in values in .env.local

# Start development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

## Supabase Local Development

```bash
# Start local Supabase stack
npm run supabase:start

# Check status
npm run supabase:status

# Stop
npm run supabase:stop
```

## GitHub Codespaces

Open the repository in Codespaces — the `.devcontainer/devcontainer.json` automatically:
- Sets up Node.js 20
- Installs npm dependencies
- Forwards ports 3000, 54321, 54322

## Environment Variables Reference

| Variable | Required | Public | Description |
|----------|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Supabase anonymous key |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Yes | Yes | `mainnet-beta` or `devnet` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Yes | Custom RPC endpoint |
| `NEXT_PUBLIC_APP_URL` | Yes | Yes | Deployed app URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | No | Supabase service role key |
| `SOLANA_PRIVATE_KEY` | Yes | No | bs58 private key for server ops |
| `OPENAI_API_KEY` | Yes | No | OpenAI API key |
