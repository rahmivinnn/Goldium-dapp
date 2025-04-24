import { useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

const PhantomConnect = () => {
  const { publicKey, connected } = useWallet();
  const walletAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : null),
    [publicKey]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <WalletMultiButton className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-200" />
      {connected && walletAddress && (
        <span className="text-xs text-gray-500 mt-1">Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
      )}
    </motion.div>
  );
};

export default PhantomConnect;
