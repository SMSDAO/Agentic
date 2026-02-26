import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Server-side NFT ownership validation for access gating.
 * Checks whether a wallet holds at least one token with the given mint address.
 * Must only be called from server-side code (API routes, Server Actions).
 *
 * @param walletAddress - The wallet public key to check
 * @param nftMint - The specific NFT mint address to check ownership of
 */
export async function validateNFTOwnership(
  walletAddress: string,
  nftMint: string,
  rpcUrl?: string
): Promise<boolean> {
  try {
    const connection = new Connection(
      rpcUrl ?? process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    const owner = new PublicKey(walletAddress);
    // Filter by mint directly in the RPC call to avoid fetching all token accounts
    const mintKey = new PublicKey(nftMint);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
      mint: mintKey,
    });

    return tokenAccounts.value.some((account) => {
      const uiAmount = account.account.data.parsed?.info?.tokenAmount?.uiAmount;
      return Number(uiAmount) > 0;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('NFT ownership validation error:', error);
    return false;
  }
}
