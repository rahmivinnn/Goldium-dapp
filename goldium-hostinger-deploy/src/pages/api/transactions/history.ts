import type { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';

interface Transaction {
  signature: string;
  timestamp: number;
  type: 'SWAP' | 'SEND' | 'RECEIVE' | 'STAKE' | 'UNSTAKE' | 'REWARD';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  token: string;
  fromAddress?: string;
  toAddress?: string;
  fee: number;
  blockTime: number;
  slot: number;
  confirmations: number;
  details?: {
    swapDetails?: {
      fromToken: string;
      toToken: string;
      fromAmount: number;
      toAmount: number;
      slippage: number;
    };
    stakeDetails?: {
      validator: string;
      epoch: number;
      rewards: number;
    };
  };
}

interface TransactionStats {
  totalTransactions: number;
  successRate: number;
  totalVolume: number;
  totalFees: number;
  averageTransactionSize: number;
  transactionsByType: Record<string, number>;
  dailyActivity: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}

interface ApiResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    stats: TransactionStats;
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  };
  error?: string;
}

// Mock transaction generator
function generateMockTransaction(index: number): Transaction {
  const types: Transaction['type'][] = ['SWAP', 'SEND', 'RECEIVE', 'STAKE', 'UNSTAKE', 'REWARD'];
  const tokens = ['SOL', 'GOLD', 'USDC', 'BTC', 'ETH'];
  const type = types[Math.floor(Math.random() * types.length)];
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const timestamp = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Last 30 days
  
  const transaction: Transaction = {
    signature: `${Math.random().toString(36).substring(2)}${index}${Math.random().toString(36).substring(2)}`,
    timestamp,
    type,
    status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILED', // 95% success rate
    amount: Math.random() * 1000 + 0.1,
    token,
    fee: Math.random() * 0.01 + 0.000005,
    blockTime: timestamp,
    slot: Math.floor(Math.random() * 1000000) + 150000000,
    confirmations: Math.floor(Math.random() * 100) + 1
  };

  // Add type-specific details
  if (type === 'SWAP') {
    const fromToken = token;
    const toTokens = tokens.filter(t => t !== fromToken);
    const toToken = toTokens[Math.floor(Math.random() * toTokens.length)];
    
    transaction.details = {
      swapDetails: {
        fromToken,
        toToken,
        fromAmount: transaction.amount,
        toAmount: transaction.amount * (Math.random() * 2 + 0.5),
        slippage: Math.random() * 3
      }
    };
  } else if (type === 'STAKE' || type === 'UNSTAKE') {
    transaction.details = {
      stakeDetails: {
        validator: `Validator${Math.floor(Math.random() * 100) + 1}`,
        epoch: Math.floor(Math.random() * 500) + 300,
        rewards: type === 'UNSTAKE' ? Math.random() * 10 : 0
      }
    };
  }

  if (type === 'SEND') {
    transaction.toAddress = `${Math.random().toString(36).substring(2)}...${Math.random().toString(36).substring(2, 6)}`;
  } else if (type === 'RECEIVE') {
    transaction.fromAddress = `${Math.random().toString(36).substring(2)}...${Math.random().toString(36).substring(2, 6)}`;
  }

  return transaction;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { address, page = '1', limit = '20', type } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ success: false, error: 'Wallet address is required' });
    }

    // Validate Solana address
    try {
      new PublicKey(address);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid Solana address' });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ success: false, error: 'Invalid pagination parameters' });
    }

    // Generate mock transactions
    const totalTransactions = Math.floor(Math.random() * 500) + 100;
    const allTransactions = Array.from({ length: totalTransactions }, (_, i) => generateMockTransaction(i));
    
    // Filter by type if specified
    let filteredTransactions = allTransactions;
    if (type && typeof type === 'string') {
      filteredTransactions = allTransactions.filter(tx => tx.type === type.toUpperCase());
    }

    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // Paginate
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Calculate stats
    const successfulTxs = allTransactions.filter(tx => tx.status === 'SUCCESS');
    const transactionsByType = allTransactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate daily activity for last 7 days
    const dailyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toISOString().split('T')[0],
        count: dayTransactions.length,
        volume: dayTransactions.reduce((sum, tx) => sum + tx.amount, 0)
      };
    }).reverse();

    const stats: TransactionStats = {
      totalTransactions: allTransactions.length,
      successRate: (successfulTxs.length / allTransactions.length) * 100,
      totalVolume: successfulTxs.reduce((sum, tx) => sum + tx.amount, 0),
      totalFees: allTransactions.reduce((sum, tx) => sum + tx.fee, 0),
      averageTransactionSize: successfulTxs.reduce((sum, tx) => sum + tx.amount, 0) / successfulTxs.length,
      transactionsByType,
      dailyActivity
    };

    const response = {
      transactions: paginatedTransactions,
      stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredTransactions.length,
        hasMore: endIndex < filteredTransactions.length
      }
    };

    // Add cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}