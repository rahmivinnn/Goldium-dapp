import { Connection, PublicKey } from '@solana/web3.js';
import { priceService, PriceData, PortfolioData } from './priceService';
import { TOKENS } from '../config/tokens';

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercentage: number;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  winRate: number;
}

export interface AssetAllocation {
  symbol: string;
  percentage: number;
  value: number;
  targetAllocation?: number;
  rebalanceAmount?: number;
}

export interface RiskMetrics {
  portfolioRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  diversificationScore: number;
  concentrationRisk: number;
  liquidityScore: number;
  recommendations: string[];
}

export interface TradingSignal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-100
  reason: string;
  targetPrice?: number;
  stopLoss?: number;
  confidence: number;
}

export interface MarketInsights {
  marketTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  fearGreedIndex: number;
  volatilityIndex: number;
  liquidityIndex: number;
  topGainers: { symbol: string; change: number }[];
  topLosers: { symbol: string; change: number }[];
}

class AnalyticsService {
  private portfolioHistory: { timestamp: number; value: number; balances: any }[] = [];
  private performanceCache: Map<string, PerformanceMetrics> = new Map();
  private signals: Map<string, TradingSignal> = new Map();

  constructor() {
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    // Load historical data from localStorage if available
    try {
      const stored = localStorage.getItem('portfolio_history');
      if (stored) {
        this.portfolioHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading portfolio history:', error);
    }
  }

  public recordPortfolioSnapshot(balances: { [symbol: string]: number }) {
    const portfolio = priceService.calculatePortfolio(balances);
    const snapshot = {
      timestamp: Date.now(),
      value: portfolio.totalValue,
      balances: { ...balances }
    };

    this.portfolioHistory.push(snapshot);
    
    // Keep only last 90 days of data
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    this.portfolioHistory = this.portfolioHistory.filter(
      snapshot => snapshot.timestamp > ninetyDaysAgo
    );

    // Save to localStorage
    try {
      localStorage.setItem('portfolio_history', JSON.stringify(this.portfolioHistory));
    } catch (error) {
      console.error('Error saving portfolio history:', error);
    }
  }

  public calculatePerformanceMetrics(balances: { [symbol: string]: number }): PerformanceMetrics {
    if (this.portfolioHistory.length < 2) {
      return {
        totalReturn: 0,
        totalReturnPercentage: 0,
        dailyReturn: 0,
        weeklyReturn: 0,
        monthlyReturn: 0,
        sharpeRatio: 0,
        volatility: 0,
        maxDrawdown: 0,
        winRate: 0
      };
    }

    const currentValue = priceService.calculatePortfolio(balances).totalValue;
    const initialValue = this.portfolioHistory[0].value;
    const totalReturn = currentValue - initialValue;
    const totalReturnPercentage = initialValue > 0 ? (totalReturn / initialValue) * 100 : 0;

    // Calculate daily returns
    const dailyReturns = [];
    for (let i = 1; i < this.portfolioHistory.length; i++) {
      const prevValue = this.portfolioHistory[i - 1].value;
      const currentValue = this.portfolioHistory[i].value;
      if (prevValue > 0) {
        dailyReturns.push((currentValue - prevValue) / prevValue);
      }
    }

    // Calculate metrics
    const dailyReturn = this.calculatePeriodReturn(1);
    const weeklyReturn = this.calculatePeriodReturn(7);
    const monthlyReturn = this.calculatePeriodReturn(30);
    
    const volatility = this.calculateVolatility(dailyReturns);
    const sharpeRatio = this.calculateSharpeRatio(dailyReturns, volatility);
    const maxDrawdown = this.calculateMaxDrawdown();
    const winRate = this.calculateWinRate(dailyReturns);

    return {
      totalReturn,
      totalReturnPercentage,
      dailyReturn,
      weeklyReturn,
      monthlyReturn,
      sharpeRatio,
      volatility,
      maxDrawdown,
      winRate
    };
  }

  private calculatePeriodReturn(days: number): number {
    const targetDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    const snapshot = this.portfolioHistory.find(s => s.timestamp >= targetDate);
    
    if (!snapshot || this.portfolioHistory.length === 0) return 0;
    
    const currentValue = this.portfolioHistory[this.portfolioHistory.length - 1].value;
    const pastValue = snapshot.value;
    
    return pastValue > 0 ? ((currentValue - pastValue) / pastValue) * 100 : 0;
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length < 2) return 0;
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility
  }

  private calculateSharpeRatio(returns: number[], volatility: number): number {
    if (returns.length === 0 || volatility === 0) return 0;
    
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 0.02 / 252; // Assume 2% annual risk-free rate
    
    return ((meanReturn - riskFreeRate) * 252) / (volatility / 100);
  }

  private calculateMaxDrawdown(): number {
    if (this.portfolioHistory.length < 2) return 0;
    
    let maxDrawdown = 0;
    let peak = this.portfolioHistory[0].value;
    
    for (const snapshot of this.portfolioHistory) {
      if (snapshot.value > peak) {
        peak = snapshot.value;
      }
      
      const drawdown = (peak - snapshot.value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown * 100;
  }

  private calculateWinRate(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const winningDays = returns.filter(r => r > 0).length;
    return (winningDays / returns.length) * 100;
  }

  public analyzeAssetAllocation(balances: { [symbol: string]: number }): AssetAllocation[] {
    const portfolio = priceService.calculatePortfolio(balances);
    const allocations: AssetAllocation[] = [];
    
    // Define target allocations (can be customized)
    const targetAllocations = {
      SOL: 60,
      GOLD: 40
    };
    
    portfolio.assets.forEach(asset => {
      const target = targetAllocations[asset.symbol as keyof typeof targetAllocations] || 0;
      const rebalanceAmount = portfolio.totalValue * (target / 100) - asset.value;
      
      allocations.push({
        symbol: asset.symbol,
        percentage: asset.allocation,
        value: asset.value,
        targetAllocation: target,
        rebalanceAmount
      });
    });
    
    return allocations;
  }

  public assessRisk(balances: { [symbol: string]: number }): RiskMetrics {
    const portfolio = priceService.calculatePortfolio(balances);
    const allocations = this.analyzeAssetAllocation(balances);
    
    // Calculate diversification score
    const diversificationScore = this.calculateDiversificationScore(allocations);
    
    // Calculate concentration risk
    const maxAllocation = Math.max(...allocations.map(a => a.percentage));
    const concentrationRisk = maxAllocation;
    
    // Calculate liquidity score (simplified)
    const liquidityScore = this.calculateLiquidityScore(balances);
    
    // Determine overall risk level
    let portfolioRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (concentrationRisk > 80 || liquidityScore < 30) {
      portfolioRisk = 'HIGH';
    } else if (concentrationRisk < 60 && liquidityScore > 70 && diversificationScore > 60) {
      portfolioRisk = 'LOW';
    }
    
    // Generate recommendations
    const recommendations = this.generateRiskRecommendations({
      diversificationScore,
      concentrationRisk,
      liquidityScore,
      portfolioRisk
    });
    
    return {
      portfolioRisk,
      diversificationScore,
      concentrationRisk,
      liquidityScore,
      recommendations
    };
  }

  private calculateDiversificationScore(allocations: AssetAllocation[]): number {
    if (allocations.length <= 1) return 0;
    
    // Calculate Herfindahl-Hirschman Index
    const hhi = allocations.reduce((sum, allocation) => {
      return sum + Math.pow(allocation.percentage / 100, 2);
    }, 0);
    
    // Convert to diversification score (0-100)
    return Math.max(0, (1 - hhi) * 100);
  }

  private calculateLiquidityScore(balances: { [symbol: string]: number }): number {
    // Simplified liquidity scoring based on token types
    let totalValue = 0;
    let liquidValue = 0;
    
    Object.entries(balances).forEach(([symbol, balance]) => {
      const price = priceService.getPrice(symbol);
      if (price && balance > 0) {
        const value = balance * price.price;
        totalValue += value;
        
        // SOL is highly liquid, GOLD depends on volume
        if (symbol === 'SOL') {
          liquidValue += value;
        } else if (symbol === 'GOLD' && price.volume24h > 100000) {
          liquidValue += value * 0.7; // Partially liquid
        }
      }
    });
    
    return totalValue > 0 ? (liquidValue / totalValue) * 100 : 0;
  }

  private generateRiskRecommendations(metrics: any): string[] {
    const recommendations = [];
    
    if (metrics.concentrationRisk > 70) {
      recommendations.push('Consider diversifying your portfolio to reduce concentration risk');
    }
    
    if (metrics.diversificationScore < 40) {
      recommendations.push('Add more assets to improve portfolio diversification');
    }
    
    if (metrics.liquidityScore < 50) {
      recommendations.push('Increase allocation to more liquid assets for better flexibility');
    }
    
    if (metrics.portfolioRisk === 'HIGH') {
      recommendations.push('Your portfolio has high risk - consider rebalancing');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your portfolio risk profile looks balanced');
    }
    
    return recommendations;
  }

  public generateTradingSignals(balances: { [symbol: string]: number }): TradingSignal[] {
    const signals: TradingSignal[] = [];
    
    Object.keys(TOKENS).forEach(symbol => {
      const signal = this.analyzeTradingSignal(symbol, balances);
      if (signal) {
        signals.push(signal);
        this.signals.set(symbol, signal);
      }
    });
    
    return signals;
  }

  private analyzeTradingSignal(symbol: string, balances: { [symbol: string]: number }): TradingSignal | null {
    const priceData = priceService.getPrice(symbol);
    if (!priceData) return null;
    
    // Simple technical analysis based on price changes
    const change24h = priceData.change24h;
    const currentBalance = balances[symbol] || 0;
    const portfolio = priceService.calculatePortfolio(balances);
    const allocation = portfolio.assets.find(a => a.symbol === symbol)?.allocation || 0;
    
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let strength = 50;
    let reason = 'No clear signal';
    let confidence = 50;
    
    // Buy signals
    if (change24h < -5 && allocation < 30) {
      signal = 'BUY';
      strength = Math.min(90, 60 + Math.abs(change24h));
      reason = 'Price dip with low allocation - potential buying opportunity';
      confidence = 70;
    } else if (change24h > 10 && allocation < 20) {
      signal = 'BUY';
      strength = 75;
      reason = 'Strong upward momentum with low allocation';
      confidence = 65;
    }
    
    // Sell signals
    else if (change24h > 15 && allocation > 70) {
      signal = 'SELL';
      strength = 80;
      reason = 'Take profits - high allocation with strong gains';
      confidence = 75;
    } else if (change24h < -15 && allocation > 50) {
      signal = 'SELL';
      strength = 70;
      reason = 'Cut losses - significant decline with high allocation';
      confidence = 60;
    }
    
    return {
      symbol,
      signal,
      strength,
      reason,
      confidence,
      targetPrice: signal === 'BUY' ? priceData.price * 1.1 : priceData.price * 0.9,
      stopLoss: signal === 'BUY' ? priceData.price * 0.95 : undefined
    };
  }

  public getMarketInsights(): MarketInsights {
    const prices = priceService.getAllPrices();
    const priceArray = Array.from(prices.values());
    
    if (priceArray.length === 0) {
      return {
        marketTrend: 'NEUTRAL',
        fearGreedIndex: 50,
        volatilityIndex: 50,
        liquidityIndex: 50,
        topGainers: [],
        topLosers: []
      };
    }
    
    // Calculate market trend
    const avgChange = priceArray.reduce((sum, p) => sum + p.change24h, 0) / priceArray.length;
    let marketTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    if (avgChange > 2) marketTrend = 'BULLISH';
    else if (avgChange < -2) marketTrend = 'BEARISH';
    
    // Calculate fear & greed index (simplified)
    const fearGreedIndex = Math.max(0, Math.min(100, 50 + avgChange * 5));
    
    // Calculate volatility index
    const volatilities = priceArray.map(p => Math.abs(p.change24h));
    const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
    const volatilityIndex = Math.min(100, avgVolatility * 10);
    
    // Calculate liquidity index
    const totalVolume = priceArray.reduce((sum, p) => sum + p.volume24h, 0);
    const liquidityIndex = Math.min(100, Math.log10(totalVolume / 1000000) * 20);
    
    // Get top gainers and losers
    const sortedByChange = [...priceArray].sort((a, b) => b.change24h - a.change24h);
    const topGainers = sortedByChange.slice(0, 3).map(p => ({ symbol: p.symbol, change: p.change24h }));
    const topLosers = sortedByChange.slice(-3).reverse().map(p => ({ symbol: p.symbol, change: p.change24h }));
    
    return {
      marketTrend,
      fearGreedIndex,
      volatilityIndex,
      liquidityIndex,
      topGainers,
      topLosers
    };
  }

  public exportPortfolioData(): string {
    const data = {
      portfolioHistory: this.portfolioHistory,
      signals: Array.from(this.signals.entries()),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  public importPortfolioData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.portfolioHistory) {
        this.portfolioHistory = data.portfolioHistory;
        localStorage.setItem('portfolio_history', JSON.stringify(this.portfolioHistory));
      }
      return true;
    } catch (error) {
      console.error('Error importing portfolio data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;