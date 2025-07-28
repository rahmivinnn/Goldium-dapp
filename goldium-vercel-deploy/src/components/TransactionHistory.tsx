import { FC, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { SOLSCAN_CONFIG } from '../config/tokens';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { notify } from '../utils/notifications';

interface Transaction {
  signature: string;
  blockTime: number;
  slot: number;
  status: 'success' | 'failed';
  fee: number;
  type: string;
  amount?: number;
  token?: string;
}

interface TransactionHistoryProps {
  limit?: number;
}

export const TransactionHistory: FC<TransactionHistoryProps> = ({ limit = 10 }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get transaction signatures from Solana RPC
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit },
        'confirmed'
      );

      const txs: Transaction[] = signatures.map(sig => ({
        signature: sig.signature,
        blockTime: sig.blockTime || 0,
        slot: sig.slot,
        status: sig.err ? 'failed' : 'success',
        fee: 0, // Will be populated if needed
        type: 'Unknown', // Will be determined by parsing transaction
      }));

      setTransactions(txs);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transaction history');
      notify({ 
        type: 'error', 
        message: 'Failed to fetch transaction history',
        description: 'Please try again later'
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, limit]);

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey, fetchTransactions]);

  const getSolscanUrl = (signature: string) => {
    const network = networkConfiguration === 'mainnet-beta' ? '' : `?cluster=${networkConfiguration}`;
    return `${SOLSCAN_CONFIG.baseUrl}/tx/${signature}${network}`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  if (!publicKey) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        <p className="text-gray-400">Connect your wallet to view transaction history</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-gray-600/50 shadow-2xl hover-lift neon-blue"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          📜 Transaction History
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchTransactions}
          disabled={isLoading}
          className="p-2 text-gray-300 hover:text-white transition-all duration-300 disabled:opacity-50 rounded-full hover:bg-blue-600/20 neon-blue"
          title="Refresh transactions"
        >
          <svg
            className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {isLoading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <span className="loading loading-spinner loading-lg text-yellow-500"></span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={tx.signature}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 hover:border-yellow-500/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status === 'success' ? '✅' : '❌'} {tx.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(tx.blockTime)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    {truncateSignature(tx.signature)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Slot: {tx.slot.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getSolscanUrl(tx.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white border-none"
                  >
                    🔍 Solscan
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 text-center">
          <a
            href={`${SOLSCAN_CONFIG.baseUrl}/account/${publicKey.toBase58()}${
              networkConfiguration === 'mainnet-beta' ? '' : `?cluster=${networkConfiguration}`
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 text-sm"
          >
            View all transactions on Solscan →
          </a>
        </div>
      )}
    </div>
  );
};