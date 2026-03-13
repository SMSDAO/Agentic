import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

export class NFTManager {
  private metaplex: Metaplex;

  constructor(connection: Connection, wallet: Keypair) {
    this.metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet));
  }

  async createCollection(
    name: string,
    symbol: string,
    uri: string,
    sellerFeeBasisPoints: number = 500
  ) {
    const { nft: collectionNft } = await this.metaplex.nfts().create({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints,
      isCollection: true,
    });

    return collectionNft;
  }

  async mintNFT(
    collectionMint: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    sellerFeeBasisPoints: number = 500
  ) {
    const { nft } = await this.metaplex.nfts().create({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints,
      collection: collectionMint,
    });

    return nft;
  }

  async getNFTsByOwner(ownerAddress: PublicKey) {
    const nfts = await this.metaplex.nfts().findAllByOwner({
      owner: ownerAddress,
    });

    return nfts;
  }

  async updateNFTMetadata(
    mintAddress: PublicKey,
    name?: string,
    symbol?: string,
    uri?: string
  ) {
    const nft = await this.metaplex.nfts().findByMint({ mintAddress });

    const { response } = await this.metaplex.nfts().update({
      nftOrSft: nft,
      name: name || nft.name,
      symbol: symbol || nft.symbol,
      uri: uri || nft.uri,
    });

    return response;
  }
}
