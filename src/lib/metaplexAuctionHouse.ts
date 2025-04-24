import { Connection, PublicKey } from "@solana/web3.js";
import { AuctionHouse, Metaplex, keypairIdentity, walletAdapterIdentity } from "@metaplex-foundation/js";
import { WalletAdapter } from "@solana/wallet-adapter-base";

// TODO: Replace with your real Auction House and Collection addresses
export const AUCTION_HOUSE_ADDRESS = new PublicKey("<YOUR_AUCTION_HOUSE_ADDRESS>");
export const COLLECTION_CREATOR = new PublicKey("<YOUR_COLLECTION_CREATOR>");
export const GOLD_MINT = new PublicKey("<YOUR_GOLD_SPL_TOKEN_MINT>");

export function getMetaplex(connection: Connection, wallet?: WalletAdapter) {
  const metaplex = Metaplex.make(connection);
  if (wallet) {
    metaplex.use(walletAdapterIdentity(wallet));
  }
  return metaplex;
}

export async function fetchMarketplaceListings(connection: Connection) {
  const metaplex = getMetaplex(connection);
  // Fetch all listings for the Auction House and filter by collection creator
  const listings = await metaplex
    .auctionHouse()
    .findListings({ auctionHouse: AUCTION_HOUSE_ADDRESS })
    .run();
  // Filter for our collection
  return listings.filter(
    (l) => l.asset.creators?.some((c) => c.address.equals(COLLECTION_CREATOR))
  );
}

export async function buyNft({
  connection,
  wallet,
  listing,
}: {
  connection: Connection;
  wallet: WalletAdapter;
  listing: any;
}) {
  const metaplex = getMetaplex(connection, wallet);
  const { asset, tradeStateAddress } = listing;
  // Buy with GOLD SPL token
  return await metaplex
    .auctionHouse()
    .buy({
      auctionHouse: AUCTION_HOUSE_ADDRESS,
      listing,
      buyer: wallet.publicKey!,
      printReceipt: true,
      // Specify payment with GOLD token
      tokenAccount: GOLD_MINT,
    })
    .run();
}

export async function listNft({
  connection,
  wallet,
  mint,
  price,
}: {
  connection: Connection;
  wallet: WalletAdapter;
  mint: PublicKey;
  price: number;
}) {
  const metaplex = getMetaplex(connection, wallet);
  return await metaplex
    .auctionHouse()
    .list({
      auctionHouse: AUCTION_HOUSE_ADDRESS,
      seller: wallet.publicKey!,
      mintAccount: mint,
      price,
      tokenAccount: GOLD_MINT,
      printReceipt: true,
    })
    .run();
}
