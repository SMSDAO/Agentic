# Repository Classification

## Classification: MULTIPLE_PLATFORM_WEB_PRIMARY

**Status**: Platform isolation in progress — web-only deployment active  
**Priority**: EMERGENCY SEPARATION REQUIRED for non-web platforms

---

## Platform Inventory

### Web Component — `AI_ENGINE`
- **Type**: Next.js 15 web application
- **Location**: `src/`
- **Deployment**: Vercel (production)
- **Services**: LangChain + OpenAI, Supabase, Solana Web3
- **Status**: ✅ ACTIVE — web-only CI/CD pipeline established

### Desktop Component (Tauri) — `DESKTOP_APP`
- **Type**: Tauri + Vite + React desktop application
- **Location**: `admin-tauri/`
- **Deployment**: Native binary distribution
- **Target Repository**: `SMSDAO/Agentic-Admin`
- **Status**: ⚠️ REQUIRES SEPARATION — build scripts isolated from web CI

### Desktop Component (Electron) — `DESKTOP_APP`
- **Type**: Electron Forge desktop application
- **Location**: `desktop/`
- **Deployment**: Native binary distribution
- **Target Repository**: `SMSDAO/Agentic-Desktop`
- **Status**: ⚠️ REQUIRES SEPARATION — build scripts isolated from web CI

### Mobile Component — `MOBILE_APP`
- **Type**: React Native + Expo managed workflow
- **Location**: `mobile/`
- **Deployment**: App Store / Play Store via EAS Build
- **Target Repository**: `SMSDAO/Agentic-Mobile`
- **Status**: ⚠️ REQUIRES SEPARATION — build scripts isolated from web CI

### Blockchain Component — `WEB3_ENGINE`
- **Type**: Solana integration (mainnet + devnet)
- **Location**: `src/lib/solana/`, `config/chains.ts`
- **Standards**: Metaplex NFT, SPL Token, Anchor framework
- **Status**: ✅ INTEGRATED — part of web platform

---

## Architecture Violations Identified

| Violation | Severity | Resolution |
|-----------|----------|------------|
| Multiple platform runtimes in single repo | CRITICAL | Isolate to separate repos |
| Electron + Tauri + RN build scripts in root `package.json` | HIGH | Removed — platform scripts isolated |
| `mobile` / `desktop` referenced in root CI | HIGH | New web-only CI workflows created |
| `SOLANA_PRIVATE_KEY` previously in `vercel.json` | CRITICAL | Moved to Vercel dashboard secrets |
| React version conflict (19 web vs 18 admin) | MEDIUM | Isolated per platform |
| Node version conflict (`>=24` vs `>=20`) | MEDIUM | Standardized to `>=20 <25` |

---

## Remediation Plan

### Immediate (this PR)
- [x] Remove `mobile` / `desktop` npm scripts from root `package.json`
- [x] Add `type-check` script for CI compatibility
- [x] Move web source to `src/` (Next.js standard)
- [x] Create web-only CI workflows
- [x] Remove private keys / secrets from `vercel.json`
- [x] Create `config/chains.ts` for Solana configuration
- [x] Create `src/services/ai/` structured service layer
- [x] Create `.devcontainer/` for Codespaces support

### Short-term (follow-up PRs)
- [ ] Create `SMSDAO/Agentic-Admin` repository with `admin-tauri/` contents
- [ ] Create `SMSDAO/Agentic-Desktop` repository with `desktop/` contents
- [ ] Create `SMSDAO/Agentic-Mobile` repository with `mobile/` contents
- [ ] Remove `admin-tauri/`, `desktop/`, `mobile/` directories from this repo
- [ ] Set up EAS Build for mobile
- [ ] Set up GitHub Actions for Tauri and Electron builds in their own repos

---

## Web Platform Architecture

```
SMSDAO/Agentic (web-only)
├── src/
│   ├── app/                    Next.js App Router
│   │   ├── api/               Server-side API routes
│   │   │   ├── ai/           AI agent endpoint
│   │   │   ├── balance/      Solana balance endpoint
│   │   │   └── market/       CoinGecko market data
│   │   ├── ai-agent/         AI chat interface
│   │   ├── dashboard/        Main dashboard
│   │   ├── defi/             DeFi operations
│   │   ├── market/           Market data
│   │   ├── nfts/             NFT management
│   │   ├── tokens/           Token operations
│   │   └── layout.tsx        Root layout
│   ├── components/           React UI components
│   ├── lib/                  Integration libraries
│   ├── services/             Service layer
│   │   └── ai/               AI service modules
│   └── styles/               Global styles
├── config/
│   └── chains.ts             Solana network configuration
├── tests/                    Automated test suite
├── docs/                     Documentation
├── scripts/                  Build and utility scripts
└── supabase/                 Database migrations
```
