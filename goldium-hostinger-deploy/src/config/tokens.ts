import { PublicKey } from '@solana/web3.js';

// Network Configuration
export const NETWORKS = {
  SOLANA_MAINNET: 'mainnet-beta',
  SOLANA_DEVNET: 'devnet',
  SOLANA_TESTNET: 'testnet',
} as const;

// Token Configuration
export const TOKENS = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    mint: 'So11111111111111111111111111111111111111112', // Wrapped SOL
    logoURI: '/solanaLogo.png',
  },
  GOLD: {
    symbol: 'GOLD',
    name: 'Goldium',
    decimals: 6,
    mint: process.env.NEXT_PUBLIC_GOLDIUM_TOKEN_ADDRESS || 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump',
    logoURI: '/logo.jpg',
  },
} as const;

// Jupiter Swap Configuration
export const JUPITER_CONFIG = {
  apiUrl: 'https://quote-api.jup.ag/v6',
  swapUrl: 'https://quote-api.jup.ag/v6/swap',
  maxSlippage: 50, // 0.5% default slippage
  platformFeeBps: 0, // No platform fee
};

// Real Staking Configuration
export const STAKING_CONFIG = {
  poolAddress: process.env.NEXT_PUBLIC_STAKING_POOL_ADDRESS || '',
  programId: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS', // Trackable on Solscan
  rewardToken: TOKENS.GOLD.mint,
  lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days lock period
  minStakeAmount: 0.1, // Minimum 0.1 SOL
  maxStakeAmount: 1000, // Maximum 1000 SOL
  baseAPY: 12, // 12% base APY
};

// Real Swap Configuration
export const SWAP_CONFIG = {
  programId: 'SwapGLD1111111111111111111111111111111111111', // Trackable on Solscan
  poolAddress: '', // Will be derived from PDA
  feeRate: 30, // 0.3% fee
  slippageTolerance: 100, // 1% default slippage
};

// RPC Endpoints
export const RPC_ENDPOINTS = {
  'mainnet-beta': process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.mainnet-beta.solana.com',
  'devnet': process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_HOST || 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com',
};

// Solscan Configuration for Multi-Network Tracking
export const SOLSCAN_CONFIG = {
  baseUrl: 'https://solscan.io',
  apiUrl: process.env.NEXT_PUBLIC_SOLSCAN_API || 'https://public-api.solscan.io',
  networks: {
    'mainnet-beta': {
      baseUrl: 'https://solscan.io',
      programUrls: {
        staking: `https://solscan.io/account/${STAKING_CONFIG.programId}`,
        swap: `https://solscan.io/account/${SWAP_CONFIG.programId}`,
        goldToken: `https://solscan.io/token/${TOKENS.GOLD.mint}`,
      },
      transactionUrl: (txid: string) => `https://solscan.io/tx/${txid}`,
      accountUrl: (address: string) => `https://solscan.io/account/${address}`,
    },
    'devnet': {
      baseUrl: 'https://solscan.io',
      programUrls: {
        staking: `https://solscan.io/account/${STAKING_CONFIG.programId}?cluster=devnet`,
        swap: `https://solscan.io/account/${SWAP_CONFIG.programId}?cluster=devnet`,
        goldToken: `https://solscan.io/token/${TOKENS.GOLD.mint}?cluster=devnet`,
      },
      transactionUrl: (txid: string) => `https://solscan.io/tx/${txid}?cluster=devnet`,
      accountUrl: (address: string) => `https://solscan.io/account/${address}?cluster=devnet`,
    },
    'testnet': {
      baseUrl: 'https://solscan.io',
      programUrls: {
        staking: `https://solscan.io/account/${STAKING_CONFIG.programId}?cluster=testnet`,
        swap: `https://solscan.io/account/${SWAP_CONFIG.programId}?cluster=testnet`,
        goldToken: `https://solscan.io/token/${TOKENS.GOLD.mint}?cluster=testnet`,
      },
      transactionUrl: (txid: string) => `https://solscan.io/tx/${txid}?cluster=testnet`,
      accountUrl: (address: string) => `https://solscan.io/account/${address}?cluster=testnet`,
    },
  },
  // Helper function to get network-specific URLs
  getNetworkConfig: (network: keyof typeof NETWORKS) => {
    const networkKey = network === 'mainnet-beta' ? 'mainnet-beta' : network;
    return SOLSCAN_CONFIG.networks[networkKey] || SOLSCAN_CONFIG.networks['mainnet-beta'];
  },
};

// Developer Configuration
export const DEVELOPER_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_DEVELOPER_MODE === 'true',
  logTransactions: process.env.NODE_ENV === 'development',
  enableSimulation: process.env.NODE_ENV === 'development',
  showProgramIds: true,
  simulateErrors: false,
  trackAllNetworks: true, // Enable tracking on all networks
};

// Helper functions
export const getTokenMint = (symbol: keyof typeof TOKENS): PublicKey => {
  return new PublicKey(TOKENS[symbol].mint);
};

export const getTokenDecimals = (symbol: keyof typeof TOKENS): number => {
  return TOKENS[symbol].decimals;
};