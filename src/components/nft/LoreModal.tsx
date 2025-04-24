import { motion, AnimatePresence } from "framer-motion";

interface LoreModalProps {
  nft: {
    name: string;
    image: string;
    rarity: string;
    lore: string;
    details: string;
    owners: string[];
  };
  onClose: () => void;
}

const LoreModal = ({ nft, onClose }: LoreModalProps) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl relative max-w-xs w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={nft.image} alt={nft.name} className="w-28 h-28 mx-auto mb-3" />
        <div className="font-bold text-lg text-yellow-700 dark:text-yellow-300 text-center">{nft.name}</div>
        <div className="text-xs text-center text-gray-500 mb-2">{nft.rarity}</div>
        <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{nft.lore}</div>
        <div className="text-xs text-gray-500 mb-2">{nft.details}</div>
        <div className="text-xs text-gray-400 mb-2">Owners: {nft.owners.join(", ")}</div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default LoreModal;
