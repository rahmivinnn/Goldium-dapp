# SOL-GOLD DApp Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## Features Implemented

### ✅ Send Tokens
- Send SOL and GOLD tokens to any address
- Automatic token account creation
- Balance validation
- Transaction confirmation

### ✅ Swap Tokens  
- SOL ↔ GOLD swaps using Jupiter
- Real-time price quotes
- Price impact calculation
- Slippage protection

### ✅ Staking
- Stake SOL to earn GOLD rewards
- 30-day lock period
- 3650% APY simulation
- Minimum 1 SOL stake

## Token Configuration

**GOLD Token Contract**: `APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`

**Network**: Solana Mainnet

## File Structure

```
src/
├── components/
│   ├── SendToken.tsx      # Token sending
│   ├── SwapToken.tsx      # Token swapping  
│   └── Staking.tsx        # Staking functionality
├── config/
│   └── tokens.ts          # Token addresses & config
├── stores/
│   └── useTokenBalanceStore.tsx  # Balance management
├── views/
│   └── Dashboard.tsx      # Main dashboard
└── utils/
    └── notifications.tsx  # Notification system
```

## Usage Instructions

1. **Connect Wallet**: Use Phantom, Solflare, or any Solana wallet
2. **Send**: Select token, enter address and amount
3. **Swap**: Choose tokens, enter amount, review quote
4. **Stake**: Enter SOL amount, confirm staking terms

## Troubleshooting

- Ensure wallet is connected to Solana Mainnet
- Check SOL balance for transaction fees
- Verify GOLD token contract address
- Refresh page if wallet connection fails

## Next Steps

1. Deploy to production
2. Add more token pairs
3. Implement real staking contracts
4. Add analytics and charts 