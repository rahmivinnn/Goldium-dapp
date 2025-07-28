import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  symbol: 'SOL/GOLD' | 'GOLD/SOL';
}

export const OrderBook: FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);

  // Generate mock order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = symbol === 'SOL/GOLD' ? 833.33 : 0.0012; // 1 SOL = 833.33 GOLD
      const spreadPercent = 0.001; // 0.1% spread
      
      const midPrice = basePrice;
      const spreadAmount = midPrice * spreadPercent;
      
      // Generate bids (buy orders) - below mid price
      const newBids: OrderBookEntry[] = [];
      let total = 0;
      for (let i = 0; i < 10; i++) {
        const price = midPrice - spreadAmount/2 - (i * midPrice * 0.0005);
        const amount = Math.random() * 100 + 10;
        total += amount;
        newBids.push({ price, amount, total });
      }
      
      // Generate asks (sell orders) - above mid price
      const newAsks: OrderBookEntry[] = [];
      total = 0;
      for (let i = 0; i < 10; i++) {
        const price = midPrice + spreadAmount/2 + (i * midPrice * 0.0005);
        const amount = Math.random() * 100 + 10;
        total += amount;
        newAsks.push({ price, amount, total });
      }
      
      setBids(newBids);
      setAsks(newAsks.reverse()); // Reverse to show lowest ask first
      setSpread(spreadAmount);
      setLastPrice(midPrice);
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: number) => {
    return symbol === 'SOL/GOLD' ? price.toFixed(2) : price.toFixed(6);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  const getMaxTotal = () => {
    const maxBidTotal = Math.max(...bids.map(b => b.total));
    const maxAskTotal = Math.max(...asks.map(a => a.total));
    return Math.max(maxBidTotal, maxAskTotal);
  };

  const maxTotal = getMaxTotal();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-green"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
          📊 Order Book
        </h3>
        <div className="text-sm bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
          {symbol}
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2 px-2">
        <div className="text-left">Price</div>
        <div className="text-center">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="space-y-1 mb-4">
        {asks.map((ask, index) => (
          <motion.div
            key={`ask-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 rounded hover:bg-red-900/20 cursor-pointer"
          >
            {/* Background bar */}
            <div 
              className="absolute inset-0 bg-red-500/10 rounded"
              style={{ width: `${(ask.total / maxTotal) * 100}%` }}
            />
            
            <div className="relative text-red-400 font-mono">{formatPrice(ask.price)}</div>
            <div className="relative text-white text-center font-mono">{formatAmount(ask.amount)}</div>
            <div className="relative text-gray-300 text-right font-mono">{formatAmount(ask.total)}</div>
          </motion.div>
        ))}
      </div>

      {/* Spread */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-center">
        <div className="text-white font-bold text-lg">{formatPrice(lastPrice)}</div>
        <div className="text-gray-400 text-xs">
          Spread: {formatPrice(spread)} ({((spread / lastPrice) * 100).toFixed(3)}%)
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="space-y-1">
        {bids.map((bid, index) => (
          <motion.div
            key={`bid-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 rounded hover:bg-green-900/20 cursor-pointer"
          >
            {/* Background bar */}
            <div 
              className="absolute inset-0 bg-green-500/10 rounded"
              style={{ width: `${(bid.total / maxTotal) * 100}%` }}
            />
            
            <div className="relative text-green-400 font-mono">{formatPrice(bid.price)}</div>
            <div className="relative text-white text-center font-mono">{formatAmount(bid.amount)}</div>
            <div className="relative text-gray-300 text-right font-mono">{formatAmount(bid.total)}</div>
          </motion.div>
        ))}
      </div>

      {/* Market Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-gray-400">Best Bid</div>
            <div className="text-green-400 font-mono">{bids.length > 0 ? formatPrice(bids[0].price) : '-'}</div>
          </div>
          <div>
            <div className="text-gray-400">Best Ask</div>
            <div className="text-red-400 font-mono">{asks.length > 0 ? formatPrice(asks[asks.length - 1].price) : '-'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};