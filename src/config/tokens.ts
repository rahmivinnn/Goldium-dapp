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
    logoURI: '/images/sol-logo.png',
  },
  GOLD: {
    symbol: 'GOLD',
    name: 'Goldium',
    decimals: 6,
    mint: 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump', // Your GOLD token contract address
    logoURI: '/images/gold-logo.png',
  },
} as const;

// Jupiter API Configuration
export const JUPITER_CONFIG = {
  quoteApi: 'https://quote-api.jup.ag/v6',
  swapApi: 'https://quote-api.jup.ag/v6',
  tokenListApi: 'https://token.jup.ag/strict',
};

// Staking Configuration
export const STAKING_CONFIG = {
  poolAddress: '', // Will be set when creating stake pool
  rewardToken: TOKENS.GOLD.mint,
  lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  minStakeAmount: 1, // Minimum SOL to stake
};

// RPC Endpoints
export const RPC_ENDPOINTS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

// Helper functions
export const getTokenMint = (symbol: keyof typeof TOKENS): PublicKey => {
  return new PublicKey(TOKENS[symbol].mint);
};

export const getTokenDecimals = (symbol: keyof typeof TOKENS): number => {
  return TOKENS[symbol].decimals;
}; 