# Developer Setup Guide

## Prerequisites

- Node.js 20 or 22 (use `.nvmrc`: `nvm use`)
- npm 10+
- Git

## Setup

```bash
# Clone the repository
git clone https://github.com/SMSDAO/Agentic.git
cd Agentic

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials
```

## Environment Variables

See `.env.example` for all required variables. Minimum for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
OPENAI_API_KEY=sk-...
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | ESLint linting |
| `npm run test` | Run test suite |
| `npm run supabase:start` | Start local Supabase |
| `npm run supabase:stop` | Stop local Supabase |

## Project Structure

```
src/
├── app/           Next.js App Router (pages + API routes)
├── components/    Reusable React components
├── lib/           Integration libraries (Solana, Supabase, AI)
├── services/ai/   Structured AI service layer
└── styles/        Global CSS

config/            Platform configuration (Solana chains, etc.)
docs/              Documentation
tests/             Automated tests
scripts/           Build and utility scripts
supabase/          Database migrations
```

## Code Style

- TypeScript strict mode enabled
- ESLint with `no-console` as error (use `// eslint-disable-next-line no-console` for intentional logging)
- No `any` types allowed
- Unused variables with `^_` prefix are allowed

## Working with the AI Layer

Import from `@/services/ai` for AI functionality:

```typescript
import { createLangChainService } from '@/services/ai';
```

## Working with Solana

Import from `@/lib/solana/client`:

```typescript
import { createSolanaClient } from '@/lib/solana/client';
```

Chain configuration from `@/config/chains`:

```typescript
import { getChainConfig, PROGRAMS } from '@/config/chains';
```

## Running Tests

```bash
npm run test
```

Tests live in `tests/` and follow Jest conventions.

## Contributing

1. Create a feature branch from `main`
2. Make changes — ensure `npm run type-check` and `npm run lint` pass
3. Open a pull request targeting `main`
4. CI must pass before merging
