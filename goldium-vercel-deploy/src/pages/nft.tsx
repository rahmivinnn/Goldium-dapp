import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { FC, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: 'SOL' | 'GOLD';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  attributes: {
    power: number;
    luck: number;
    rarity: string;
  };
}

const NFTMarketplace: FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nfts: NFT[] = [
    {
      id: '1',
      name: 'Golden Egg #001',
      description: 'A rare golden egg with mystical properties. Hatch it to reveal powerful rewards.',
      image: '🥚',
      price: 0.1,
      currency: 'SOL',
      rarity: 'Rare',
      attributes: { power: 75, luck: 80, rarity: 'Rare' }
    },
    {
      id: '2',
      name: 'Diamond Egg #002',
      description: 'An epic diamond egg that shines with incredible brilliance.',
      image: '💎',
      price: 0.5,
      currency: 'SOL',
      rarity: 'Epic',
      attributes: { power: 85, luck: 90, rarity: 'Epic' }
    },
    {
      id: '3',
      name: 'Crystal Egg #003',
      description: 'A legendary crystal egg with ancient magic sealed within.',
      image: '🔮',
      price: 1.0,
      currency: 'SOL',
      rarity: 'Legendary',
      attributes: { power: 95, luck: 95, rarity: 'Legendary' }
    },
    {
      id: '4',
      name: 'Golden Egg #004',
      description: 'A common golden egg, perfect for beginners.',
      image: '🥚',
      price: 100,
      currency: 'GOLD',
      rarity: 'Common',
      attributes: { power: 50, luck: 60, rarity: 'Common' }
    },
    {
      id: '5',
      name: 'Mystic Egg #005',
      description: 'A rare mystic egg with hidden potential.',
      image: '🌟',
      price: 500,
      currency: 'GOLD',
      rarity: 'Rare',
      attributes: { power: 70, luck: 75, rarity: 'Rare' }
    },
    {
      id: '6',
      name: 'Cosmic Egg #006',
      description: 'An epic cosmic egg from the depths of space.',
      image: '🌌',
      price: 1000,
      currency: 'GOLD',
      rarity: 'Epic',
      attributes: { power: 80, luck: 85, rarity: 'Epic' }
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100';
      case 'Rare': return 'text-blue-600 bg-blue-100';
      case 'Epic': return 'text-purple-600 bg-purple-100';
      case 'Legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePurchase = useCallback(async (nft: NFT) => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    const hasEnoughBalance = nft.currency === 'SOL' 
      ? balances.SOL >= nft.price 
      : balances.GOLD >= nft.price;

    if (!hasEnoughBalance) {
      notify({ 
        type: 'error', 
        message: `Insufficient ${nft.currency} balance!` 
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would integrate with actual NFT minting contract
      // For now, we'll simulate the transaction
      
      notify({ 
        type: 'success', 
        message: `${nft.name} purchased successfully for ${nft.price} ${nft.currency}!` 
      });

      // Update balances
      await getAllTokenBalances(publicKey, connection);

    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Purchase failed!`, 
        description: error?.message 
      });
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(false);
      setSelectedNFT(null);
    }
  }, [publicKey, balances, getAllTokenBalances, connection]);

  return (
    <Layout>
      <Head>
        <title>NFT Marketplace - Goldium.io</title>
        <meta name="description" content="Mint and trade exclusive Goldium Eggs NFTs with real utility and rewards" />
      </Head>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              NFT Marketplace
            </h1>
            <p className="text-xl text-white mb-6">
              Collect exclusive Goldium Eggs with real utility and rewards
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="bg-black/80 text-white px-3 py-1 rounded-full border border-yellow-500/30">
                Balance: {balances.SOL.toFixed(4)} SOL
              </div>
              <div className="bg-black/80 text-white px-3 py-1 rounded-full border border-orange-500/30">
                Balance: {balances.GOLD.toFixed(2)} GOLD
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nfts.map((nft) => (
              <div key={nft.id} className="bg-black/80 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700">
                {/* NFT Image */}
                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-8 text-center">
                  <div className="text-6xl mb-4">{nft.image}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>{nft.rarity}</div>
                </div>
                {/* NFT Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{nft.name}</h3>
                  <p className="text-white text-sm mb-4">{nft.description}</p>
                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-300">Power</div>
                      <div className="text-sm font-medium text-white">{nft.attributes.power}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300">Luck</div>
                      <div className="text-sm font-medium text-white">{nft.attributes.luck}</div>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-white">{nft.price} {nft.currency}</div>
                    <button
                      onClick={() => setSelectedNFT(nft)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Why Collect Goldium Eggs?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎁</div>
                <h3 className="font-semibold text-gray-900 mb-2">Exclusive Rewards</h3>
                <p className="text-gray-600 text-sm">
                  Each egg contains unique rewards and bonuses for holders
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Staking Bonuses</h3>
                <p className="text-gray-600 text-sm">
                  NFT holders get increased staking rewards and special benefits
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="font-semibold text-gray-900 mb-2">Game Integration</h3>
                <p className="text-gray-600 text-sm">
                  Use your NFTs in our play-to-earn games for extra rewards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedNFT.image}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedNFT.name}
              </h3>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(selectedNFT.rarity)}`}>
                {selectedNFT.rarity}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600 text-sm">{selectedNFT.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-lg">
                    {selectedNFT.price} {selectedNFT.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className="font-medium">
                    {selectedNFT.currency === 'SOL' 
                      ? `${balances.SOL.toFixed(4)} SOL`
                      : `${balances.GOLD.toFixed(2)} GOLD`
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedNFT(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchase(selectedNFT)}
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NFTMarketplace; 