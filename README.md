# 🚀 Agentic - Solana AI Web3 Platform

A comprehensive full-stack Web3 platform featuring Neo Glow design, AI-powered agents, and complete blockchain integration for the Solana ecosystem.

![Agentic Banner](https://img.shields.io/badge/Solana-Web3-blueviolet?style=for-the-badge)
![Node](https://img.shields.io/badge/Node-20.19%2B-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)

## ✨ Features

### 🎨 Frontend - Modern Neo Glow UI
- **Next.js 15 App Router** with TypeScript
- **Neo Glow Design System**: glowing borders, neon accents, glassmorphism
- **Tailwind CSS** with custom glow utilities
- Fully responsive (desktop, tablet, mobile)
- Dashboard for all blockchain operations

### 🖥️ Admin Panel - Tauri Desktop App
- **Local Windows application** for platform administration
- Complete agent management (create, pause, resume, configure)
- User management with credits, plans, and account controls
- Billing system (Stripe + crypto payment tracking)
- Fee configuration and overrides
- Infrastructure management (RPC endpoints, oracles, wallets)
- Add-ons and SDK/API key management
- Comprehensive audit logging
- Secure admin-only access with service role key

> **Note:** Admin panel screenshots will be added after initial deployment. To see the admin interface:
> 1. Navigate to `admin-tauri/`
> 2. Configure `.env` with your Supabase service role key
> 3. Run `npm run tauri:dev`
> 4. The admin panel will launch as a desktop application

### 🗄️ Database - Supabase Integration
- Real-time database with PostgreSQL
- Row Level Security (RLS) policies
- Database schemas for:
  - Users & authentication
  - Wallet connections
  - Transaction history
  - Token portfolios
  - NFT collections & metadata
  - DeFi positions
  - AI agent configurations & memory

### 🌐 Deployment - Vercel Ready
- One-click Vercel deployment
- Environment variable configuration
- Edge functions and API routes
- Optimized build configuration

### 📱 Mobile App - React Native/Expo
- Cross-platform (iOS & Android)
- Neo Glow themed components
- Shared types and API client
- Real-time blockchain data

### 💻 Desktop App - Electron
- Windows executable (`agentic.exe`)
- Full admin UI dashboard
- System tray integration
- Auto-update support
- Node 20.19+ compatible

### ⛓️ Blockchain Features

#### Token Operations
- Deploy SPL tokens via Metaplex
- Transfer assets
- Balance checks
- Stake SOL
- ZK compressed Airdrop (Light Protocol)
- Jupiter, Raydium, Kamino, Helius integrations

#### NFTs
- **Metaplex**: Collection deployment, minting, metadata
- **3.Land**: Create collections, list NFTs for sale in any SPL token
- Royalty configuration
- Automatic marketplace listing

#### DeFi Integration
- **Jupiter**: Best price swaps
- **PumpPortal**: Token launches
- **Raydium**: CPMM, CLMM, AMMv4 pools
- **Orca**: Whirlpool integration
- **Meteora**: Dynamic AMM, DLMM, Alpha Vault
- **Kamino**: Lending and yield
- **Drift**: Perps, vaults, lending
- **Manifest**: Market creation, limit orders
- **Openbook**: Market creation
- **Jito Bundles**: MEV protection
- **deBridge DLN**: Cross-chain bridging

#### Solana Blinks
- Lulo lending (best USDC APR)
- Arcade games
- JupSOL staking
- Solayer sSOL staking

#### Other Features
- SNS domain registration/resolution
- Alldomains registration
- Gib Work bounty registration
- Perpetuals trading (Adrena)

### 📊 Market Data
- **CoinGecko Pro API**: Real-time prices, trends, top gainers
- **Pyth Network**: High-fidelity oracle price feeds
- Token information lookup
- Pool tracking

### 🤖 AI Integration

#### LangChain
- Ready-to-use blockchain tools
- Autonomous agent support
- Memory management
- Streaming responses

#### Vercel AI SDK
- Framework-agnostic AI
- Quick toolkit setup
- Real-time streaming

#### AI Capabilities
- DALL-E NFT artwork generation
- Natural language blockchain commands
- Price feed integration
- Automated decision-making
- Interactive & autonomous modes

## 🏗️ Project Structure

```
Agentic/
├── src/                    # Next.js 15 web app (App Router)
│   ├── app/               # Pages and API routes
│   │   ├── layout.tsx     # Root layout with ErrorBoundary
│   │   ├── page.tsx       # Home page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── tokens/        # Token operations
│   │   ├── nfts/          # NFT management
│   │   ├── defi/          # DeFi integrations
│   │   ├── market/        # Market data
│   │   ├── ai-agent/      # AI agent chat interface
│   │   └── api/           # API routes (ai, balance, market)
│   ├── components/        # React components
│   │   ├── ui/            # Button, Card, Input (Neo Glow)
│   │   ├── layout/        # Navbar (responsive)
│   │   └── ErrorBoundary.tsx  # React error boundary
│   ├── lib/               # Server/client libraries
│   │   ├── solana/        # Solana client, DeFi, NFT
│   │   ├── ai/            # LangChain, DALL-E
│   │   ├── market/        # CoinGecko client
│   │   ├── supabase/      # Supabase client
│   │   ├── env.ts         # Zod env validation
│   │   └── utils.ts       # Shared utilities
│   ├── services/ai/       # AI service layer
│   │   ├── index.ts       # Server-only entry (server-only guard)
│   │   ├── utils.ts       # Client-safe utilities
│   │   ├── rate-limiting  # Request rate limiter
│   │   ├── fallback-handlers # Provider fallback chain
│   │   ├── token-tracking # OpenAI usage tracking
│   │   └── prompt-optimization # Prompt engineering
│   └── styles/            # globals.css (Neo Glow design system)
├── admin-tauri/           # Tauri desktop admin panel
│   ├── src/main/          # Supabase commands (TypeScript)
│   ├── src/ui/screens/    # 11 admin screens (React)
│   └── src-tauri/         # Rust backend
├── mobile/                # React Native/Expo scaffold
├── desktop/               # Electron scaffold
├── config/                # Multi-chain configuration
├── supabase/migrations/   # Database schema migrations
├── tests/unit/            # Vitest unit tests (38 tests)
├── docs/                  # Documentation suite
└── .github/workflows/     # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite/Vitest)
- npm 10+
- Supabase account
- Solana wallet
- API keys (optional, see `.env.example`)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SMSDAO/Agentic.git
cd Agentic
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- Supabase URL and keys
- Solana RPC URL
- OpenAI API key (for AI features)
- CoinGecko API key (optional)
- Other service API keys as needed

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new Supabase project
2. Run the migrations:
```bash
npm run supabase:start
```

The database schema will be automatically created from `supabase/migrations/`.

## 📱 Mobile App

```bash
cd mobile
npm install
npm start
```

Use Expo Go app on your phone or run in a simulator.

## 💻 Desktop App

```bash
cd desktop
npm install
npm run dev
```

To build the Windows executable:
```bash
npm run make
```

The `agentic.exe` will be in the `out` directory.

## 🔧 Admin Panel (Tauri)

The admin panel is a separate Tauri desktop application for platform administration.

```bash
cd admin-tauri
npm install
cp .env.example .env
```

Edit `.env` and add your Supabase **service role key** (required for admin operations):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Run the admin panel:
```bash
npm run tauri:dev
```

Build for production:
```bash
npm run tauri:build
```

### Admin Panel Features
- **Agents**: Create, configure, pause/resume AI agents with schedules
- **Users**: Manage users, adjust credits/plans, freeze accounts
- **Billing**: View subscription plans, invoices, process refunds
- **Fees**: Configure global and per-user/per-agent fees
- **Infrastructure**: Manage wallet connectors, price oracles, RPC endpoints
- **Add-ons**: Install and configure platform extensions
- **SDK/API**: Generate and manage API keys with scopes
- **Logs**: View comprehensive audit trail
- **Settings**: Configure global platform settings

> **Security Note:** The admin panel requires the Supabase service role key, which has full database access. Never expose this key publicly or commit it to version control. Run the admin panel only on secure, trusted machines.

## 🌐 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Or use Vercel CLI:
```bash
vercel deploy
```

### Environment Variables

Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `COINGECKO_API_KEY`
- See `.env.example` for complete list

## 🛠️ Development

### Running Tests
```bash
# Run unit tests (38 tests)
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage
```

Unit tests are located in `tests/unit/` and cover:
- `lib/utils.ts` — `cn`, `formatNumber`, `shortenAddress`, `formatCurrency`
- `services/ai/rate-limiting.ts` — `RateLimiter`, `createRateLimiter`
- `services/ai/fallback-handlers.ts` — `withFallback`, `FallbackChain`
- `services/ai/prompt-optimization.ts` — `buildSystemPrompt`, `optimizePrompt`, `truncateToTokenLimit`

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## 📚 Documentation

### Key Files

- **`lib/solana/client.ts`**: Solana blockchain client
- **`lib/solana/nft.ts`**: NFT operations with Metaplex
- **`lib/solana/defi.ts`**: DeFi integrations (Jupiter, etc.)
- **`lib/ai/langchain.ts`**: LangChain AI agent
- **`lib/ai/dalle.ts`**: DALL-E image generation
- **`lib/market/coingecko.ts`**: Market data API
- **`lib/supabase/client.ts`**: Supabase database client

### API Routes

- **`/api/balance`**: Get SOL/token balances
- **`/api/market`**: Market data endpoints
- **`/api/ai`**: AI agent interactions

## 🎨 Neo Glow Design System

The platform features a custom Neo Glow design system with:

- **Colors**: Neon blue, purple, pink, green, yellow
- **Components**: Cards, buttons, inputs with glow effects
- **Utilities**: Custom Tailwind classes for glowing borders, shadows
- **Animations**: Glow pulse, float effects
- **Theme**: Dark mode with luminous accents

### Using Neo Glow Components

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

<Button variant="primary">Glow Button</Button>
<Card className="neo-card">Content</Card>
```

## 📸 Screenshots

> Screenshots are captured after local deployment. Run `npm run dev` (web) or `cd admin-tauri && npm run tauri:dev` (admin) and save images to `docs/screenshots/` using the filenames referenced below.

---

### 🌐 User Dashboards (`src/app/`)

#### Main Dashboard (`/dashboard`)

![Dashboard overview](docs/screenshots/dashboard-overview.png)

The main dashboard gives users a full portfolio overview in a 4-column stat grid and two detail cards:

| Widget | Content |
|---|---|
| **Total Balance** | USD portfolio value with 24 h change percentage (neon-blue) |
| **Active Positions** | Open DeFi positions count with delta (neon-purple) |
| **NFT Holdings** | Total NFTs held with recent additions (neon-pink) |
| **Recent Transactions** | On-chain tx count with 24 h delta (neon-green) |
| **Recent Transactions card** | Last 3 transfers with timestamp and amount |
| **Portfolio Distribution card** | SOL / USDC / Other bar chart with percentages |

---

#### Token Operations (`/tokens`)

![Token operations](docs/screenshots/tokens-overview.png)

SPL token management interface with a **Transfer** and **Deploy Token** action bar at the top.

| Section | Details |
|---|---|
| **Token list** | One card per token: name, symbol, balance, USD value, 24 h change badge |
| **Token Deployment** | Deploy new SPL tokens via Metaplex — "Deploy Now" CTA |
| **Transfer Assets** | Send tokens to any Solana address — "Transfer" CTA |
| **Airdrop (ZK)** | ZK-compressed airdrops via Light Protocol — "Airdrop" CTA |

---

#### NFT Management (`/nfts`)

![NFT management](docs/screenshots/nfts-overview.png)

4-column NFT gallery with **Upload** and **Create Collection** actions.

| Section | Details |
|---|---|
| **NFT grid** | 4-column card grid; each card shows artwork, name, floor price, and a View action |
| **Metaplex Integration** | Collection deployment, minting, metadata management, royalty config |
| **3.Land Marketplace** | Automatic listing, SPL-token pricing, instant settlement |

---

#### DeFi Operations (`/defi`)

![DeFi operations](docs/screenshots/defi-overview.png)

4-button quick-action bar (Swap / Liquidity / Stake / Farm) above a protocol card grid.

| Protocol | Description |
|---|---|
| Jupiter | Best-price token swaps with route optimisation |
| Raydium | CPMM / CLMM AMM pools |
| Orca | Concentrated liquidity Whirlpools |
| Meteora | Dynamic liquidity (DLMM) |
| Kamino | Lending and borrowing |
| Drift | Perpetual futures and vaults |
| deBridge DLN | Cross-chain asset bridging |
| Jito Bundles | MEV-protected transaction bundles |

---

#### Market Data (`/market`)

![Market data](docs/screenshots/market-overview.png)

Real-time market overview with a 3-card header and a sortable token table.

| Section | Details |
|---|---|
| **Market Cap card** | Global crypto market cap + 24 h change |
| **24 h Volume card** | Global trading volume |
| **BTC Dominance card** | BTC dominance percentage |
| **Trending on Solana** | Table: rank, name/symbol, price, 24 h %, volume, market cap |
| **CoinGecko Pro API** | Data source panel: prices, trends, gainers/losers, historical |
| **Pyth Network** | On-chain oracle feeds: real-time, low-latency, multi-asset |

---

#### AI Agent (`/ai-agent`)

![AI agent interface](docs/screenshots/ai-agent-overview.png)

Split-panel layout: chat window (2/3 width) + capabilities sidebar (1/3 width).

| Panel | Details |
|---|---|
| **Chat window** | Scrollable message history; text input + Send button |
| **Capabilities** | Checklist: balance check, token transfer, Jupiter swap, NFT mint, artwork gen, market analysis, DeFi ops |
| **Quick Actions** | One-click prompts: "Check my balance", "Show trending tokens", "Generate NFT artwork", "Latest market prices" |
| **LangChain** | Agent backend: memory management, tool orchestration, streaming |
| **Vercel AI SDK** | Multi-provider AI integration with type-safe streaming |

---

### 🛠️ Admin Panel (`admin-tauri/`)

The admin panel is a **Tauri desktop application** (separate from the web app). It connects directly to Supabase using the service role key and provides privileged management screens.

```
cd admin-tauri
cp .env.example .env   # add SUPABASE_SERVICE_ROLE_KEY
npm install
npm run tauri:dev
```

#### Agents Screen

![Admin – Agents](docs/screenshots/admin-agents.png)

| Column | Description |
|---|---|
| Name | Agent display name |
| Status | `active` / `paused` badge |
| Actions | ▶ Resume · ⏸ Pause · 🗑 Delete |

---

#### Users Screen (`admin/users/`)

![Admin – Users](docs/screenshots/admin-users.png)

Full user registry with inline status and plan badges.

| Column | Description |
|---|---|
| Email | User email address |
| Wallet | Truncated Solana address (`ABC12345…`) |
| Plan | `free` / `pro` / `enterprise` badge |
| Credits | Numeric balance |
| Status | `active` · `suspended` · `frozen` badge |
| Role | `user` / `admin` badge |

---

#### Billing Screen

![Admin – Billing](docs/screenshots/admin-billing.png)

Subscription plan management displayed as a 3-column card grid (Free / Pro / Enterprise), each showing price, feature list, and an edit action.

---

#### Fees Screen

![Admin – Fees](docs/screenshots/admin-fees.png)

Platform fee configuration: transaction fee percentage, referral fee, platform cut — editable inline.

---

#### Infrastructure Screens

![Admin – RPC / Oracles / Wallets](docs/screenshots/admin-infrastructure.png)

| Screen | Description |
|---|---|
| **RPC** | Add/remove Solana RPC endpoints with health indicators |
| **Oracles** | Oracle feed configuration (Pyth, Switchboard) |
| **Wallets** | Platform wallet management and treasury balances |

---

#### Dev / SDK & API Screen (`admin/dev/`)

![Admin – SDK & API](docs/screenshots/admin-sdk.png)

Developer portal for managing SDK configurations and API key access.

| Column | Description |
|---|---|
| SDK Name | Integration identifier |
| API Key | Masked key with copy action |
| Status | `active` / `revoked` badge |
| Permissions | Scopes granted to the key |

REST API endpoints exposed by the web app:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/ai` | AI agent chat (LangChain / Vercel AI SDK) |
| `GET` | `/api/balance` | On-chain wallet balance via Solana RPC |
| `GET` | `/api/market` | Token prices and market data (CoinGecko) |

---

#### Add-ons Marketplace

![Admin – Add-ons](docs/screenshots/admin-addons.png)

Marketplace for enabling optional platform extensions (e.g., extra AI providers, additional oracle feeds, white-label branding).

---

#### Audit Logs Screen

![Admin – Audit Logs](docs/screenshots/admin-logs.png)

Chronological log table of all privileged operations.

| Column | Description |
|---|---|
| Timestamp | UTC date/time of the action |
| Actor | Admin email who performed the action |
| Action | `create_agent`, `suspend_user`, `update_fee`, etc. |
| Resource | Affected entity ID |

---

#### Settings Screen

![Admin – Settings](docs/screenshots/admin-settings.png)

Global platform configuration: display name, contact email, maintenance mode toggle, feature flags.

---

### Generating Screenshots

1. **Web app** — `npm run dev` → navigate to each route → screenshot → save to `docs/screenshots/`
2. **Admin panel** — `cd admin-tauri && npm run tauri:dev` → navigate each screen → screenshot → save to `docs/screenshots/`
3. Commit the image files and the placeholder `![…](docs/screenshots/…)` links above will resolve automatically.

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- Environment variables for sensitive data
- No private keys in frontend code
- Secure API routes with authentication

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Foundation
- Metaplex
- Jupiter
- All the amazing DeFi protocols integrated
- The Web3 community

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/SMSDAO/Agentic/issues)
- Documentation: [Wiki](https://github.com/SMSDAO/Agentic/wiki)
- Community: [Discord](https://discord.gg/smsdao)

## 🗺️ Roadmap

- [ ] Additional DeFi protocol integrations
- [ ] More AI agent capabilities
- [ ] Enhanced mobile features
- [ ] Desktop app auto-updates
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard

---

Built with 💜 by SMSDAO for the Solana ecosystem.
