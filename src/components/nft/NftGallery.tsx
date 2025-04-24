import { useState } from "react";
import { motion } from "framer-motion";
import LoreModal from "./LoreModal";
import { useUserEggNFTs } from "@/hooks/useUserEggNFTs";

const NftGallery = () => {
  const { nfts, loading, error } = useUserEggNFTs();
  const [selected, setSelected] = useState<number | null>(null);

  if (loading) return <div className="p-8 text-center">Loading your Golden Eggs...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!nfts.length) return <div className="p-8 text-center text-gray-400">No Golden Egg NFTs found in your wallet.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {nfts.map((nft: any, i: number) => (
        <motion.div
          key={nft.mint || i}
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-100 dark:bg-gray-900 rounded-xl shadow-lg p-3 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-yellow-400"
          onClick={() => setSelected(i)}
        >
          <img
            src={
              nft.image?.startsWith('http') ? nft.image :
              nft.json?.image?.startsWith('http') ? nft.json.image :
              "/nfts/placeholder.png"
            }
            alt={nft.name || nft.json?.name || "Golden Egg NFT"}
            className="w-24 h-24 object-contain mb-2 bg-white rounded-lg border border-yellow-200"
            onError={e => { e.currentTarget.src = "/nfts/placeholder.png"; }}
          />
          <div className="font-bold text-yellow-700 dark:text-yellow-300">{nft.name || nft.json?.name || "Golden Egg"}</div>
          <div className="text-xs text-gray-500">{nft.rarity || nft.json?.attributes?.find((a:any) => a.trait_type === "rarity")?.value || "-"}</div>
        </motion.div>
      ))}
      {selected !== null && (
        <LoreModal nft={nfts[selected]} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default NftGallery;
