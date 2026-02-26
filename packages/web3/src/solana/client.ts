import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import bs58 from 'bs58';

export class SolanaClient {
  private connection: Connection;
  private wallet?: Keypair;

  constructor(rpcUrl?: string, privateKey?: string) {
    this.connection = new Connection(
      rpcUrl || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    if (privateKey) {
      try {
        this.wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
      } catch {
        // Invalid private key - wallet will be unavailable; caller must handle this
        throw new Error('Failed to decode private key: ensure SOLANA_PRIVATE_KEY is a valid base58-encoded secret key');
      }
    }
  }

  async getBalance(address: string): Promise<number> {
    const publicKey = new PublicKey(address);
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  async transferSOL(
    fromKeypair: Keypair,
    toAddress: string,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: Math.round(amount * LAMPORTS_PER_SOL),
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [fromKeypair]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async createToken(
    payer: Keypair,
    mintAuthority: PublicKey,
    decimals: number = 9
  ): Promise<PublicKey> {
    const mint = await createMint(
      this.connection,
      payer,
      mintAuthority,
      mintAuthority,
      decimals
    );
    return mint;
  }

  /**
   * Mint tokens to a destination account.
   * @param payer - Keypair to pay transaction fees
   * @param mintAuthority - Keypair that has authority to mint tokens (may differ from payer)
   * @param mint - The mint address
   * @param destination - The destination wallet public key
   * @param amount - Amount to mint (in smallest unit)
   */
  async mintTokens(
    payer: Keypair,
    mintAuthority: Keypair,
    mint: PublicKey,
    destination: PublicKey,
    amount: number
  ): Promise<string> {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      destination
    );

    const signature = await mintTo(
      this.connection,
      payer,
      mint,
      tokenAccount.address,
      mintAuthority,
      amount
    );

    return signature;
  }

  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<number> {
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      new PublicKey(ownerAddress),
      { mint: new PublicKey(tokenAddress) }
    );

    if (tokenAccounts.value.length === 0) return 0;

    // Sum across all accounts — a wallet can have multiple token accounts for the same mint
    let total = 0;
    for (const account of tokenAccounts.value) {
      const uiAmount = account.account.data.parsed?.info?.tokenAmount?.uiAmount;
      if (uiAmount == null) {
        throw new Error('Unable to parse token balance from account data');
      }
      total += uiAmount;
    }
    return total;
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Keypair | undefined {
    return this.wallet;
  }
}

// Export factory function instead of singleton
export function createSolanaClient(rpcUrl?: string, privateKey?: string) {
  return new SolanaClient(rpcUrl, privateKey);
}
