import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js';

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

// Real transaction fetcher from Solana blockchain
export async function getTransactionHistory(
  walletAddress: string,
  page: number = 1,
  limit: number = 20,
  type?: Transaction['type']
): Promise<{
  transactions: Transaction[];
  stats: TransactionStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}> {
  try {
    // Get connection from environment or use default
    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
    );

    // Fetch real transaction signatures from blockchain
    const publicKey = new PublicKey(walletAddress);
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: Math.min(limit * 5, 1000) // Fetch more to account for filtering
    });

    // Convert signatures to transaction objects
    const allTransactions: Transaction[] = [];
    
    for (const sigInfo of signatures) {
      try {
        // Get transaction details
        const txDetails = await connection.getTransaction(sigInfo.signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        });
        
        if (!txDetails) continue;
        
        // Parse transaction to determine type and details
        const transaction = parseTransactionDetails(txDetails, sigInfo, walletAddress);
        if (transaction) {
          allTransactions.push(transaction);
        }
      } catch (error) {
        console.error(`Error fetching transaction ${sigInfo.signature}:`, error);
        continue;
      }
    }

    // Filter by type if specified
    const filteredTransactions = type 
      ? allTransactions.filter(tx => tx.type === type)
      : allTransactions;

    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Calculate stats
    const successfulTxs = allTransactions.filter(tx => tx.status === 'SUCCESS');
    const transactionsByType = allTransactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate daily activity for last 7 days
    const dailyActivity = generateDailyActivityFromTransactions(allTransactions);

    const stats: TransactionStats = {
      totalTransactions: allTransactions.length,
      successRate: allTransactions.length > 0 ? (successfulTxs.length / allTransactions.length) * 100 : 0,
      totalVolume: successfulTxs.reduce((sum, tx) => sum + tx.amount, 0),
      totalFees: allTransactions.reduce((sum, tx) => sum + tx.fee, 0),
      averageTransactionSize: successfulTxs.length > 0 ? successfulTxs.reduce((sum, tx) => sum + tx.amount, 0) / successfulTxs.length : 0,
      transactionsByType,
      dailyActivity
    };
    
    return {
      transactions: paginatedTransactions,
      stats,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        hasMore: endIndex < filteredTransactions.length
      }
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw new Error('Failed to fetch transaction history');
  }
}

// Helper function to parse transaction details from blockchain data
function parseTransactionDetails(txDetails: any, sigInfo: any, walletAddress: string): Transaction | null {
  try {
    const transaction: Transaction = {
      signature: sigInfo.signature,
      timestamp: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
      type: parseTransactionType(txDetails),
      status: sigInfo.err ? 'FAILED' : 'SUCCESS',
      amount: parseTransactionAmount(txDetails, walletAddress),
      token: 'SOL', // Default to SOL, TODO: detect other tokens
      fee: (txDetails.meta?.fee || 0) / 1000000000, // Convert lamports to SOL
      blockTime: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
      slot: sigInfo.slot,
      confirmations: sigInfo.confirmationStatus === 'finalized' ? 32 : 1,
      fromAddress: parseFromAddress(txDetails, walletAddress),
      toAddress: parseToAddress(txDetails, walletAddress)
    };
    
    return transaction;
  } catch (error) {
    console.error('Error parsing transaction details:', error);
    return null;
  }
}

// Helper function to parse transaction type
function parseTransactionType(txDetails: any): Transaction['type'] {
  // Simplified transaction type detection
  // In a real implementation, you would analyze the instructions
  const instructions = txDetails.transaction.message.instructions || [];
  
  // Check for common program IDs to determine transaction type
  for (const instruction of instructions) {
    const programId = txDetails.transaction.message.accountKeys[instruction.programIdIndex]?.toString();
    
    if (programId === '11111111111111111111111111111111') {
      return 'SEND'; // System program transfer
    }
    // Add more program ID checks for SWAP, STAKE, etc.
  }
  
  return 'SEND'; // Default fallback
}

// Helper function to parse transaction amount
function parseTransactionAmount(txDetails: any, walletAddress?: string): number {
  // Simplified amount parsing
  // In a real implementation, you would analyze the account balance changes
  const preBalances = txDetails.meta?.preBalances || [];
  const postBalances = txDetails.meta?.postBalances || [];
  const accountKeys = txDetails.transaction?.message?.accountKeys || [];
  
  if (walletAddress && accountKeys.length > 0) {
    // Find the wallet's account index
    const walletIndex = accountKeys.findIndex((key: any) => 
      key.toString() === walletAddress
    );
    
    if (walletIndex >= 0 && preBalances[walletIndex] !== undefined && postBalances[walletIndex] !== undefined) {
      const balanceChange = Math.abs(postBalances[walletIndex] - preBalances[walletIndex]);
      return balanceChange / 1000000000; // Convert lamports to SOL
    }
  }
  
  if (preBalances.length > 0 && postBalances.length > 0) {
    const balanceChange = Math.abs(preBalances[0] - postBalances[0]);
    return balanceChange / 1000000000; // Convert lamports to SOL
  }
  
  return 0;
}

// Helper function to parse from address
function parseFromAddress(txDetails: any, walletAddress: string): string {
  return walletAddress;
}

// Helper function to parse to address
function parseToAddress(txDetails: any, walletAddress: string): string | undefined {
  const accountKeys = txDetails.transaction?.message?.accountKeys || [];
  
  // For SystemProgram transfers, the recipient is usually the second account
  if (accountKeys.length > 1) {
    const recipient = accountKeys[1]?.toString();
    return recipient !== walletAddress ? recipient : undefined;
  }
  
  return undefined;
}

// Helper function to generate daily activity from real transactions
function generateDailyActivityFromTransactions(transactions: Transaction[]): Array<{date: string, count: number, volume: number}> {
  const dailyData: Record<string, {count: number, volume: number}> = {};
  
  // Group transactions by date
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { count: 0, volume: 0 };
    }
    dailyData[date].count++;
    dailyData[date].volume += tx.amount;
  });
  
  // Generate array for last 7 days
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push({
      date: dateStr,
      count: dailyData[dateStr]?.count || 0,
      volume: dailyData[dateStr]?.volume || 0
    });
  }
  
  return result;
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

    // Create Solana connection
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    const publicKey = new PublicKey(address);
    
    // Fetch real transactions from Solana blockchain
    const allTransactions = await fetchRealTransactions(connection, publicKey, 100);
    
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
    const dailyActivity = generateDailyActivityFromTransactions(allTransactions);

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