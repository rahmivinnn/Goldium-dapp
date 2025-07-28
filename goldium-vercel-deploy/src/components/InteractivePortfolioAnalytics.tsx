import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../utils/notifications';

interface PortfolioAnalytics {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  topAssets: Array<{
    symbol: string;
    value: number;
    percentage: number;
    change24h: number;
  }>;
  riskScore: number;
  diversificationScore: number;
  performanceMetrics: {
    sharpeRatio: number;
    volatility: number;
    maxDrawdown: number;
    winRate: number;
  };
}

interface ChartData {
  labels: string[];
  values: number[];
}

export const InteractivePortfolioAnalytics: FC = () => {
  const { publicKey } = useWallet();
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'allocation'>('overview');
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/portfolio?address=${publicKey.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setAnalytics(result.data);
        generateChartData(result.data);
      } else {
        notify({ type: 'error', message: result.error || 'Failed to fetch analytics' });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      notify({ type: 'error', message: 'Failed to fetch portfolio analytics' });
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  const generateChartData = (data: PortfolioAnalytics) => {
    // Generate mock historical data based on current analytics
    const days = timeframe === '1D' ? 1 : timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : timeframe === '90D' ? 90 : 365;
    const labels: string[] = [];
    const values: number[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString());
      
      // Generate realistic portfolio value progression
      const baseValue = data.totalValue;
      const volatility = data.performanceMetrics.volatility / 100;
      const trend = data.monthlyChange / 30; // Daily trend
      const randomFactor = (Math.random() - 0.5) * volatility * baseValue;
      const trendFactor = (days - i) * (trend / 100) * baseValue;
      
      values.push(Math.max(0, baseValue - trendFactor + randomFactor));
    }
    
    setChartData({ labels, values });
  };

  useEffect(() => {
    if (publicKey) {
      fetchAnalytics();
    }
  }, [publicKey, fetchAnalytics]);

  useEffect(() => {
    if (analytics) {
      generateChartData(analytics);
    }
  }, [timeframe, analytics]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number): string => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getRiskColor = (score: number): string => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLabel = (score: number): string => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getPerformanceGrade = (sharpeRatio: number): string => {
    if (sharpeRatio >= 2) return 'A+';
    if (sharpeRatio >= 1.5) return 'A';
    if (sharpeRatio >= 1) return 'B+';
    if (sharpeRatio >= 0.5) return 'B';
    if (sharpeRatio >= 0) return 'C';
    return 'D';
  };

  if (!publicKey) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 text-center animate-morphing">
        <div className="text-gray-400 mb-4">🔒</div>
        <h3 className="text-lg font-medium text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your wallet to view detailed portfolio analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 animate-morphing">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 animate-cyber-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white animate-shimmer">📊 Portfolio Analytics</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
              className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none animate-hologram"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-sm bg-gray-700 hover:bg-gray-600 text-white border-none"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Total Value</div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(analytics.totalValue)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Daily Change</div>
              <div className={`text-xl font-bold ${getChangeColor(analytics.dailyChange)}`}>
                {formatPercentage(analytics.dailyChange)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Risk Score</div>
              <div className={`text-xl font-bold ${getRiskColor(analytics.riskScore)}`}>
                {analytics.riskScore.toFixed(0)}/100
              </div>
              <div className="text-xs text-gray-500">
                {getRiskLabel(analytics.riskScore)}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30 animate-hologram">
              <div className="text-sm text-gray-400 mb-1">Performance</div>
              <div className="text-xl font-bold text-white">
                {getPerformanceGrade(analytics.performanceMetrics.sharpeRatio)}
              </div>
              <div className="text-xs text-gray-500">
                Sharpe: {analytics.performanceMetrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 animate-morphing"
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700/50">
          {[
            { id: 'overview', label: '📈 Overview', icon: '📈' },
            { id: 'performance', label: '🎯 Performance', icon: '🎯' },
            { id: 'risk', label: '⚠️ Risk Analysis', icon: '⚠️' },
            { id: 'allocation', label: '🥧 Asset Allocation', icon: '🥧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10 animate-cyber-pulse'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Timeframe Selector */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Portfolio Performance</h3>
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    {['1D', '7D', '30D', '90D', '1Y'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf as any)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          timeframe === tf ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mock Chart */}
                {chartData && (
                  <div className="bg-gray-800/30 rounded-lg p-4 h-64 flex items-end justify-between animate-hologram">
                    {chartData.values.slice(-20).map((value, index) => {
                      const height = (value / Math.max(...chartData.values)) * 200;
                      return (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}px` }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-t from-purple-600 to-blue-500 w-3 rounded-t animate-twinkle"
                          title={`${formatCurrency(value)}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Performance Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-2">Weekly Change</div>
                    <div className={`text-2xl font-bold ${getChangeColor(analytics.weeklyChange)}`}>
                      {formatPercentage(analytics.weeklyChange)}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-2">Monthly Change</div>
                    <div className={`text-2xl font-bold ${getChangeColor(analytics.monthlyChange)}`}>
                      {formatPercentage(analytics.monthlyChange)}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                    <div className="text-sm text-gray-400 mb-2">Diversification</div>
                    <div className="text-2xl font-bold text-white">
                      {analytics.diversificationScore.toFixed(0)}/100
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && analytics && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Sharpe Ratio</span>
                        <span className="text-white font-bold">
                          {analytics.performanceMetrics.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (analytics.performanceMetrics.sharpeRatio / 3) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Volatility</span>
                        <span className="text-white font-bold">
                          {analytics.performanceMetrics.volatility.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, analytics.performanceMetrics.volatility)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Max Drawdown</span>
                        <span className="text-red-400 font-bold">
                          -{analytics.performanceMetrics.maxDrawdown.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${analytics.performanceMetrics.maxDrawdown}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 animate-hologram">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-green-400 font-bold">
                          {analytics.performanceMetrics.winRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${analytics.performanceMetrics.winRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-6 animate-hologram">
                  <h4 className="text-white font-medium mb-3">Performance Grade</h4>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-purple-400 mb-2">
                      {getPerformanceGrade(analytics.performanceMetrics.sharpeRatio)}
                    </div>
                    <p className="text-gray-400">
                      Based on risk-adjusted returns and portfolio metrics
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Risk Analysis Tab */}
            {activeTab === 'risk' && analytics && (
              <motion.div
                key="risk"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Risk Analysis</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 animate-hologram">
                    <h4 className="text-white font-medium mb-4">Overall Risk Score</h4>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getRiskColor(analytics.riskScore)}`}>
                        {analytics.riskScore.toFixed(0)}/100
                      </div>
                      <div className={`text-lg ${getRiskColor(analytics.riskScore)}`}>
                        {getRiskLabel(analytics.riskScore)}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            analytics.riskScore >= 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            analytics.riskScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          style={{ width: `${analytics.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-6 animate-hologram">
                    <h4 className="text-white font-medium mb-4">Diversification Score</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        {analytics.diversificationScore.toFixed(0)}/100
                      </div>
                      <div className="text-lg text-blue-400">
                        {analytics.diversificationScore >= 70 ? 'Well Diversified' :
                         analytics.diversificationScore >= 40 ? 'Moderately Diversified' :
                         'Poorly Diversified'}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${analytics.diversificationScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-6 animate-hologram">
                  <h4 className="text-white font-medium mb-4">Risk Recommendations</h4>
                  <div className="space-y-3">
                    {analytics.riskScore > 70 && (
                      <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-red-400 text-lg">⚠️</span>
                        <div>
                          <div className="text-red-400 font-medium">High Risk Detected</div>
                          <div className="text-gray-300 text-sm">Consider diversifying your portfolio to reduce concentration risk.</div>
                        </div>
                      </div>
                    )}
                    {analytics.diversificationScore < 40 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <span className="text-yellow-400 text-lg">💡</span>
                        <div>
                          <div className="text-yellow-400 font-medium">Improve Diversification</div>
                          <div className="text-gray-300 text-sm">Add more asset classes to improve portfolio balance.</div>
                        </div>
                      </div>
                    )}
                    {analytics.performanceMetrics.volatility > 30 && (
                      <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <span className="text-orange-400 text-lg">📊</span>
                        <div>
                          <div className="text-orange-400 font-medium">High Volatility</div>
                          <div className="text-gray-300 text-sm">Your portfolio shows high price swings. Consider stable assets.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Asset Allocation Tab */}
            {activeTab === 'allocation' && analytics && (
              <motion.div
                key="allocation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Asset Allocation</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Asset List */}
                  <div className="space-y-3">
                    {analytics.topAssets.map((asset, index) => (
                      <motion.div
                        key={asset.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-4 animate-hologram"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                            <span className="font-medium text-white">{asset.symbol}</span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {asset.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">
                            {formatCurrency(asset.value)}
                          </span>
                          <span className={`text-sm ${getChangeColor(asset.change24h)}`}>
                            {formatPercentage(asset.change24h)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${asset.percentage}%` }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Allocation Chart (Mock Pie Chart) */}
                  <div className="bg-gray-800/50 rounded-lg p-6 animate-hologram">
                    <h4 className="text-white font-medium mb-4 text-center">Portfolio Distribution</h4>
                    <div className="relative w-48 h-48 mx-auto">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-spin-slow"></div>
                      <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {analytics.topAssets.length}
                          </div>
                          <div className="text-sm text-gray-400">Assets</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Detailed Analytics (Expandable) */}
      <AnimatePresence>
        {showDetails && analytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 animate-morphing"
          >
            <h3 className="text-lg font-medium text-white mb-4">📋 Detailed Analytics</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-400">Portfolio Metrics</div>
                <div className="bg-gray-800/30 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value:</span>
                    <span className="text-white">{formatCurrency(analytics.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Change:</span>
                    <span className={getChangeColor(analytics.dailyChange)}>
                      {formatPercentage(analytics.dailyChange)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekly Change:</span>
                    <span className={getChangeColor(analytics.weeklyChange)}>
                      {formatPercentage(analytics.weeklyChange)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Change:</span>
                    <span className={getChangeColor(analytics.monthlyChange)}>
                      {formatPercentage(analytics.monthlyChange)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-400">Risk Metrics</div>
                <div className="bg-gray-800/30 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Score:</span>
                    <span className={getRiskColor(analytics.riskScore)}>
                      {analytics.riskScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Diversification:</span>
                    <span className="text-white">{analytics.diversificationScore.toFixed(0)}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility:</span>
                    <span className="text-white">{analytics.performanceMetrics.volatility.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Drawdown:</span>
                    <span className="text-red-400">-{analytics.performanceMetrics.maxDrawdown.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-400">Performance Metrics</div>
                <div className="bg-gray-800/30 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sharpe Ratio:</span>
                    <span className="text-white">{analytics.performanceMetrics.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-green-400">{analytics.performanceMetrics.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Grade:</span>
                    <span className="text-purple-400">
                      {getPerformanceGrade(analytics.performanceMetrics.sharpeRatio)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};