
# SOL-GOLD DApp

A comprehensive decentralized application for sending, swapping, and staking SOL and GOLD tokens on the Solana mainnet.

## Features

### 🚀 Send Tokens
- Send SOL and GOLD tokens to any Solana address
- Automatic token account creation for recipients
- Real-time balance updates
- Transaction confirmation and notifications

### 🔄 Swap Tokens
- Swap between SOL and GOLD tokens using Jupiter aggregator
- Real-time price quotes
- Price impact calculation
- Slippage protection (0.5%)

### 🔒 Staking
- Stake SOL to earn GOLD rewards
- 30-day lock period
- 10% daily reward rate (3650% APY)
- Minimum stake: 1 SOL

## Token Information

- **SOL**: Native Solana token (9 decimals)
- **GOLD**: Goldium token (6 decimals)
- **GOLD Contract Address**: `APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`

## Prerequisites

- Node.js 16 or higher
- A Solana wallet (Phantom, Solflare, etc.)
- SOL tokens for transactions and staking
- GOLD tokens for sending/swapping

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dapp-scaffold-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Connecting Wallet
1. Click "Connect Wallet" button
2. Select your preferred Solana wallet
3. Approve the connection

### Sending Tokens
1. Navigate to the "Send" tab
2. Select the token type (SOL or GOLD)
3. Enter the recipient's Solana address
4. Enter the amount to send
5. Click "Send [Token]"
6. Approve the transaction in your wallet

### Swapping Tokens
1. Navigate to the "Swap" tab
2. Select the token you want to swap from
3. Select the token you want to swap to
4. Enter the amount to swap
5. Review the quote and price impact
6. Click "Swap"
7. Approve the transaction in your wallet

### Staking SOL
1. Navigate to the "Staking" tab
2. Enter the amount of SOL you want to stake (minimum 1 SOL)
3. Review the staking terms and APY
4. Click "Stake SOL"
5. Approve the transaction in your wallet

## Technical Details

### Dependencies
- **@solana/web3.js**: Solana blockchain interaction
- **@solana/spl-token**: SPL token operations
- **@jup-ag/core**: Jupiter aggregator for swaps
- **@solana/wallet-adapter-react**: Wallet connection
- **Next.js**: React framework
- **Tailwind CSS**: Styling
- **DaisyUI**: UI components

### Network Configuration
- **Network**: Solana Mainnet
- **RPC Endpoint**: https://api.mainnet-beta.solana.com
- **Jupiter API**: https://quote-api.jup.ag/v6

### Security Features
- Input validation for all forms
- Balance checks before transactions
- Slippage protection for swaps
- Transaction confirmation handling
- Error handling and user notifications

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── SendToken.tsx   # Token sending functionality
│   ├── SwapToken.tsx   # Token swapping functionality
│   └── Staking.tsx     # Staking functionality
├── config/
│   └── tokens.ts       # Token and network configuration
├── stores/
│   └── useTokenBalanceStore.tsx  # Token balance management
├── views/
│   └── Dashboard.tsx   # Main dashboard view
└── utils/
    └── notifications.ts # Notification utilities
```

### Adding New Features
1. Create new components in `src/components/`
2. Add configuration in `src/config/`
3. Update stores if needed
4. Integrate into the Dashboard view

## Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure your wallet is installed and unlocked
- Check if you're on the correct network (Solana Mainnet)
- Try refreshing the page

**Transaction Failed**
- Check your SOL balance for transaction fees
- Ensure you have sufficient token balance
- Verify the recipient address is valid

**Swap Quote Not Available**
- Check if there's sufficient liquidity
- Try a smaller amount
- Ensure both tokens are supported

**Staking Not Working**
- Ensure you have at least 1 SOL
- Check if the staking pool is active
- Verify your wallet is connected

### Error Messages
- "Insufficient balance": Add more tokens to your wallet
- "Invalid address": Check the recipient address format
- "Transaction failed": Check network connection and try again
- "Quote not available": Try a different amount or token pair

## Support

For technical support or questions:
- Check the console for detailed error messages
- Verify your wallet connection
- Ensure you have sufficient SOL for transaction fees

## License

MIT License - see LICENSE file for details

## Disclaimer

This DApp is for educational and demonstration purposes. Always verify transactions and token addresses before sending funds. The staking functionality is simulated and does not represent actual on-chain staking.
