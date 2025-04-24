import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";

const GOLD_MINT = "<PASTE_GOLD_TOKEN_MINT_HERE>"; // TODO: Update with real GOLD SPL token mint

export function GoldBalance() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    (async () => {
      try {
        // Fetch GOLD token balance (SPL Token)
        const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(GOLD_MINT),
        });
        const amount = accounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
        setBalance(amount);
      } catch {
        setBalance(null);
      }
    })();
  }, [publicKey]);

  return (
    <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full font-bold text-xs shadow">
      GOLD: {balance !== null ? balance : "-"}
    </span>
  );
}
