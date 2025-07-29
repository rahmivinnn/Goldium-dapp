import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

interface TradingChartProps {
  symbol: 'SOL' | 'GOLD';
  timeframe: '1H' | '4H' | '1D' | '1W';
}

export const TradingChart: FC<TradingChartProps> = ({ symbol, timeframe }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  // Generate mock chart data
  useEffect(() => {
    const generateData = () => {
      const data: ChartData[] = [];
      const basePrice = symbol === 'SOL' ? 100 : 0.12;
      let price = basePrice;
      
      for (let i = 0; i < 24; i++) {
        const change = (Math.random() - 0.5) * (basePrice * 0.05);
        price += change;
        price = Math.max(price, basePrice * 0.8); // Prevent too low prices
        
        data.push({
          time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: price,
          volume: Math.random() * 1000000
        });
      }
      
      setChartData(data);
      setCurrentPrice(price);
      setPriceChange(((price - basePrice) / basePrice) * 100);
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  const getPathData = () => {
    if (chartData.length === 0) return '';
    
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const points = chartData.map((data, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((data.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const getGradientId = () => `gradient-${symbol.toLowerCase()}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-blue"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            📈 {symbol}/USD
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              ${currentPrice.toFixed(symbol === 'SOL' ? 2 : 4)}
            </span>
            <span className={`text-sm font-medium ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {['1H', '4H', '1D', '1W'].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === tf
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height="200" viewBox="0 0 400 200" className="overflow-visible">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={symbol === 'SOL' ? '#3B82F6' : '#F59E0B'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={symbol === 'SOL' ? '#3B82F6' : '#F59E0B'} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="20"
              y1={20 + (i * 40)}
              x2="380"
              y2={20 + (i * 40)}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          
          {/* Price line */}
          <motion.path
            d={getPathData()}
            fill="none"
            stroke={symbol === 'SOL' ? '#3B82F6' : '#F59E0B'}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* Area fill */}
          <motion.path
            d={`${getPathData()} L 380,180 L 20,180 Z`}
            fill={`url(#${getGradientId()})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          {/* Data points */}
          {chartData.map((data, index) => {
            const x = 20 + (index / (chartData.length - 1)) * 360;
            const y = 180 - ((data.price - minPrice) / priceRange) * 160;
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={symbol === 'SOL' ? '#3B82F6' : '#F59E0B'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:r-5 transition-all cursor-pointer"
              >
                <title>{`${data.time}: $${data.price.toFixed(4)}`}</title>
              </motion.circle>
            );
          })}
        </svg>
      </div>

      {/* Volume bars */}
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Volume</div>
        <div className="flex items-end gap-1 h-12">
          {chartData.slice(-12).map((data, index) => {
            const maxVolume = Math.max(...chartData.map(d => d.volume));
            const height = (data.volume / maxVolume) * 48;
            
            return (
              <motion.div
                key={index}
                className={`flex-1 rounded-t ${
                  symbol === 'SOL' ? 'bg-blue-500/30' : 'bg-yellow-500/30'
                }`}
                style={{ height: `${height}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-gray-400 text-xs">24h High</div>
          <div className="text-white font-medium">${maxPrice.toFixed(symbol === 'SOL' ? 2 : 4)}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">24h Low</div>
          <div className="text-white font-medium">${minPrice.toFixed(symbol === 'SOL' ? 2 : 4)}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">24h Volume</div>
          <div className="text-white font-medium">
            {(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>
    </motion.div>
  );
};