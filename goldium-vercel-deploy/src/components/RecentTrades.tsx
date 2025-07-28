import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Trade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: Date;
  total: number;
}

interface RecentTradesProps {
  symbol: 'SOL/GOLD' | 'GOLD/SOL';
}

export const RecentTrades: FC<RecentTradesProps> = ({ symbol }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [volume24h, setVolume24h] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);

  // Generate mock trade data
  useEffect(() => {
    const generateTrade = () => {
      const basePrice = symbol === 'SOL/GOLD' ? 833.33 : 0.0012;
      const priceVariation = basePrice * 0.002; // 0.2% variation
      
      const price = basePrice + (Math.random() - 0.5) * priceVariation;
      const amount = Math.random() * 50 + 5;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      
      const newTrade: Trade = {
        id: Date.now().toString(),
        price,
        amount,
        side,
        timestamp: new Date(),
        total: price * amount
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 19)]); // Keep last 20 trades
    };

    // Generate initial trades
    for (let i = 0; i < 15; i++) {
      setTimeout(() => generateTrade(), i * 200);
    }

    // Continue generating trades
    const interval = setInterval(generateTrade, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Calculate 24h stats
  useEffect(() => {
    if (trades.length > 0) {
      const totalVolume = trades.reduce((sum, trade) => sum + trade.total, 0);
      setVolume24h(totalVolume * 24); // Simulate 24h volume
      
      const priceChange = (Math.random() - 0.5) * 10; // Random price change
      setPriceChange24h(priceChange);
    }
  }, [trades]);

  const formatPrice = (price: number) => {
    return symbol === 'SOL/GOLD' ? price.toFixed(2) : price.toFixed(6);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-yellow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient">
          ⚡ Recent Trades
        </h3>
        <div className="text-sm bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
          {symbol}
        </div>
      </div>

      {/* 24h Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div>
          <div className="text-xs text-gray-400">24h Volume</div>
          <div className="text-white font-semibold">{formatVolume(volume24h)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">24h Change</div>
          <div className={`font-semibold ${
            priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-2 px-2">
        <div className="text-left">Price</div>
        <div className="text-center">Amount</div>
        <div className="text-center">Total</div>
        <div className="text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {trades.map((trade, index) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-4 gap-2 text-xs py-2 px-2 rounded hover:bg-gray-800/50 cursor-pointer ${
              trade.side === 'buy' ? 'border-l-2 border-green-500/30' : 'border-l-2 border-red-500/30'
            }`}
          >
            <div className={`font-mono ${
              trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPrice(trade.price)}
            </div>
            <div className="text-white text-center font-mono">
              {formatAmount(trade.amount)}
            </div>
            <div className="text-gray-300 text-center font-mono">
              {formatVolume(trade.total)}
            </div>
            <div className="text-gray-400 text-right font-mono">
              {formatTime(trade.timestamp)}
            </div>
          </motion.div>
        ))}
      </div>

      {trades.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <div className="text-2xl mb-2">📊</div>
          <p>Loading recent trades...</p>
        </div>
      )}

      {/* Market Summary */}
      {trades.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-gray-400">Last Price</div>
              <div className={`font-mono font-semibold ${
                trades[0].side === 'buy' ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPrice(trades[0].price)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Trades Count</div>
              <div className="text-white font-semibold">{trades.length}</div>
            </div>
            <div>
              <div className="text-gray-400">Avg. Size</div>
              <div className="text-white font-semibold">
                {formatAmount(trades.reduce((sum, t) => sum + t.amount, 0) / trades.length)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};