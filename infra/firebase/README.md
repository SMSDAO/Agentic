# Firebase Infrastructure

## Firestore Rules
The `firestore.rules` file contains hardened security rules for Firestore:
- Users can only read/write their own documents
- Wallet sessions and NFT gating records are server-side only (Admin SDK)
- Agent logs are read-only for users

## Admin SDK Usage
The Firebase Admin SDK must NEVER be included in client bundles.
Only import from server-side code (API routes, Server Actions).

## NFT Gating
NFT ownership validation is performed server-side via the `@agentic/web3` package.
