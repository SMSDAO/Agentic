import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Server-side NFT ownership validation for access gating.
 * Must only be called from server-side code (API routes, Server Actions).
 */
export async function validateNFTOwnership(
  walletAddress: string,
  collectionMint: string,
  rpcUrl?: string
): Promise<boolean> {
  try {
    const connection = new Connection(
      rpcUrl ?? process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    const owner = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    const collectionKey = new PublicKey(collectionMint);

    return tokenAccounts.value.some((account) => {
      const info = account.account.data.parsed?.info;
      return (
        info?.mint === collectionKey.toString() &&
        Number(info?.tokenAmount?.uiAmount) > 0
      );
    });
  } catch {
    return false;
  }
}
