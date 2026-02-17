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
      } catch (error) {
        console.error('Failed to decode private key:', error);
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
        lamports: amount * LAMPORTS_PER_SOL,
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

  async mintTokens(
    payer: Keypair,
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
      payer,
      amount
    );

    return signature;
  }

  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<number> {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        new PublicKey(ownerAddress),
        { mint: new PublicKey(tokenAddress) }
      );

      if (tokenAccounts.value.length === 0) return 0;

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Keypair | undefined {
    return this.wallet;
  }
}

export const solanaClient = new SolanaClient();
