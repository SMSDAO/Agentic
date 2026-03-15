# Screenshots

This directory holds UI screenshots referenced in the root [README.md](../../README.md).

## Expected files

| File | Route / Screen |
|---|---|
| `dashboard-overview.png` | Web — `/dashboard` |
| `tokens-overview.png` | Web — `/tokens` |
| `nfts-overview.png` | Web — `/nfts` |
| `defi-overview.png` | Web — `/defi` |
| `market-overview.png` | Web — `/market` |
| `ai-agent-overview.png` | Web — `/ai-agent` |
| `admin-agents.png` | Admin panel — Agents screen |
| `admin-users.png` | Admin panel — Users screen |
| `admin-billing.png` | Admin panel — Billing screen |
| `admin-fees.png` | Admin panel — Fees screen |
| `admin-infrastructure.png` | Admin panel — RPC / Oracles / Wallets |
| `admin-sdk.png` | Admin panel — SDK & API screen |
| `admin-addons.png` | Admin panel — Add-ons marketplace |
| `admin-logs.png` | Admin panel — Audit Logs screen |
| `admin-settings.png` | Admin panel — Settings screen |

## How to generate screenshots

### Web app (`src/app/`)

```bash
npm run dev          # starts at http://localhost:3000
```

Navigate to each route, take a full-page screenshot, and save it here with the filename from the table above.

### Admin panel (`admin-tauri/`)

```bash
cd admin-tauri
cp .env.example .env  # fill in SUPABASE_SERVICE_ROLE_KEY
npm install
npm run tauri:dev
```

Navigate to each screen in the Tauri window, take a screenshot, and save it here.

## Recommended tools

- **macOS**: `Cmd + Shift + 4` (area) or `Cmd + Shift + 5` (full window)
- **Linux/GNOME**: `gnome-screenshot -w` or `flameshot gui`
- **Windows**: `Win + Shift + S` (Snipping Tool) or ShareX
- **Browser**: [GoFullPage](https://gofullpage.com/) extension for full-page captures

After adding images, commit them:

```bash
git add docs/screenshots/
git commit -m "docs: add UI screenshots"
```
