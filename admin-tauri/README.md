# Agentic Admin Panel - Tauri Desktop App

This is the local Windows Tauri desktop application for administering the Agentic platform.

## Features

- **Agent Management**: Create, edit, delete, pause, resume AI agents
- **User Management**: View users, adjust credits, plans, and account status
- **Billing**: Manage subscription plans, invoices, and payments (Stripe + Crypto)
- **Fees**: Configure global and per-agent/per-user fees
- **Wallet Connectors**: Manage supported wallet integrations
- **Price Oracles**: Configure PYTH, Coinbase, and Chainlink price feeds
- **RPC Endpoints**: Manage blockchain RPC endpoints
- **Add-ons**: Install and configure platform add-ons
- **SDK & API**: Manage API keys and SDK configurations
- **Audit Logs**: View platform activity and audit trail
- **Settings**: Configure global platform settings

## Prerequisites

- Node.js >= 24.0.0
- Rust (for Tauri)
- Supabase account with service role key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (required for admin operations)

3. Run database migrations:
```bash
# Navigate to the root project directory
cd ..
npx supabase migration up
```

## Development

Run the development server:
```bash
npm run tauri:dev
```

This will start the Vite dev server and launch the Tauri app.

## Building

Build the production app:
```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/`.

## Architecture

### Backend (Rust)
- Located in `src-tauri/`
- Uses Tauri framework for native desktop integration
- Minimal Rust code - most logic is in TypeScript

### Frontend (React + TypeScript)
- Located in `src/`
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation

### Commands
- Located in `src/main/commands/`
- TypeScript modules that interact with Supabase
- Exported functions for all admin operations

### Screens
- Located in `src/ui/screens/`
- React components for each admin section
- Use commands to fetch and mutate data

## Security

**IMPORTANT**: This app uses the Supabase service role key, which has full admin access to your database. 

- Never expose this app publicly
- Never commit `.env` files with real credentials
- Only run this app on trusted, secure machines
- Consider implementing additional authentication for the desktop app

## Database Connection

The app connects directly to your cloud-hosted Supabase instance. No local Supabase installation is required.

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Ensure Rust is installed: `rustc --version`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Clear Tauri cache: `rm -rf src-tauri/target`

### Connection Errors

If the app can't connect to Supabase:
1. Verify your environment variables in `.env`
2. Check that your Supabase project is running
3. Verify network connectivity

## License

MIT
