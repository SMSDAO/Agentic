# 🚀 Agentic - Solana AI Web3 Platform

A comprehensive full-stack Web3 platform featuring Neo Glow design, AI-powered agents, and complete blockchain integration for the Solana ecosystem.

![Agentic Banner](https://img.shields.io/badge/Solana-Web3-blueviolet?style=for-the-badge)
![Node](https://img.shields.io/badge/Node-24+-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)

## ✨ Features

### 🎨 Frontend - Modern Neo Glow UI
- **Next.js 14+ App Router** with TypeScript
- **Neo Glow Design System**: glowing borders, neon accents, glassmorphism
- **Tailwind CSS** with custom glow utilities
- Fully responsive (desktop, tablet, mobile)
- Dashboard for all blockchain operations

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
- Node 24+ compatible

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
/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/         # Dashboard pages
│   ├── tokens/            # Token operations
│   ├── nfts/              # NFT management
│   ├── defi/              # DeFi integrations
│   ├── market/            # Market data
│   ├── ai-agent/          # AI agent interface
│   └── api/               # API routes
├── components/            # Shared UI components
│   ├── ui/                # Neo Glow components
│   └── layout/            # Layout components
├── lib/                   # Shared utilities
│   ├── supabase/          # Supabase client & schemas
│   ├── solana/            # Solana integrations
│   ├── ai/                # LangChain & AI tools
│   └── market/            # Market data (CoinGecko, Pyth)
├── mobile/                # React Native/Expo app
├── desktop/               # Electron desktop app
├── supabase/              # Supabase migrations & config
├── public/                # Static assets
├── styles/                # Global styles & Neo Glow theme
└── ...config files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ (required)
- npm or yarn
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
Automated tests are not yet configured for this project, and there is no `test` script defined in `package.json`.

To add tests, choose a test runner (for example, Jest, Vitest, or Playwright), set up the tooling, and then add an appropriate `test` script to `package.json`.
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
