import React, { FC, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';
import { TOKENS, SOLSCAN_CONFIG } from '../config/tokens';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

interface BalanceTrackerProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const BalanceTracker: FC<BalanceTrackerProps> = ({ 
  autoRefresh = true, 
  refreshInterval = 30000 // 30 seconds
}) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const { balances, isLoading, getAllTokenBalances } = useTokenBalanceStore();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [priceData, setPriceData] = useState<{ SOL: number; GOLD: number }>({ SOL: 0, GOLD: 0 });

  // Fetch price data (mock implementation - replace with real price API)
  const fetchPriceData = useCallback(async () => {
    try {
      // Mock price data - in production, integrate with CoinGecko, Jupiter, or other price APIs
      const mockPrices = {
        SOL: 100 + Math.random() * 20, // Mock SOL price around $100-120
        GOLD: 0.1 + Math.random() * 0.05, // Mock GOLD price around $0.10-0.15
      };
      setPriceData(mockPrices);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  }, []);

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (publicKey) {
      await getAllTokenBalances(publicKey, connection);
      setLastUpdated(new Date());
      await fetchPriceData();
    }
  }, [publicKey, connection, getAllTokenBalances, fetchPriceData]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && publicKey) {
      const interval = setInterval(refreshBalances, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, publicKey, refreshBalances, refreshInterval]);

  // Initial load
  useEffect(() => {
    if (publicKey) {
      refreshBalances();
    }
  }, [publicKey, refreshBalances]);

  const getSolscanAccountUrl = () => {
    if (!publicKey) return '#';
    const network = networkConfiguration === 'mainnet-beta' ? '' : `?cluster=${networkConfiguration}`;
    return `${SOLSCAN_CONFIG.baseUrl}/account/${publicKey.toBase58()}${network}`;
  };

  const formatBalance = (balance: number, decimals: number = 6) => {
    return balance.toFixed(decimals);
  };

  const formatUSD = (amount: number, price: number) => {
    const usdValue = amount * price;
    return usdValue.toFixed(2);
  };

  const getTotalPortfolioValue = () => {
    return (balances.SOL * priceData.SOL) + (balances.GOLD * priceData.GOLD);
  };

  if (!publicKey) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Balance</h3>
        <p className="text-gray-400">Connect your wallet to view balances</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-purple"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          💰 Portfolio Balance
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshBalances}
            disabled={isLoading}
            className="p-2 text-gray-300 hover:text-white transition-all duration-300 disabled:opacity-50 rounded-full hover:bg-purple-600/20 neon-purple"
            title="Refresh balances"
          >
            <svg
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </motion.button>
          <a
            href={getSolscanAccountUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none"
          >
            🔍 Solscan
          </a>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-4 border border-yellow-500/30">
        <div className="text-center">
          <div className="text-sm text-gray-300 mb-1">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-white">
            ${formatUSD(getTotalPortfolioValue(), 1)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Network: {networkConfiguration === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
          </div>
        </div>
      </div>

      {/* Token Balances */}
      <div className="space-y-3">
        {/* SOL Balance */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={TOKENS.SOL.logoURI} 
                alt="SOL" 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/solanaLogo.png';
                }}
              />
              <div>
                <div className="text-white font-semibold">{TOKENS.SOL.symbol}</div>
                <div className="text-xs text-gray-400">{TOKENS.SOL.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {formatBalance(balances.SOL, 6)} SOL
              </div>
              <div className="text-xs text-gray-400">
                ≈ ${formatUSD(balances.SOL, priceData.SOL)}
              </div>
            </div>
          </div>
        </div>

        {/* GOLD Balance */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={TOKENS.GOLD.logoURI} 
                alt="GOLD" 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
              <div>
                <div className="text-white font-semibold">{TOKENS.GOLD.symbol}</div>
                <div className="text-xs text-gray-400">{TOKENS.GOLD.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {formatBalance(balances.GOLD, 6)} GOLD
              </div>
              <div className="text-xs text-gray-400">
                ≈ ${formatUSD(balances.GOLD, priceData.GOLD)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-xs text-gray-500 text-center mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {autoRefresh && (
            <span className="ml-2">• Auto-refresh: {refreshInterval / 1000}s</span>
          )}
        </div>
      )}

      {/* Network Status */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs">
        <div className={`w-2 h-2 rounded-full ${
          networkConfiguration === 'mainnet-beta' ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
        <span className="text-gray-400">
          {networkConfiguration === 'mainnet-beta' ? 'Mainnet' : 'Devnet'} • 
          {isLoading ? 'Updating...' : 'Connected'}
        </span>
      </div>
    </motion.div>
  );
};