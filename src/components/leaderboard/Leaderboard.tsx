import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getLeaderboard } from "../../lib/leaderboardClient";
import { useConnection } from "@solana/wallet-adapter-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<{wallet: string, wins: number}[]>([]);
  const { connection } = useConnection();

  useEffect(() => {
    getLeaderboard(connection).then(setLeaders);
  }, [connection]);

  return (
    <div className="bg-yellow-50 dark:bg-gray-900 rounded-xl p-4 shadow-xl max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-200 mb-4">Battle Leaderboard</h2>
      <ol className="list-decimal pl-6">
        {leaders.map((entry, i) => (
          <motion.li key={entry.wallet} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="mb-2">
            <span className="font-bold text-yellow-800 dark:text-yellow-200">{entry.wallet}</span> — <span className="text-yellow-600 dark:text-yellow-300">{entry.wins} wins</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
