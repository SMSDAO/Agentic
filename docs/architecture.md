# Architecture

## Overview

Agentic is a Next.js 15 web platform that combines AI-powered agents (LangChain + OpenAI) with Solana blockchain operations.

## Platform Separation

The codebase previously contained four platform runtimes. They have been separated:

| Repository | Platform | Technology |
|-----------|---------|-----------|
| `SMSDAO/Agentic` | Web (this repo) | Next.js 15, Vercel |
| `SMSDAO/Agentic-Admin` | Desktop admin | Tauri + Vite |
| `SMSDAO/Agentic-Desktop` | Desktop | Electron Forge |
| `SMSDAO/Agentic-Mobile` | Mobile | React Native + Expo |

## Web Platform Directory Structure

```
/
├── src/
│   ├── app/                  Next.js App Router
│   │   ├── api/             Server-side API routes
│   │   │   ├── ai/         POST /api/ai — LangChain agent
│   │   │   ├── balance/    GET  /api/balance — SOL balance
│   │   │   └── market/     GET  /api/market — CoinGecko prices
│   │   ├── ai-agent/        AI chat UI
│   │   ├── dashboard/       Main dashboard
│   │   ├── defi/            DeFi operations
│   │   ├── market/          Market data
│   │   ├── nfts/            NFT management
│   │   └── tokens/          Token operations
│   ├── components/
│   │   ├── layout/          Navbar, ThemeProvider
│   │   └── ui/              Button, Card, Input
│   ├── lib/
│   │   ├── ai/              LangChain + DALL-E wrappers
│   │   ├── market/          CoinGecko client
│   │   ├── solana/          Solana client, DeFi, NFT
│   │   ├── supabase/        Supabase client
│   │   ├── env.ts           Validated environment variables
│   │   └── utils.ts         Shared utilities
│   ├── services/
│   │   └── ai/              Structured AI service layer
│   │       ├── index.ts
│   │       ├── langchain-service.ts
│   │       ├── openai-service.ts
│   │       ├── prompt-optimization.ts
│   │       ├── token-tracking.ts
│   │       ├── rate-limiting.ts
│   │       └── fallback-handlers.ts
│   └── styles/
│       └── globals.css
├── config/
│   └── chains.ts            Solana network configuration
├── tests/                   Automated test suite
├── docs/                    Documentation
├── scripts/                 Build and utility scripts
├── supabase/                Database migrations
└── .devcontainer/           GitHub Codespaces config
```

## Data Flow

```
Browser → Next.js App Router → API Routes → Services → External APIs
                                              ├── LangChain/OpenAI
                                              ├── Solana Web3.js
                                              ├── Supabase
                                              └── CoinGecko
```

## Key Design Decisions

1. **App Router only** — no Pages Router; all routes under `src/app/`
2. **Service layer** — `src/services/ai/` isolates AI logic from HTTP layer
3. **Config separation** — `config/chains.ts` is framework-agnostic
4. **Secrets via Vercel dashboard** — no secrets in `vercel.json` or source
