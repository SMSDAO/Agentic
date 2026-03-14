# Blockchain Integration Guide

## Solana Configuration

Network configuration lives in `config/chains.ts`. Import `getChainConfig()` with the runtime network name:

```typescript
import { getChainConfig } from '@/config/chains';

const config = getChainConfig(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
// config.rpcUrl, config.commitment, config.explorerBaseUrl, etc.
```

## Solana Client

`src/lib/solana/client.ts` provides the `SolanaClient` class:

```typescript
import { createSolanaClient } from '@/lib/solana/client';

const client = createSolanaClient();
const balance = await client.getBalance('WalletAddress...');
```

### Constructor Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rpcUrl` | `NEXT_PUBLIC_SOLANA_RPC_URL` or mainnet | RPC endpoint |
| `privateKey` | `SOLANA_PRIVATE_KEY` | bs58-encoded keypair (server-side only) |

## SPL Tokens

Use `src/lib/solana/client.ts` for token operations:

- `createToken(payer, mintAuthority, decimals)` — mint a new SPL token
- `getTokenBalance(tokenAddress, ownerAddress)` — fetch token balance

## NFTs (Metaplex)

`src/lib/solana/nft.ts` wraps Metaplex JS:

- Create and mint NFTs with on-chain metadata
- Upload images to Arweave/IPFS via `@metaplex-foundation/js`

## DeFi

`src/lib/solana/defi.ts` provides Jupiter/Raydium integration helpers.

## Program Addresses

Well-known program addresses are exported from `config/chains.ts`:

```typescript
import { PROGRAMS } from '@/config/chains';
// PROGRAMS.TOKEN_METADATA, PROGRAMS.TOKEN_PROGRAM, etc.
```

## Anchor Framework

Use `@coral-xyz/anchor` for program interactions:

```typescript
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { toAnchorCluster } from '@/config/chains';

const cluster = toAnchorCluster('devnet');
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `mainnet-beta` \| `devnet` \| `testnet` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom RPC endpoint (optional) |
| `SOLANA_PRIVATE_KEY` | bs58-encoded private key (server-side only) |
