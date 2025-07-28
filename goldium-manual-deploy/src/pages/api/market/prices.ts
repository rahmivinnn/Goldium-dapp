import type { NextApiRequest, NextApiResponse } from 'next';

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

interface MarketData {
  prices: TokenPrice[];
  marketStats: {
    totalMarketCap: number;
    totalVolume24h: number;
    btcDominance: number;
    fearGreedIndex: number;
    activeTokens: number;
  };
  trending: {
    gainers: TokenPrice[];
    losers: TokenPrice[];
  };
}

interface ApiResponse {
  success: boolean;
  data?: MarketData;
  error?: string;
}

// Mock price data generator
function generateMockPrice(symbol: string, basePrice: number): TokenPrice {
  const change = (Math.random() - 0.5) * 20; // -10% to +10%
  const currentPrice = basePrice * (1 + change / 100);
  
  return {
    symbol,
    price: currentPrice,
    change24h: change,
    volume24h: Math.random() * 10000000 + 100000,
    marketCap: currentPrice * (Math.random() * 1000000000 + 10000000),
    high24h: currentPrice * (1 + Math.random() * 0.1),
    low24h: currentPrice * (1 - Math.random() * 0.1),
    lastUpdated: new Date().toISOString()
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Generate mock market data
    const tokens = [
      { symbol: 'SOL', basePrice: 100 },
      { symbol: 'GOLD', basePrice: 0.12 },
      { symbol: 'USDC', basePrice: 1.00 },
      { symbol: 'BTC', basePrice: 45000 },
      { symbol: 'ETH', basePrice: 2800 },
      { symbol: 'USDT', basePrice: 1.00 },
      { symbol: 'BNB', basePrice: 320 },
      { symbol: 'ADA', basePrice: 0.45 },
      { symbol: 'DOT', basePrice: 6.5 },
      { symbol: 'MATIC', basePrice: 0.85 }
    ];

    const prices = tokens.map(token => generateMockPrice(token.symbol, token.basePrice));
    
    // Sort for trending
    const sortedByChange = [...prices].sort((a, b) => b.change24h - a.change24h);
    const gainers = sortedByChange.slice(0, 5);
    const losers = sortedByChange.slice(-5).reverse();

    // Calculate market stats
    const totalMarketCap = prices.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume24h = prices.reduce((sum, token) => sum + token.volume24h, 0);
    const avgChange = prices.reduce((sum, token) => sum + token.change24h, 0) / prices.length;
    
    const marketData: MarketData = {
      prices,
      marketStats: {
        totalMarketCap,
        totalVolume24h,
        btcDominance: 42.5 + Math.random() * 5, // Mock BTC dominance
        fearGreedIndex: Math.max(0, Math.min(100, 50 + avgChange * 3)), // Based on avg change
        activeTokens: prices.length
      },
      trending: {
        gainers,
        losers
      }
    };

    // Add cache headers for better performance
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json({ success: true, data: marketData });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}