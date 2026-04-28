# Changelog

All notable changes to **Agentic** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0](https://github.com/SMSDAO/Agentic/compare/v0.1.0...v0.2.0) (2026-04-28)


### Features

* add admin dashboard with fee schedule and intent mapping management ([ec62fd7](https://github.com/SMSDAO/Agentic/commit/ec62fd7bd8853f4d6d683b850bce348383993b8d))
* add Agentic Copilot system prompt and configuration ([fa964fd](https://github.com/SMSDAO/Agentic/commit/fa964fd0eeec4ee25c0ad7858caf17ec25b1c6ba))
* add deployment, release automation, and SaaS documentation ([5acff32](https://github.com/SMSDAO/Agentic/commit/5acff32db85ef4d6d075133a1b79b06c21dc1a05))
* add SaaS API modules and async runtime queue ([8fb78e3](https://github.com/SMSDAO/Agentic/commit/8fb78e373d97d6e6a300f2b352f6d1de8a733c56))
* Admin Dashboard for fee schedule and intent mapping management ([8249f00](https://github.com/SMSDAO/Agentic/commit/8249f006b4ed43372b2cefde6da9153a820e546a))
* Production Beta Hardening - Governance & Resilience Layer ([71d71ff](https://github.com/SMSDAO/Agentic/commit/71d71ff88dd649a9c112c03e695b834366a69961))


### Bug Fixes

* address reviewer thread with tenant scoping and hardened API contracts ([25faa4b](https://github.com/SMSDAO/Agentic/commit/25faa4b695e5ab89bed8948f6a7022c43eadc70b))
* apply PR review feedback + pin elliptic/crypto-js overrides for vulnerability fixes ([58e48d8](https://github.com/SMSDAO/Agentic/commit/58e48d85370eeb969514b4be13ed8a218b1ba194))
* correct CopilotResponsePattern doc comment — direct_answer is mandatory ([5beb999](https://github.com/SMSDAO/Agentic/commit/5beb999a649c254c9108740a077ca9079039f23a))
* resolve final review nits on jsonError and task attempt semantics ([a99cd93](https://github.com/SMSDAO/Agentic/commit/a99cd938cc9d68154b14a988c61b59bd86d46872))
* **security:** resolve critical dep vulnerabilities via npm overrides; update audit threshold ([ca60e4f](https://github.com/SMSDAO/Agentic/commit/ca60e4f8c58136e9f2a1e62ee1e41c32a30c7f49))


### Refactoring

* share API access guard and harden auth parsing ([cf0c551](https://github.com/SMSDAO/Agentic/commit/cf0c551b8c1ff7ee21b2427124ed6294c48479cd))


### Chores

* address review feedback and tighten SaaS runtime docs/tests ([5791b4e](https://github.com/SMSDAO/Agentic/commit/5791b4e83a7f9ad4c3079cfcaccce519ab2254e1))
* finalize review nits for security and queue robustness ([c0b3561](https://github.com/SMSDAO/Agentic/commit/c0b35612887114b94124a9741f851a2bb6938723))
* harden config parsing and consolidate async test utilities ([a24786a](https://github.com/SMSDAO/Agentic/commit/a24786afa5e9c9fb1e169ec7c1b6810470686e4c))

## [Unreleased]

### Added
- **Mobile (Expo Router)**: Complete React Native / Expo scaffold with Neo Glow design system.
  - Expo Router `app/` directory with tab layout (Dashboard, Tokens, NFTs, DeFi, AI Agent).
  - `NeoGlowCard` component mirroring the web `neo-card` utility.
  - AI Agent chat screen with message bubbles.
  - `constants/index.ts` with shared colour palette and network config.
  - `babel.config.js` and `tsconfig.json` for the mobile workspace.
  - `build:android` / `build:ios` EAS scripts in `mobile/package.json`.
- **Desktop (Electron)**: Added missing `desktop/src/preload.js` with a safe `contextBridge` / `ipcRenderer` API surface (`getAppVersion`, `checkForUpdates`).
- **Root scripts**: Added `mobile`, `mobile:android`, `mobile:ios`, `desktop`, and `desktop:build` convenience scripts to the root `package.json`.
- **Environment**: Added Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) to `.env.example`.

### Fixed
- **Desktop**: `preload.js` was referenced in `desktop/src/main.js` but did not exist; file is now present.

---

## [0.1.0] – 2025-01-15

### Added
- Next.js 15 App Router web application with Neo Glow design system.
- Tailwind CSS with custom neon colours, glow shadows, and animation utilities.
- UI components: `Button`, `Card` (with sub-components), `Input`, `ErrorBoundary`, `Navbar`.
- Solana integration: `client.ts`, `defi.ts` (Jupiter, Raydium, Kamino, Drift, deBridge, Jito), `nft.ts` (Metaplex, 3.Land).
- AI services: LangChain agent, DALL-E NFT art generation, Vercel AI SDK streaming, rate limiter, fallback chain, prompt optimisation, token tracking.
- Market data: CoinGecko Pro API client.
- Supabase integration: typed client, Row Level Security policies, admin auth helper.
- Admin panel: Tauri desktop application with 11 screens (Agents, Users, Billing, Fees, RPC, Oracles, Wallets, Add-ons, SDK/API, Logs, Settings).
- API routes: `/api/ai`, `/api/balance`, `/api/market`, `/api/admin/fees`, `/api/admin/intents`.
- Zod environment validation (`src/lib/env.ts`).
- 38 Vitest unit tests covering `cn`, `formatNumber`, `shortenAddress`, `formatCurrency`, `RateLimiter`, `createRateLimiter`, `withFallback`, `FallbackChain`, `buildSystemPrompt`, `optimizePrompt`, `truncateToTokenLimit`.
- CI/CD GitHub Actions workflow (type-check → lint → test → build on Node 20 and 22).
- Supabase database migrations: initial schema, admin dashboard schema (`002_admin_tauri_schema.sql`).
- Multi-chain configuration in `config/chains.ts`.
- Comprehensive documentation suite in `docs/`.
- `vercel.json` for one-click Vercel deployment.
- MIT License.

[Unreleased]: https://github.com/SMSDAO/Agentic/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SMSDAO/Agentic/releases/tag/v0.1.0
