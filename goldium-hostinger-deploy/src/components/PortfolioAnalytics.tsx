import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { analyticsService, PerformanceMetrics, AssetAllocation, RiskMetrics, TradingSignal } from '../services/analyticsService';
import { priceService, PriceData } from '../services/priceService';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';
import { SOLSCAN_CONFIG } from '../config/tokens';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { notify } from '../utils/notifications';

interface ChartData {
  timestamp: number;
  value: number;
}

export const PortfolioAnalytics: FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  const { networkConfiguration } = useNetworkConfiguration();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'signals'>('overview');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [portfolioChart, setPortfolioChart] = useState<ChartData[]>([]);
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D');

  // Subscribe to price updates
  useEffect(() => {
    const unsubscribe = priceService.subscribe((newPrices) => {
      setPrices(newPrices);
    });
    return unsubscribe;
  }, []);

  // Update analytics when balances change
  useEffect(() => {
    if (publicKey && Object.values(balances).some(b => b > 0)) {
      updateAnalytics();
    }
  }, [balances, publicKey]);

  const updateAnalytics = useCallback(async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      // Record current portfolio snapshot
      analyticsService.recordPortfolioSnapshot(balances);
      
      // Calculate performance metrics
      const performance = analyticsService.calculatePerformanceMetrics(balances);
      setPerformanceMetrics(performance);
      
      // Analyze asset allocation
      const allocation = analyticsService.analyzeAssetAllocation(balances);
      setAssetAllocation(allocation);
      
      // Assess risk
      const risk = analyticsService.assessRisk(balances);
      setRiskMetrics(risk);
      
      // Generate trading signals
      const signals = analyticsService.generateTradingSignals(balances);
      setTradingSignals(signals);
      
      // Get portfolio chart data
      await updatePortfolioChart();
    } catch (error) {
      console.error('Error updating analytics:', error);
      notify({ type: 'error', message: 'Failed to update portfolio analytics' });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, balances]);

  const updatePortfolioChart = async () => {
    const days = timeframe === '1D' ? 1 : timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90;
    
    // Generate mock portfolio history for demonstration
    const chartData: ChartData[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const currentPortfolio = priceService.calculatePortfolio(balances);
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * dayMs);
      const randomChange = (Math.random() - 0.5) * 0.1;
      const value = currentPortfolio.totalValue * (1 + randomChange);
      chartData.push({ timestamp, value });
    }
    
    setPortfolioChart(chartData);
  };

  const handleRefresh = () => {
    if (publicKey) {
      getAllTokenBalances(publicKey, connection);
      updateAnalytics();
    }
  };

  const handleExportData = () => {
    try {
      const data = analyticsService.exportPortfolioData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify({ type: 'success', message: 'Portfolio data exported successfully' });
    } catch (error) {
      notify({ type: 'error', message: 'Failed to export portfolio data' });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-400';
      case 'SELL': return 'text-red-400';
      case 'HOLD': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (!publicKey) {
    return (
      <div className="bg-black/80 rounded-xl p-8 border border-gray-700">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">Portfolio Analytics</h3>
          <p className="text-gray-400 mb-4">
            Connect your wallet to access advanced portfolio analytics, performance tracking, and investment insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Analytics</h2>
          <p className="text-gray-400">Advanced insights and performance tracking</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? '🔄' : '↻'} Refresh
          </button>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-black/40 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'performance', label: 'Performance', icon: '📈' },
          { id: 'risk', label: 'Risk Analysis', icon: '⚠️' },
          { id: 'signals', label: 'Trading Signals', icon: '🎯' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Value Chart */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Portfolio Value</h3>
                <div className="flex gap-1">
                  {['1D', '7D', '30D', '90D'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf as any)}
                      className={`px-2 py-1 text-xs rounded ${
                        timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-48 flex items-center justify-center text-gray-400">
                📈 Portfolio Chart ({portfolioChart.length} data points)
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
              <div className="space-y-3">
                {assetAllocation.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-white font-medium">{asset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{asset.percentage.toFixed(1)}%</div>
                      <div className="text-gray-400 text-sm">{formatCurrency(asset.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {performanceMetrics && [
                { label: 'Total Return', value: formatCurrency(performanceMetrics.totalReturn), change: performanceMetrics.totalReturnPercentage },
                { label: 'Daily Return', value: formatPercentage(performanceMetrics.dailyReturn), change: performanceMetrics.dailyReturn },
                { label: 'Sharpe Ratio', value: performanceMetrics.sharpeRatio.toFixed(2), change: null },
                { label: 'Max Drawdown', value: formatPercentage(-performanceMetrics.maxDrawdown), change: null }
              ].map((stat, index) => (
                <div key={index} className="bg-black/80 rounded-xl p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                  <div className="text-white text-lg font-semibold">{stat.value}</div>
                  {stat.change !== null && (
                    <div className={`text-sm ${
                      stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(stat.change)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && performanceMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Total Return', value: formatCurrency(performanceMetrics.totalReturn), subtitle: formatPercentage(performanceMetrics.totalReturnPercentage) },
              { label: 'Daily Return', value: formatPercentage(performanceMetrics.dailyReturn), subtitle: 'Last 24 hours' },
              { label: 'Weekly Return', value: formatPercentage(performanceMetrics.weeklyReturn), subtitle: 'Last 7 days' },
              { label: 'Monthly Return', value: formatPercentage(performanceMetrics.monthlyReturn), subtitle: 'Last 30 days' },
              { label: 'Sharpe Ratio', value: performanceMetrics.sharpeRatio.toFixed(2), subtitle: 'Risk-adjusted return' },
              { label: 'Volatility', value: formatPercentage(performanceMetrics.volatility), subtitle: 'Annualized' },
              { label: 'Max Drawdown', value: formatPercentage(-performanceMetrics.maxDrawdown), subtitle: 'Largest decline' },
              { label: 'Win Rate', value: formatPercentage(performanceMetrics.winRate), subtitle: 'Profitable days' }
            ].map((metric, index) => (
              <div key={index} className="bg-black/80 rounded-xl p-6 border border-gray-700">
                <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
                <div className="text-white text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-gray-500 text-sm">{metric.subtitle}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risk' && riskMetrics && (
          <div className="space-y-6">
            {/* Risk Overview */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Portfolio Risk</div>
                  <div className={`text-xl font-bold ${getRiskColor(riskMetrics.portfolioRisk)}`}>
                    {riskMetrics.portfolioRisk}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Diversification</div>
                  <div className="text-white text-xl font-bold">
                    {riskMetrics.diversificationScore.toFixed(0)}/100
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Concentration Risk</div>
                  <div className="text-white text-xl font-bold">
                    {riskMetrics.concentrationRisk.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Liquidity Score</div>
                  <div className="text-white text-xl font-bold">
                    {riskMetrics.liquidityScore.toFixed(0)}/100
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h4 className="text-white font-medium mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {riskMetrics.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Allocation vs Target */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Allocation vs Target</h3>
              <div className="space-y-4">
                {assetAllocation.map((asset) => (
                  <div key={asset.symbol}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{asset.symbol}</span>
                      <div className="text-right">
                        <span className="text-white">{asset.percentage.toFixed(1)}%</span>
                        <span className="text-gray-400 ml-2">/ {asset.targetAllocation}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, asset.percentage)}%` }}
                      ></div>
                    </div>
                    {asset.rebalanceAmount && Math.abs(asset.rebalanceAmount) > 10 && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-400">Rebalance: </span>
                        <span className={asset.rebalanceAmount > 0 ? 'text-green-400' : 'text-red-400'}>
                          {asset.rebalanceAmount > 0 ? '+' : ''}{formatCurrency(asset.rebalanceAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6">
            {/* Trading Signals */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Trading Signals</h3>
              {tradingSignals.length > 0 ? (
                <div className="space-y-4">
                  {tradingSignals.map((signal, index) => (
                    <div key={index} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium text-lg">{signal.symbol}</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            signal.signal === 'BUY' ? 'bg-green-600 text-white' :
                            signal.signal === 'SELL' ? 'bg-red-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {signal.signal}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">Strength: {signal.strength}/100</div>
                          <div className="text-gray-400 text-sm">Confidence: {signal.confidence}%</div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{signal.reason}</p>
                      <div className="flex gap-4 text-sm">
                        {signal.targetPrice && (
                          <div>
                            <span className="text-gray-400">Target: </span>
                            <span className="text-white">${signal.targetPrice.toFixed(4)}</span>
                          </div>
                        )}
                        {signal.stopLoss && (
                          <div>
                            <span className="text-gray-400">Stop Loss: </span>
                            <span className="text-white">${signal.stopLoss.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>No trading signals available at the moment</p>
                </div>
              )}
            </div>

            {/* Market Insights */}
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Market Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Price Performance (24h)</h4>
                  <div className="space-y-2">
                    {Array.from(prices.values()).map((price) => (
                      <div key={price.symbol} className="flex justify-between items-center">
                        <span className="text-gray-300">{price.symbol}</span>
                        <div className="text-right">
                          <div className="text-white">${price.price.toFixed(4)}</div>
                          <div className={`text-sm ${
                            price.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {formatPercentage(price.change24h)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-3">Volume (24h)</h4>
                  <div className="space-y-2">
                    {Array.from(prices.values()).map((price) => (
                      <div key={price.symbol} className="flex justify-between items-center">
                        <span className="text-gray-300">{price.symbol}</span>
                        <span className="text-white">
                          {price.volume24h > 1000000 
                            ? `$${(price.volume24h / 1000000).toFixed(1)}M`
                            : `$${(price.volume24h / 1000).toFixed(0)}K`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PortfolioAnalytics;