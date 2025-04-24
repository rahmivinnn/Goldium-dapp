import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity, Nft } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const EGG_COLLECTION_ADDRESS = "<PASTE_YOUR_EGG_COLLECTION_MINT_HERE>"; // TODO: Update with real collection mint

export interface EggNFT {
  mint: string;
  name: string;
  image: string;
  rarity: string;
  lore: string;
  details: string;
  owners: string[];
  hp?: number;
  mana?: number;
  attack?: number;
}

export function useUserEggNFTs() {
  const { publicKey, wallet, connected } = useWallet();
  const [nfts, setNfts] = useState<EggNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !wallet || !connected) {
      setNfts([]);
      return;
    }
    setLoading(true);
    setError(null);
    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

    (async () => {
      try {
        // Fetch all NFTs owned by the wallet
        const allNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        // Filter for Golden Egg NFTs by collection
        const eggNfts = allNfts.filter(nft => nft.collection?.address.toBase58() === EGG_COLLECTION_ADDRESS);
        // Fetch metadata for each NFT
        const detailedNfts: EggNFT[] = await Promise.all(
          eggNfts.map(async (nft) => {
            const onchain = await metaplex.nfts().findByMint({ mintAddress: nft.mint });
            return {
              mint: nft.mint.toBase58(),
              name: onchain.name,
              image: onchain.json?.image || "",
              rarity: onchain.json?.attributes?.find((a: any) => a.trait_type === "Rarity")?.value || "Common",
              lore: onchain.json?.attributes?.find((a: any) => a.trait_type === "Lore")?.value || "A mysterious golden egg.",
              details: onchain.json?.description || "",
              owners: [publicKey.toBase58()], // Ownership history requires deeper parsing
            };
          })
        );
        setNfts(detailedNfts);
      } catch (e: any) {
        setError(e.message || "Failed to fetch NFTs");
        setNfts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [publicKey, wallet, connected]);

  return { nfts, loading, error };
}
