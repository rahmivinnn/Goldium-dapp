
# Goldium DApp - Advanced Solana Token Management Platform

![Goldium Logo](https://via.placeholder.com/200x80/FFD700/000000?text=GOLDIUM)

## 🌟 Overview

Goldium is a comprehensive decentralized application (DApp) built on the Solana blockchain, providing users with advanced token management capabilities for SOL and GOLD tokens. The platform offers real-time balance tracking, token transfers, swapping, staking, and transaction history - all with support for both Mainnet and Devnet environments.

## ✨ Features

### 🔗 Wallet Integration
- **Multi-Wallet Support**: Phantom, Solflare, TrustWallet (desktop & mobile)
- **Auto-Connect**: Seamless wallet detection and connection
- **Network Switching**: Dynamic switching between Mainnet and Devnet
- **Real-time Balance**: Live SOL & GOLD token balance updates

### 💰 Balance Tracker
- **Real-time Updates**: Auto-refresh every 30 seconds
- **USD Valuation**: Mock pricing for portfolio tracking
- **Portfolio Overview**: Total value calculation
- **Network Status**: Current network and last update time

### 📤 Token Transfer
- **Multi-Token Support**: Send SOL and GOLD tokens
- **Smart Validation**: Address validation and balance checks
- **Fee Estimation**: Automatic network fee calculation
- **Confirmation Dialog**: Transaction preview before execution
- **MAX Button**: Quick balance selection

### 🔄 Token Swapping
- **Jupiter Integration**: Real swaps using Jupiter Aggregator
- **Slippage Control**: Customizable slippage settings (0.1%, 0.5%, 1.0%)
- **Price Impact**: Real-time price impact calculation
- **Quote Comparison**: Best route selection
- **Demo Mode**: Simulated swaps for testing

### 🔒 Staking System
- **GOLD Staking**: Stake GOLD tokens for rewards
- **Dynamic APY**: Real-time APY calculation (5-15%)
- **Lock Period**: 7-day minimum staking period
- **Reward Tracking**: Real-time pending rewards
- **Auto-Compound**: Optional reward reinvestment

### 📋 Transaction History
- **Complete History**: All wallet transactions
- **Solscan Integration**: Direct links to transaction details
- **Network Filtering**: Mainnet/Devnet transaction separation
- **Real-time Updates**: Latest transaction tracking

### 🛠️ Developer Features
- **Developer Mode**: Toggle for testing and debugging
- **Transaction Simulation**: Mock transactions for development
- **Console Logging**: Detailed transaction payloads
- **Error Simulation**: Test error handling scenarios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- Solana wallet (Phantom, Solflare, or TrustWallet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/goldium-dapp.git
   cd goldium-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   ```env
   # Solana Network Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET=https://api.devnet.solana.com
   
   # Token Configuration
   NEXT_PUBLIC_GOLDIUM_TOKEN_ADDRESS=YOUR_GOLD_TOKEN_MINT_ADDRESS
   
   # Jupiter API
   NEXT_PUBLIC_JUPITER_API_MAINNET=https://quote-api.jup.ag/v6
   NEXT_PUBLIC_JUPITER_API_DEVNET=https://quote-api.jup.ag/v6
   
   # Solscan Integration
   NEXT_PUBLIC_SOLSCAN_API=https://solscan.io
   
   # Developer Mode
   NEXT_PUBLIC_DEVELOPER_MODE=false
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open Application**
   Navigate to `http://localhost:3000`

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t goldium-dapp .

# Run the container
docker run -p 3000:3000 goldium-dapp
```

### Docker Compose

```yaml
version: '3.8'
services:
  goldium-dapp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
      - NEXT_PUBLIC_GOLDIUM_TOKEN_ADDRESS=YOUR_TOKEN_ADDRESS
    restart: unless-stopped
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **APIs**: Jupiter Aggregator, Solscan

### Project Structure
```
src/
├── components/          # React components
│   ├── AppBar.tsx      # Navigation and wallet connection
│   ├── BalanceTracker.tsx  # Real-time balance display
│   ├── NetworkSwitcher.tsx # Network selection
│   ├── SendToken.tsx   # Token transfer functionality
│   ├── SwapToken.tsx   # Token swapping interface
│   ├── Staking.tsx     # Staking management
│   └── TransactionHistory.tsx # Transaction history
├── contexts/           # React contexts
│   ├── ContextProvider.tsx # Wallet and connection providers
│   └── NetworkConfigurationProvider.tsx # Network management
├── stores/             # State management
│   └── useTokenBalanceStore.tsx # Balance tracking store
├── config/             # Configuration files
│   └── tokens.ts       # Token and network configuration
├── utils/              # Utility functions
│   └── notifications.ts # Toast notifications
├── views/              # Page components
│   └── Dashboard.tsx   # Main dashboard
└── pages/              # Next.js pages
    ├── index.tsx       # Landing page
    └── dapp.tsx        # DApp interface
```

## 🔧 Configuration

### Network Configuration
The DApp supports both Solana Mainnet and Devnet:

- **Mainnet**: Production environment with real tokens
- **Devnet**: Testing environment with test tokens

### Token Configuration
Configure your GOLD token in `src/config/tokens.ts`:

```typescript
export const TOKENS = {
  SOL: {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: '/solana-logo.png'
  },
  GOLD: {
    mint: process.env.NEXT_PUBLIC_GOLDIUM_TOKEN_ADDRESS!,
    symbol: 'GOLD',
    name: 'Goldium',
    decimals: 9,
    logoURI: '/goldium-logo.png'
  }
};
```

## 🔐 Security Features

- **No Private Key Storage**: Wallets handle all private key management
- **Transaction Confirmation**: User approval required for all transactions
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Graceful error handling and user feedback
- **Network Verification**: Automatic network validation

## 🧪 Testing

### Developer Mode
Enable developer mode for testing:

```env
NEXT_PUBLIC_DEVELOPER_MODE=true
```

Features in developer mode:
- Transaction simulation
- Console logging
- Mock data for testing
- Error simulation

### Manual Testing
1. Connect wallet on Devnet
2. Test token transfers with small amounts
3. Verify transaction history
4. Test staking functionality
5. Validate swap operations

## 📱 Mobile Support

- **Responsive Design**: Optimized for mobile devices
- **Mobile Wallets**: Support for mobile wallet apps
- **Touch Interactions**: Mobile-friendly UI components
- **Progressive Web App**: PWA capabilities for mobile installation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord/Telegram for support

## 🗺️ Roadmap

- [ ] Multi-token support beyond SOL/GOLD
- [ ] Advanced charting and analytics
- [ ] Governance token integration
- [ ] NFT marketplace integration
- [ ] Cross-chain bridge support
- [ ] Mobile app development

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. Always verify transactions on Solscan before confirming. Never share your private keys or seed phrases.

---

**Built with ❤️ for the Solana ecosystem**

For more information, visit [Goldium.io](https://goldium.io)

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
