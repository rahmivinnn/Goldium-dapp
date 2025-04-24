import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useUserEggNFTs, EggNFT } from "../../hooks/useUserEggNFTs";
import { motion } from "framer-motion";
import { GoldBalance } from "./GoldBalance";
import { fetchMarketplaceListings, buyNft } from "../../lib/metaplexAuctionHouse";

export default function Marketplace() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const { nfts } = useUserEggNFTs();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real marketplace listings
  useEffect(() => {
    setLoading(true);
    fetchMarketplaceListings(connection)
      .then(setListings)
      .finally(() => setLoading(false));
  }, [connection]);

  async function handleBuy(listing: any) {
    if (!wallet || !publicKey) return alert("Connect wallet");
    setLoading(true);
    try {
      await buyNft({ connection, wallet, listing });
      alert("Purchase successful!");
    } catch (e) {
      alert("Purchase failed: " + (e as Error).message);
    }
    setLoading(false);
  }

  return (
    <div className="bg-yellow-50 dark:bg-gray-900 rounded-xl p-4 shadow-xl max-w-3xl mx-auto my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-200">NFT Marketplace</h2>
        <GoldBalance />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="col-span-full text-center">No listings found.</div>
        ) : (
          listings.map((item: any) => (
            <motion.div
              key={item.asset.address.toBase58()}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl shadow-lg p-2 flex flex-col items-center border-2 border-yellow-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <img
                src={
                  item.asset.json?.image?.startsWith('http') ? item.asset.json.image :
                  "/nfts/placeholder.png"
                }
                alt={item.asset.json?.name || "Golden Egg NFT"}
                className="w-20 h-20 object-contain mb-1 bg-white rounded-lg border border-yellow-200"
                onError={(e) => { e.currentTarget.src = "/nfts/placeholder.png"; }}
              />
              <div className="font-bold text-yellow-700 dark:text-yellow-300 text-sm text-center">{item.asset.json?.name || "Golden Egg"}</div>
              <div className="text-xs text-gray-500 mb-1">{item.asset.json?.attributes?.find((a: any) => a.trait_type === "rarity")?.value || "-"}</div>
              <div className="text-xs text-gray-400 mb-1">Price: <span className="font-bold text-yellow-700">{item.price} GOLD</span></div>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-4 rounded shadow mt-2 text-xs" onClick={() => handleBuy(item)} disabled={loading}>
                Buy
              </button>
            </motion.div>
          ))
        )}
      </div>
      <div className="mt-8 border-t pt-4">
        <h3 className="font-bold text-yellow-700 dark:text-yellow-200 mb-2">Your NFTs (List for Sale)</h3>
        <div className="flex gap-3 flex-wrap">
          {nfts.map((nft: EggNFT) => (
            <motion.div
              key={nft.mint}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl shadow p-2 flex flex-col items-center border border-yellow-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <img src={nft.image} alt={nft.name} className="w-12 h-12 mb-1" />
              <div className="text-xs text-yellow-700 dark:text-yellow-300">{nft.name}</div>
              <button className="mt-1 bg-yellow-300 hover:bg-yellow-400 text-xs px-2 py-1 rounded" disabled>
                List (Demo)
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
