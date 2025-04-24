import { useState } from "react";
import { useUserEggNFTs, EggNFT } from "@/hooks/useUserEggNFTs";
import { motion } from "framer-motion";

interface DeckBuilderProps {
  onSelectDeck: (deck: EggNFT[]) => void;
  deckSize?: number;
}

const DeckBuilder = ({ onSelectDeck, deckSize = 3 }: DeckBuilderProps) => {
  const { nfts, loading, error } = useUserEggNFTs();
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (mint: string) => {
    if (selected.includes(mint)) {
      setSelected(selected.filter((m) => m !== mint));
    } else if (selected.length < deckSize) {
      setSelected([...selected, mint]);
    }
  };

  const deck = nfts.filter((nft) => selected.includes(nft.mint));

  return (
    <div className="bg-yellow-50 dark:bg-gray-900 rounded-xl p-4 shadow-xl flex flex-col gap-4 max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-200 mb-2 text-center">Build Your Deck</h2>
      {loading && <div className="text-center">Loading NFTs...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <motion.div
              key={nft.mint}
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl shadow-lg p-2 flex flex-col items-center cursor-pointer border-2 transition-all duration-150 ${
                selected.includes(nft.mint)
                  ? "border-yellow-500 ring-2 ring-yellow-300"
                  : "border-transparent"
              } ${selected.length >= deckSize && !selected.includes(nft.mint) ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handleSelect(nft.mint)}
            >
              <img src={nft.image} alt={nft.name} className="w-20 h-20 object-contain mb-1" />
              <div className="font-bold text-yellow-700 dark:text-yellow-300 text-sm text-center">{nft.name}</div>
              <div className="text-xs text-gray-500 mb-1">{nft.rarity}</div>
              <div className="text-xs text-gray-400">{nft.lore.slice(0, 32)}...</div>
            </motion.div>
          ))}
        </div>
      )}
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded shadow disabled:opacity-50 mx-auto mt-4"
        disabled={deck.length !== deckSize}
        onClick={() => onSelectDeck(deck)}
      >
        Start Battle
      </button>
    </div>
  );
};

export default DeckBuilder;
