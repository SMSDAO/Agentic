# Changelog

All notable changes to **Agentic** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
