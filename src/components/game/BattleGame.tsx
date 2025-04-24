import React, { useReducer, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EggNFT } from "@/hooks/useUserEggNFTs";
import { useEggSounds } from "@/components/sound/useEggSounds";
import { recordWin } from "@/lib/leaderboardClient";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

interface BattleGameProps {
  playerDeck: EggNFT[];
}

const defaultStats = {
  hp: 20,
  mana: 7,
  attack: 5,
};

function parseStats(nft: EggNFT) {
  // Try to parse stats from details string or attributes
  let hp = defaultStats.hp, mana = defaultStats.mana, attack = defaultStats.attack;
  // Try to extract from details (e.g., "HP: 80, Mana: 60, Power: 25")
  if (nft.details) {
    const m = nft.details.match(/HP:\s*(\d+).*Mana:\s*(\d+).*Power:\s*(\d+)/i);
    if (m) {
      hp = parseInt(m[1], 10);
      mana = parseInt(m[2], 10);
      attack = parseInt(m[3], 10);
    }
  }
  return { ...nft, hp, mana, attack };
}

function getOpponentDeck(deckSize: number): EggNFT[] {
  // Dummy eggs for opponent
  return Array(deckSize).fill(0).map((_, i) => ({
    mint: `opponent-egg-${i}`,
    name: `Enemy Egg #${i + 1}`,
    image: `/nfts/golden-egg-${(i % 3) + 1}.png`,
    rarity: "Common",
    lore: "A mischievous foe!",
    details: `HP: ${18 + i * 2}, Mana: ${6 + i}, Power: ${4 + i}`,
    owners: ["Enemy"],
    hp: 18 + i * 2,
    mana: 6 + i,
    attack: 4 + i,
  }));
}

const initialState = (playerDeck: EggNFT[], opponentDeck: EggNFT[]) => ({
  player: {
    hp: playerDeck.reduce((acc, c) => acc + (c.hp || defaultStats.hp), 0),
    mana: 15,
    hand: playerDeck.map(parseStats),
    field: [],
  },
  opponent: {
    hp: opponentDeck.reduce((acc, c) => acc + (c.hp || defaultStats.hp), 0),
    mana: 15,
    hand: opponentDeck,
    field: [],
  },
  turn: "player" as "player" | "opponent",
  battleLog: ["Battle started!"],
  winner: null as null | "player" | "opponent",
});

type State = ReturnType<typeof initialState>;
type Action =
  | { type: "PLAY_CARD"; cardId: string }
  | { type: "ATTACK"; attackerId: string; target: "opponent" | "player" }
  | { type: "END_TURN" }
  | { type: "OPPONENT_PLAY" }
  | { type: "LOG"; message: string }
  | { type: "WINNER"; winner: "player" | "opponent" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAY_CARD": {
      // Move card from hand to field
      const card = state.player.hand.find((c) => c.mint === action.cardId);
      if (!card || state.turn !== "player") return state;
      return {
        ...state,
        player: {
          ...state.player,
          hand: state.player.hand.filter((c) => c.mint !== action.cardId),
          field: [...state.player.field, card],
          mana: state.player.mana - card.mana,
        },
        battleLog: [
          `You played ${card.name}!`,
          ...state.battleLog,
        ],
      };
    }
    case "ATTACK": {
      // Player attacks opponent directly (for now)
      if (state.turn !== "player") return state;
      const attacker = state.player.field.find((c) => c.mint === action.attackerId);
      if (!attacker) return state;
      const newOpponentHp = state.opponent.hp - attacker.attack;
      const winner = newOpponentHp <= 0 ? "player" : null;
      return {
        ...state,
        opponent: {
          ...state.opponent,
          hp: Math.max(0, newOpponentHp),
        },
        battleLog: [
          `Your ${attacker.name} attacked! -${attacker.attack} HP to opponent`,
          ...state.battleLog,
        ],
        winner,
      };
    }
    case "END_TURN": {
      return {
        ...state,
        turn: state.turn === "player" ? "opponent" : "player",
        battleLog: [
          `${state.turn === "player" ? "You" : "Opponent"} ended their turn!`,
          ...state.battleLog,
        ],
      };
    }
    case "OPPONENT_PLAY": {
      // Opponent plays the first card in hand, attacks player
      const card = state.opponent.hand[0];
      if (!card || state.turn !== "opponent") return state;
      const newPlayerHp = state.player.hp - card.attack;
      const winner = newPlayerHp <= 0 ? "opponent" : null;
      return {
        ...state,
        opponent: {
          ...state.opponent,
          hand: state.opponent.hand.slice(1),
          field: [...state.opponent.field, card],
          mana: state.opponent.mana - card.mana,
        },
        player: {
          ...state.player,
          hp: Math.max(0, newPlayerHp),
        },
        battleLog: [
          `Opponent played ${card.name} and attacked! -${card.attack} HP to you`,
          ...state.battleLog,
        ],
        winner,
      };
    }
    case "LOG": {
      return {
        ...state,
        battleLog: [action.message, ...state.battleLog],
      };
    }
    case "WINNER": {
      return {
        ...state,
        winner: action.winner,
        battleLog: [
          `${action.winner === "player" ? "You" : "Opponent"} win the battle!`,
          ...state.battleLog,
        ],
      };
    }
    default:
      return state;
  }
}

const BattleGame: React.FC<BattleGameProps> = ({ playerDeck }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState(
      playerDeck.map(parseStats),
      getOpponentDeck(playerDeck.length)
    )
  );
  const { player, opponent, turn, battleLog, winner } = state;
  const { play: playSound } = useEggSounds();
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  // Play SFX on key actions
  useEffect(() => {
    if (battleLog[0]?.includes("played")) playSound("play");
    if (battleLog[0]?.includes("attacked")) playSound("attack");
    if (winner === "player") playSound("win");
    if (winner === "opponent") playSound("lose");
  }, [battleLog, winner]);

  // Record win in leaderboard (dummy or real)
  useEffect(() => {
    if (winner === "player") {
      recordWin(connection, wallet);
    }
  }, [winner]);

  // Opponent plays automatically after player ends turn
  useEffect(() => {
    if (turn === "opponent" && opponent.hand.length && !winner) {
      setTimeout(() => {
        dispatch({ type: "OPPONENT_PLAY" });
        setTimeout(() => dispatch({ type: "END_TURN" }), 1000);
      }, 1000);
    }
  }, [turn, opponent.hand.length, winner]);

  // Win/loss detection
  useEffect(() => {
    if (player.hp <= 0 && !winner) dispatch({ type: "WINNER", winner: "opponent" });
    if (opponent.hp <= 0 && !winner) dispatch({ type: "WINNER", winner: "player" });
  }, [player.hp, opponent.hp, winner]);

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-4 bg-yellow-50 dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg text-yellow-700 dark:text-yellow-200">Opponent</span>
          <span className="text-xs">HP: {opponent.hp} | Mana: {opponent.mana}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg text-yellow-700 dark:text-yellow-200">You</span>
          <span className="text-xs">HP: {player.hp} | Mana: {player.mana}</span>
        </div>
      </div>
      {/* Opponent Field */}
      <div className="flex justify-center gap-4 min-h-[100px]">
        {opponent.field.map((card, idx) => (
          <motion.img
            key={card.mint}
            src={card.image}
            alt={card.name}
            className="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-lg bg-white"
            initial={{ scale: 0.8, y: -20 }}
            animate={{ scale: 1, y: 0 }}
          />
        ))}
      </div>
      {/* Player Field */}
      <div className="flex justify-center gap-4 min-h-[100px]">
        {player.field.map((card, idx) => (
          <motion.div
            key={card.mint}
            className="flex flex-col items-center"
          >
            <motion.img
              src={card.image}
              alt={card.name}
              className="w-20 h-20 rounded-full border-2 border-yellow-500 shadow-xl bg-white"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            />
            <button
              className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow"
              disabled={turn !== "player" || winner}
              onClick={() => {
                playSound("click");
                dispatch({ type: "ATTACK", attackerId: card.mint, target: "opponent" });
              }}
            >
              Attack
            </button>
          </motion.div>
        ))}
      </div>
      {/* Hand */}
      <div className="flex gap-3 justify-center mt-4">
        {player.hand.map((card) => (
          <motion.div
            key={card.mint}
            whileHover={{ scale: 1.08 }}
            drag={turn === "player" && player.mana >= card.mana && !winner}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDoubleClick={() =>
              turn === "player" && player.mana >= card.mana && !winner
                ? dispatch({ type: "PLAY_CARD", cardId: card.mint })
                : null
            }
            className={`bg-yellow-100 dark:bg-gray-800 rounded-xl shadow-md p-2 flex flex-col items-center w-28 cursor-pointer border-2 ${
              turn === "player" && player.mana >= card.mana && !winner
                ? "border-yellow-400"
                : "border-gray-300 opacity-50 cursor-not-allowed"
            }`}
          >
            <img src={card.image} alt={card.name} className="w-16 h-16 mb-2" />
            <div className="font-bold text-center text-yellow-800 dark:text-yellow-200 text-sm">
              {card.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 text-center">{card.lore}</div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>HP: {card.hp}</span>
              <span>Mana: {card.mana}</span>
              <span>ATK: {card.attack}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Controls */}
      <div className="flex justify-center gap-4 mt-2">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded shadow disabled:opacity-50"
          onClick={() => dispatch({ type: "END_TURN" })}
          disabled={turn !== "player" || winner}
        >
          End Turn
        </button>
      </div>
      {/* Battle Log */}
      <div className="bg-white dark:bg-gray-800 rounded p-2 mt-2 min-h-[60px] max-h-32 overflow-y-auto text-xs shadow-inner">
        {battleLog.slice(0, 6).map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      {/* Winner Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="text-3xl mb-2">
                {winner === "player" ? "🥚 You Win!" : "😵 You Lose!"}
              </div>
              <button
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded shadow"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleGame;
