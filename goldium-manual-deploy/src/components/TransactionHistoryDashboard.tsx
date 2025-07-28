import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../utils/notifications';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'reward';
  amount: number;
  token: string;
  toToken?: string;
  toAmount?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  fee: number;
  from?: string;
  to?: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  successRate: number;
  avgTransactionSize: number;
  mostActiveToken: string;
}

interface TransactionHistoryData {
  transactions: Transaction[];
  stats: TransactionStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const TransactionHistoryDashboard: FC = () => {
  const { publicKey } = useWallet();
  const [data, setData] = useState<TransactionHistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'reward'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'fee'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async (resetPage = false) => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const params = new URLSearchParams({
        address: publicKey.toString(),
        page: currentPage.toString(),
        limit: '10',
        ...(filter !== 'all' && { type: filter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/transactions/history?${params}`);
      const result = await response.json();
      
      if (result.success) {
        if (resetPage) {
          setData(result.data);
          setPage(1);
        } else {
          setData(prev => prev ? {
            ...result.data,
            transactions: [...prev.transactions, ...result.data.transactions]
          } : result.data);
        }
      } else {
        notify({ type: 'error', message: result.error || 'Failed to fetch transactions' });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      notify({ type: 'error', message: 'Failed to fetch transaction history' });
    } finally {
      setLoading(false);
    }
  }, [publicKey, page, filter, searchTerm]);

  useEffect(() => {
    if (publicKey) {
      fetchTransactions(true);
    }
  }, [publicKey, filter, searchTerm]);

  const loadMore = () => {
    if (data?.pagination.hasMore && !loading) {
      setPage(prev => prev + 1);
      setTimeout(() => fetchTransactions(), 100);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case 'send': return '📤';
      case 'receive': return '📥';
      case 'swap': return '🔄';
      case 'stake': return '🔒';
      case 'unstake': return '🔓';
      case 'reward': return '🎁';
      default: return '💰';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'send': return 'text-red-400';
      case 'receive': return 'text-green-400';
      case 'swap': return 'text-blue-400';
      case 'stake': return 'text-purple-400';
      case 'unstake': return 'text-orange-400';
      case 'reward': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const truncateHash = (hash: string): string => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify({ type: 'success', message: 'Copied to clipboard!' });
  };

  const openInExplorer = (hash: string) => {
    window.open(`https://solscan.io/tx/${hash}`, '_blank');
  };

  if (!publicKey) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 text-center animate-morphing">
        <div className="text-gray-400 mb-4">🔒</div>
        <h3 className="text-lg font-medium text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your wallet to view transaction history</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6 animate-cyber-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white animate-shimmer">📊 Transaction History</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTransactions(true)}
              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none animate-hologram"
              disabled={loading}
            >
              {loading ? '🔄' : '🔄'} Refresh
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn btn-sm bg-gray-700 hover:bg-gray-600 text-white border-none"
            >
              {showStats ? 'Hide' : 'Show'} Stats
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <AnimatePresence>
          {showStats && data?.stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              <div className="bg-gray-800/50 rounded-lg p-3 border border-blue-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Total Transactions</div>
                <div className="text-lg font-bold text-white">
                  {data.stats.totalTransactions.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 border border-green-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Total Volume</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(data.stats.totalVolume)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 border border-yellow-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Total Fees</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(data.stats.totalFees)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 border border-purple-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Success Rate</div>
                <div className="text-lg font-bold text-green-400">
                  {data.stats.successRate.toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 border border-orange-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Avg Size</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(data.stats.avgTransactionSize)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 border border-pink-500/30 animate-hologram">
                <div className="text-xs text-gray-400 mb-1">Top Token</div>
                <div className="text-lg font-bold text-white">
                  {data.stats.mostActiveToken}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-4 animate-morphing"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by hash, token, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="send">Send</option>
              <option value="receive">Receive</option>
              <option value="swap">Swap</option>
              <option value="stake">Stake</option>
              <option value="unstake">Unstake</option>
              <option value="reward">Reward</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="fee-desc">Highest Fee</option>
              <option value="fee-asc">Lowest Fee</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 animate-morphing"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Transactions</h3>
          
          {loading && !data && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {data?.transactions && (
            <div className="space-y-3">
              {data.transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer animate-hologram"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium capitalize ${getTypeColor(tx.type)}`}>
                            {tx.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusBg(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {formatDate(tx.timestamp)}
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(tx.hash);
                            }}
                            className="hover:text-purple-400 transition-colors"
                          >
                            {truncateHash(tx.hash)} 📋
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white mb-1">
                        {tx.type === 'swap' && tx.toToken ? (
                          <div>
                            <div className="text-red-400">-{tx.amount} {tx.token}</div>
                            <div className="text-green-400">+{tx.toAmount} {tx.toToken}</div>
                          </div>
                        ) : (
                          <span className={tx.type === 'send' ? 'text-red-400' : 'text-green-400'}>
                            {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        Fee: {tx.fee} SOL
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInExplorer(tx.hash);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1"
                      >
                        View on Explorer 🔗
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Load More Button */}
              {data.pagination.hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="btn bg-purple-600 hover:bg-purple-700 text-white border-none animate-hologram"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Loading...
                      </span>
                    ) : (
                      'Load More Transactions'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {data?.transactions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📭</div>
              <div className="text-gray-400">No transactions found</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-md w-full animate-morphing"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getTransactionIcon(selectedTransaction.type)}</div>
                  <div>
                    <div className={`font-medium capitalize ${getTypeColor(selectedTransaction.type)}`}>
                      {selectedTransaction.type}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getStatusBg(selectedTransaction.status)} inline-block`}>
                      {selectedTransaction.status}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">
                      {selectedTransaction.amount} {selectedTransaction.token}
                    </span>
                  </div>
                  
                  {selectedTransaction.toToken && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Received:</span>
                      <span className="text-white font-medium">
                        {selectedTransaction.toAmount} {selectedTransaction.toToken}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee:</span>
                    <span className="text-white">{selectedTransaction.fee} SOL</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{formatDate(selectedTransaction.timestamp)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-xs">
                        {truncateHash(selectedTransaction.hash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.hash)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  
                  {selectedTransaction.from && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">From:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-xs">
                          {truncateHash(selectedTransaction.from)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.from!)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedTransaction.to && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">To:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-xs">
                          {truncateHash(selectedTransaction.to)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.to!)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => openInExplorer(selectedTransaction.hash)}
                    className="flex-1 btn bg-purple-600 hover:bg-purple-700 text-white border-none"
                  >
                    View on Explorer 🔗
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.hash)}
                    className="btn bg-gray-700 hover:bg-gray-600 text-white border-none"
                  >
                    Copy Hash 📋
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};