import { Connection, PublicKey } from '@solana/web3.js';
import { TOKENS } from '../config/tokens';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdated: number;
}

export interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  assets: {
    symbol: string;
    balance: number;
    value: number;
    allocation: number;
    change24h: number;
  }[];
}

class PriceService {
  private prices: Map<string, PriceData> = new Map();
  private subscribers: Set<(prices: Map<string, PriceData>) => void> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private wsConnection: WebSocket | null = null;

  constructor() {
    this.initializePrices();
    this.startPriceUpdates();
    this.connectWebSocket();
  }

  private async initializePrices() {
    // Initialize with mock data for development
    const initialPrices: PriceData[] = [
      {
        symbol: 'SOL',
        price: 98.45,
        change24h: 2.34,
        volume24h: 1250000000,
        marketCap: 42000000000,
        lastUpdated: Date.now()
      },
      {
        symbol: 'GOLD',
        price: 0.0234,
        change24h: -1.23,
        volume24h: 850000,
        marketCap: 2340000,
        lastUpdated: Date.now()
      }
    ];

    initialPrices.forEach(price => {
      this.prices.set(price.symbol, price);
    });

    this.notifySubscribers();
  }

  private async fetchRealPrices() {
    try {
      // Fetch SOL price from CoinGecko
      const solResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
      );
      const solData = await solResponse.json();

      if (solData.solana) {
        const solPrice: PriceData = {
          symbol: 'SOL',
          price: solData.solana.usd,
          change24h: solData.solana.usd_24h_change || 0,
          volume24h: solData.solana.usd_24h_vol || 0,
          marketCap: solData.solana.usd_market_cap,
          lastUpdated: Date.now()
        };
        this.prices.set('SOL', solPrice);
      }

      // For GOLD token, we'll use Jupiter API or mock data
      await this.fetchTokenPrice('GOLD');

      this.notifySubscribers();
    } catch (error) {
      console.error('Error fetching real prices:', error);
      // Simulate price changes for development
      this.simulatePriceChanges();
    }
  }

  private async fetchTokenPrice(symbol: string) {
    try {
      // Try to get price from Jupiter API
      const tokenMint = TOKENS[symbol as keyof typeof TOKENS]?.mint;
      if (!tokenMint) return;

      const response = await fetch(
        `https://price.jup.ag/v4/price?ids=${tokenMint}`
      );
      const data = await response.json();

      if (data.data && data.data[tokenMint]) {
        const tokenData = data.data[tokenMint];
        const currentPrice = this.prices.get(symbol);
        
        const updatedPrice: PriceData = {
          symbol,
          price: tokenData.price,
          change24h: currentPrice ? ((tokenData.price - currentPrice.price) / currentPrice.price) * 100 : 0,
          volume24h: currentPrice?.volume24h || 0,
          lastUpdated: Date.now()
        };
        
        this.prices.set(symbol, updatedPrice);
      }
    } catch (error) {
      console.error(`Error fetching ${symbol} price:`, error);
    }
  }

  private simulatePriceChanges() {
    this.prices.forEach((priceData, symbol) => {
      // Simulate realistic price movements
      const volatility = symbol === 'SOL' ? 0.02 : 0.05; // SOL less volatile than GOLD
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = priceData.price * (1 + change);
      
      const updatedPrice: PriceData = {
        ...priceData,
        price: newPrice,
        change24h: priceData.change24h + (change * 100),
        lastUpdated: Date.now()
      };
      
      this.prices.set(symbol, updatedPrice);
    });
    
    this.notifySubscribers();
  }

  private connectWebSocket() {
    try {
      // Connect to a WebSocket for real-time price updates
      // This is a placeholder - in production, you'd connect to a real WebSocket service
      this.wsConnection = new WebSocket('wss://api.coingecko.com/api/v3/coins/solana/tickers');
      
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Process real-time price updates
          this.handleWebSocketUpdate(data);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.wsConnection.onerror = () => {
        console.log('WebSocket connection failed, using polling instead');
      };
    } catch (error) {
      console.log('WebSocket not available, using polling for price updates');
    }
  }

  private handleWebSocketUpdate(data: any) {
    // Process real-time price updates from WebSocket
    // Implementation depends on the WebSocket service format
  }

  private startPriceUpdates() {
    // Update prices every 30 seconds
    this.updateInterval = setInterval(() => {
      this.fetchRealPrices();
    }, 30000);
  }

  public subscribe(callback: (prices: Map<string, PriceData>) => void) {
    this.subscribers.add(callback);
    // Immediately call with current prices
    callback(this.prices);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback(new Map(this.prices));
    });
  }

  public getPrice(symbol: string): PriceData | null {
    return this.prices.get(symbol) || null;
  }

  public getAllPrices(): Map<string, PriceData> {
    return new Map(this.prices);
  }

  public calculatePortfolio(balances: { [symbol: string]: number }): PortfolioData {
    let totalValue = 0;
    let totalChange24h = 0;
    const assets = [];

    for (const [symbol, balance] of Object.entries(balances)) {
      const priceData = this.prices.get(symbol);
      if (priceData && balance > 0) {
        const value = balance * priceData.price;
        const change24h = (priceData.change24h / 100) * value;
        
        totalValue += value;
        totalChange24h += change24h;
        
        assets.push({
          symbol,
          balance,
          value,
          allocation: 0, // Will be calculated after totalValue is known
          change24h: priceData.change24h
        });
      }
    }

    // Calculate allocations
    assets.forEach(asset => {
      asset.allocation = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;
    });

    return {
      totalValue,
      totalChange24h: totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0,
      assets
    };
  }

  public async getHistoricalData(symbol: string, days: number = 7): Promise<{ timestamp: number; price: number }[]> {
    try {
      const coinId = symbol === 'SOL' ? 'solana' : 'goldium';
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      
      if (data.prices) {
        return data.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp,
          price
        }));
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    
    // Return mock historical data
    const mockData = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const currentPrice = this.getPrice(symbol)?.price || 1;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * dayMs);
      const randomChange = (Math.random() - 0.5) * 0.1;
      const price = currentPrice * (1 + randomChange);
      mockData.push({ timestamp, price });
    }
    
    return mockData;
  }

  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.wsConnection) {
      this.wsConnection.close();
    }
    this.subscribers.clear();
  }
}

// Export singleton instance
export const priceService = new PriceService();
export default priceService;