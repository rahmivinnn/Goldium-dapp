import { FC, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../utils/notifications';

interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
}

interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  fearGreedIndex: number;
  activeTokens: number;
}

interface MarketData {
  prices: TokenPrice[];
  marketStats: MarketStats;
  trending: {
    gainers: TokenPrice[];
    losers: TokenPrice[];
  };
}

export const RealTimeMarketDashboard: FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenPrice | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'change24h' | 'volume24h' | 'marketCap'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'gainers' | 'losers'>('all');

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch('/api/market/prices');
      const result = await response.json();
      
      if (result.success) {
        setMarketData(result.data);
      } else {
        notify({ type: 'error', message: result.error || 'Failed to fetch market data' });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      notify({ type: 'error', message: 'Failed to fetch market data' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = (change: number): string => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  };

  const getFearGreedColor = (index: number): string => {
    if (index >= 75) return 'text-green-400';
    if (index >= 50) return 'text-yellow-400';
    if (index >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFearGreedLabel = (index: number): string => {
    if (index >= 75) return 'Extreme Greed';
    if (index >= 50) return 'Greed';
    if (index >= 25) return 'Fear';
    return 'Extreme Fear';
  };

  const sortedTokens = marketData?.prices ? [...marketData.prices].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  }) : [];

  const filteredTokens = sortedTokens.filter(token => {
    if (filterBy === 'gainers') return token.change24h > 0;
    if (filterBy === 'losers') return token.change24h < 0;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 animate-morphing">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 animate-cyber-pulse"
      >
        <h2 className="text-2xl font-bold text-white mb-6 animate-shimmer">🌐 Real-Time Market Overview</h2>
        
        {marketData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Total Market Cap</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(marketData.marketStats.totalMarketCap)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">24h Volume</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(marketData.marketStats.totalVolume24h)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">BTC Dominance</div>
              <div className="text-lg font-bold text-white">
                {marketData.marketStats.btcDominance.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Fear & Greed</div>
              <div className={`text-lg font-bold ${getFearGreedColor(marketData.marketStats.fearGreedIndex)}`}>
                {marketData.marketStats.fearGreedIndex.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">
                {getFearGreedLabel(marketData.marketStats.fearGreedIndex)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Active Tokens</div>
              <div className="text-lg font-bold text-white">
                {marketData.marketStats.activeTokens}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Trending Tokens */}
      {marketData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Top Gainers */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-green-500/30 p-6 animate-morphing">
            <h3 className="text-lg font-bold text-green-400 mb-4 animate-twinkle">🚀 Top Gainers</h3>
            <div className="space-y-3">
              {marketData.trending.gainers.slice(0, 3).map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20 animate-hologram"
                >
                  <div>
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{formatPrice(token.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">
                      {getChangeIcon(token.change24h)} +{token.change24h.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Vol: {formatNumber(token.volume24h, 1)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-red-500/30 p-6 animate-morphing">
            <h3 className="text-lg font-bold text-red-400 mb-4 animate-twinkle">📉 Top Losers</h3>
            <div className="space-y-3">
              {marketData.trending.losers.slice(0, 3).map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20 animate-hologram"
                >
                  <div>
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{formatPrice(token.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-medium">
                      {getChangeIcon(token.change24h)} {token.change24h.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Vol: {formatNumber(token.volume24h, 1)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Token List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 animate-morphing"
      >
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-bold text-white animate-shimmer">💰 All Tokens</h3>
          
          <div className="flex items-center gap-4">
            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Tokens</option>
              <option value="gainers">Gainers Only</option>
              <option value="losers">Losers Only</option>
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change24h">24h Change</option>
              <option value="volume24h">Volume</option>
            </select>
            
            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
            
            {/* View Mode */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Token Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedToken(token)}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30 hover:border-purple-500/50 cursor-pointer transition-all duration-300 animate-hologram hover:animate-cyber-pulse"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white">{token.symbol}</div>
                  <div className={`text-sm font-medium ${getChangeColor(token.change24h)}`}>
                    {getChangeIcon(token.change24h)} {token.change24h.toFixed(2)}%
                  </div>
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {formatPrice(token.price)}
                </div>
                <div className="text-xs text-gray-400">
                  Vol: {formatNumber(token.volume24h, 1)}
                </div>
                <div className="text-xs text-gray-500">
                  MCap: {formatNumber(token.marketCap, 1)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => setSelectedToken(token)}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-600/20 hover:border-purple-500/50 cursor-pointer transition-all duration-300 animate-hologram"
              >
                <div className="flex items-center gap-4">
                  <div className="font-bold text-white w-16">{token.symbol}</div>
                  <div className="text-white">{formatPrice(token.price)}</div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className={`font-medium ${getChangeColor(token.change24h)}`}>
                    {getChangeIcon(token.change24h)} {token.change24h.toFixed(2)}%
                  </div>
                  <div className="text-gray-400 w-20 text-right">
                    {formatNumber(token.volume24h, 1)}
                  </div>
                  <div className="text-gray-400 w-20 text-right">
                    {formatNumber(token.marketCap, 1)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Token Detail Modal */}
      <AnimatePresence>
        {selectedToken && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSelectedToken(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-20 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 z-50 animate-morphing"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white animate-shimmer">
                  {selectedToken.symbol} Details
                </h3>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">Current Price</div>
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(selectedToken.price)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">24h Change</div>
                    <div className={`text-2xl font-bold ${getChangeColor(selectedToken.change24h)}`}>
                      {getChangeIcon(selectedToken.change24h)} {selectedToken.change24h.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(selectedToken.volume24h)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(selectedToken.marketCap)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">24h High</div>
                    <div className="text-xl font-bold text-green-400">
                      {formatPrice(selectedToken.high24h)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-1">24h Low</div>
                    <div className="text-xl font-bold text-red-400">
                      {formatPrice(selectedToken.low24h)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(selectedToken.lastUpdated).toLocaleString()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};