import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { FC, useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
}

const Games: FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);

  const games: Game[] = [
    {
      id: '1',
      name: 'Golden Clicker',
      description: 'Click as fast as you can to earn GOLD tokens! Simple but addictive.',
      icon: '👆',
      reward: 10,
      difficulty: 'Easy',
      isActive: true
    },
    {
      id: '2',
      name: 'Crypto Miner',
      description: 'Mine digital gold by solving puzzles and completing challenges.',
      icon: '⛏️',
      reward: 25,
      difficulty: 'Medium',
      isActive: true
    },
    {
      id: '3',
      name: 'DeFi Runner',
      description: 'Run through the blockchain world, avoiding obstacles and collecting rewards.',
      icon: '🏃',
      reward: 50,
      difficulty: 'Hard',
      isActive: true
    },
    {
      id: '4',
      name: 'Token Trader',
      description: 'Test your trading skills in this simulation game.',
      icon: '📈',
      reward: 75,
      difficulty: 'Hard',
      isActive: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const startGame = useCallback((game: Game) => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    setSelectedGame(game);
    setIsPlaying(true);
    setGameScore(0);
    setTimeLeft(30);
    setIsGameActive(true);
  }, [publicKey]);

  const handleClick = useCallback(() => {
    if (isGameActive && selectedGame) {
      setGameScore(prev => prev + 1);
    }
  }, [isGameActive, selectedGame]);

  const endGame = useCallback(async () => {
    if (!selectedGame || !publicKey) return;

    setIsGameActive(false);
    const finalReward = Math.floor(gameScore / 10) * selectedGame.reward;
    
    try {
      // Simulate reward distribution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notify({ 
        type: 'success', 
        message: `Game completed! You earned ${finalReward} GOLD tokens!` 
      });

      // Update balances
      await getAllTokenBalances(publicKey, connection);

    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Failed to claim rewards!`, 
        description: error?.message 
      });
    }

    setIsPlaying(false);
    setSelectedGame(null);
  }, [selectedGame, publicKey, gameScore, getAllTokenBalances, connection]);

  // Timer effect
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  return (
    <Layout>
      <Head>
        <title>Games - Goldium.io</title>
        <meta name="description" content="Play-to-earn games and earn GOLD tokens on Goldium.io" />
      </Head>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Play-to-Earn Games
            </h1>
            <p className="text-xl text-white mb-6">
              Have fun and earn GOLD tokens by playing our interactive games
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="bg-black/80 text-white px-3 py-1 rounded-full border border-yellow-500/30">
                Balance: {balances.GOLD.toFixed(2)} GOLD
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {games.map((game) => (
              <div key={game.id} className="bg-black/80 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 text-center">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>{game.difficulty}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{game.name}</h3>
                  <p className="text-white text-sm mb-4">{game.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-300">
                      Reward: <span className="font-semibold text-yellow-400">{game.reward} GOLD</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startGame(game)}
                    disabled={!game.isActive || !publicKey}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${game.isActive && publicKey ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : 'bg-gray-900/60 text-gray-500 cursor-not-allowed'}`}
                  >
                    {!game.isActive ? 'Coming Soon' : 'Play Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-black/80 rounded-xl shadow-lg p-6 mb-12 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Leaderboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🥇</div>
                <div className="font-semibold text-white">Gold Master</div>
                <div className="text-sm text-gray-300">1,250 GOLD earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🥈</div>
                <div className="font-semibold text-white">Silver Player</div>
                <div className="text-sm text-gray-300">890 GOLD earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🥉</div>
                <div className="font-semibold text-white">Bronze Gamer</div>
                <div className="text-sm text-gray-300">567 GOLD earned</div>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Play & Earn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="font-semibold text-gray-900 mb-2">Play Games</h3>
                <p className="text-gray-600 text-sm">
                  Choose from our selection of fun and engaging games
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-semibold text-gray-900 mb-2">Score Points</h3>
                <p className="text-gray-600 text-sm">
                  Achieve high scores and complete challenges
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">
                  Get GOLD tokens based on your performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      {isPlaying && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{selectedGame.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedGame.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {selectedGame.description}
              </p>
            </div>

            {/* Game Stats */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Time Left:</span>
                <span className="font-semibold text-lg">{timeLeft}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className="font-semibold text-lg">{gameScore}</span>
              </div>
            </div>

            {/* Game Area */}
            <div className="text-center mb-6">
              <button
                onClick={handleClick}
                disabled={!isGameActive}
                className={`w-32 h-32 rounded-full text-4xl font-bold transition-all duration-200 ${
                  isGameActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                👆
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Click as fast as you can!
              </p>
            </div>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedGame(null);
                setIsGameActive(false);
              }}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Games; 