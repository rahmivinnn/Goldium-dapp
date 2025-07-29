import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  supply: number;
}

export const MarketOverview: FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [totalMarketCap, setTotalMarketCap] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock market data
    const generateMarketData = () => {
      const solData: MarketData = {
        symbol: 'SOL',
        price: 98.45 + (Math.random() - 0.5) * 5,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: 2847000000 + Math.random() * 500000000,
        marketCap: 42500000000 + Math.random() * 2000000000,
        high24h: 102.34,
        low24h: 95.67,
        supply: 431000000
      };

      const goldData: MarketData = {
        symbol: 'GOLD',
        price: 0.00118 + (Math.random() - 0.5) * 0.0001,
        change24h: (Math.random() - 0.5) * 15,
        volume24h: 1250000 + Math.random() * 300000,
        marketCap: 12500000 + Math.random() * 1000000,
        high24h: 0.00125,
        low24h: 0.00112,
        supply: 10000000000
      };

      const data = [solData, goldData];
      setMarketData(data);
      setTotalMarketCap(data.reduce((sum, token) => sum + token.marketCap, 0));
      setTotalVolume(data.reduce((sum, token) => sum + token.volume24h, 0));
      setLoading(false);
    };

    generateMarketData();
    const interval = setInterval(generateMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'SOL') {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-blue"
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient mb-4">
          🌟 Market Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="text-gray-400 text-sm">Total Market Cap</div>
            <div className="text-2xl font-bold text-white">{formatMarketCap(totalMarketCap)}</div>
            <div className="text-green-400 text-sm">+2.34% (24h)</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="text-gray-400 text-sm">24h Volume</div>
            <div className="text-2xl font-bold text-white">{formatVolume(totalVolume)}</div>
            <div className="text-blue-400 text-sm">+15.67% (24h)</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="text-gray-400 text-sm">Active Pairs</div>
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-yellow-400 text-sm">SOL/GOLD</div>
          </motion.div>
        </div>

        {/* Token List */}
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-4 text-xs text-gray-400 font-semibold px-4">
            <div>Token</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h Change</div>
            <div className="text-right">24h Volume</div>
            <div className="text-right">Market Cap</div>
            <div className="text-right">24h High</div>
            <div className="text-right">24h Low</div>
          </div>
          
          {marketData.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-7 gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  token.symbol === 'SOL' ? 'bg-purple-500' : 'bg-yellow-500'
                }`}>
                  {token.symbol === 'SOL' ? '◎' : '🥇'}
                </div>
                <div>
                  <div className="text-white font-semibold">{token.symbol}</div>
                  <div className="text-gray-400 text-xs">
                    {token.symbol === 'SOL' ? 'Solana' : 'Gold Token'}
                  </div>
                </div>
              </div>
              
              <div className="text-right text-white font-mono">
                {formatPrice(token.price, token.symbol)}
              </div>
              
              <div className={`text-right font-semibold ${
                token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </div>
              
              <div className="text-right text-gray-300 font-mono">
                {formatVolume(token.volume24h)}
              </div>
              
              <div className="text-right text-gray-300 font-mono">
                {formatMarketCap(token.marketCap)}
              </div>
              
              <div className="text-right text-gray-300 font-mono">
                {formatPrice(token.high24h, token.symbol)}
              </div>
              
              <div className="text-right text-gray-300 font-mono">
                {formatPrice(token.low24h, token.symbol)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Market Trends</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">SOL Bullish Momentum</span>
              </div>
              <span className="text-green-400 text-sm">Strong</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">GOLD Volatility</span>
              </div>
              <span className="text-yellow-400 text-sm">High</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Trading Volume</span>
              </div>
              <span className="text-blue-400 text-sm">Above Average</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">98.7%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">1,247</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">0.05%</div>
              <div className="text-gray-400 text-sm">Trading Fee</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};