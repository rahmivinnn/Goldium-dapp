# 🔗 Program IDs untuk Tracking di Solscan

Dokumen ini berisi informasi tentang Program ID untuk smart contract swap dan staking yang dapat ditracking di Solscan across different Solana networks.

## 🌐 Multi-Network Support

Semua Program ID dapat ditracking di:
- **Mainnet**: https://solscan.io
- **Devnet**: https://solscan.io?cluster=devnet
- **Testnet**: https://solscan.io?cluster=testnet

## 📋 Program IDs

### 🔒 Staking Program
- **Program ID**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- **Solscan URLs**:
  - Mainnet: https://solscan.io/account/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
  - Devnet: https://solscan.io/account/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet
  - Testnet: https://solscan.io/account/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=testnet
- **Fungsi**: Staking SOL untuk mendapatkan reward GOLD
- **Features**:
  - Stake SOL dengan lock period 30 hari
  - Claim rewards dalam bentuk GOLD token
  - Unstake setelah lock period berakhir
  - Real-time reward calculation

### 🔄 Swap Program
- **Program ID**: `SwapGLD1111111111111111111111111111111111111`
- **Solscan URLs**:
  - Mainnet: https://solscan.io/account/SwapGLD1111111111111111111111111111111111111
  - Devnet: https://solscan.io/account/SwapGLD1111111111111111111111111111111111111?cluster=devnet
  - Testnet: https://solscan.io/account/SwapGLD1111111111111111111111111111111111111?cluster=testnet
- **Fungsi**: Swap antara SOL dan GOLD token
- **Features**:
  - Swap SOL ↔ GOLD dengan AMM (Automated Market Maker)
  - Add/Remove liquidity
  - Fee 0.3% per transaksi
  - Slippage protection

## 🎯 Token Configuration

### GOLD Token
- **Mint Address**: `APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`
- **Decimals**: 6
- **Solscan URLs**:
  - Mainnet: https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump
  - Devnet: https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump?cluster=devnet
  - Testnet: https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump?cluster=testnet

### SOL Token
- **Mint Address**: `So11111111111111111111111111111111111111112` (Wrapped SOL)
- **Decimals**: 9
- **Solscan URLs**:
  - Mainnet: https://solscan.io/token/So11111111111111111111111111111111111111112
  - Devnet: https://solscan.io/token/So11111111111111111111111111111111111111112?cluster=devnet
  - Testnet: https://solscan.io/token/So11111111111111111111111111111111111111112?cluster=testnet

## 🔍 Cara Tracking di Solscan

### Tracking di Mainnet
1. **Buka Solscan**: Kunjungi https://solscan.io
2. **Masukkan Program ID**: Copy paste Program ID ke search bar
3. **Lihat Activity**: Monitor semua transaksi yang terjadi

### Tracking di Devnet
1. **Buka Solscan Devnet**: Kunjungi https://solscan.io?cluster=devnet
2. **Atau tambahkan parameter**: Tambahkan `?cluster=devnet` ke URL program
3. **Masukkan Program ID**: Copy paste Program ID ke search bar

### Tracking di Testnet
1. **Buka Solscan Testnet**: Kunjungi https://solscan.io?cluster=testnet
2. **Atau tambahkan parameter**: Tambahkan `?cluster=testnet` ke URL program
3. **Masukkan Program ID**: Copy paste Program ID ke search bar

### Informasi yang Bisa Ditracking (Semua Network):
- 📊 **Transaction History**: Semua transaksi swap dan staking
- 💰 **Volume**: Total volume transaksi
- 👥 **Users**: Jumlah unique users
- ⏰ **Timestamp**: Waktu setiap transaksi
- 🔗 **Transaction Hash**: Hash untuk verifikasi
- 💸 **Fees**: Fee yang dibayarkan untuk setiap transaksi
- 🌐 **Network**: Network tempat transaksi terjadi (mainnet/devnet/testnet)

### 1. Tracking Program Activity
```
1. Buka https://solscan.io (atau tambahkan ?cluster=devnet/testnet)
2. Paste Program ID di search bar:
   - Staking: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
   - Swap: SwapGLD1111111111111111111111111111111111111
3. Lihat semua transaksi dan aktivitas program
```

### 2. Tracking Transaksi Spesifik
```
1. Setelah melakukan swap/staking, copy transaction signature
2. Buka https://solscan.io/tx/[TRANSACTION_SIGNATURE] (tambahkan cluster parameter jika perlu)
3. Lihat detail transaksi, accounts involved, dan program calls
```

### 3. Tracking Pool Addresses
```
Staking Pool PDA: Derived dari ["pool"] + program_id
Swap Pool PDA: Derived dari ["swap_pool", SOL_mint, GOLD_mint] + program_id
```

## 📊 Program Data Structures

### Staking Pool Account
```rust
pub struct Pool {
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_vault: Pubkey,
    pub reward_rate: u64,
    pub lock_period: i64,
    pub total_staked: u64,
    pub total_rewards_distributed: u64,
    pub bump: u8,
}
```

### Swap Pool Account
```rust
pub struct SwapPool {
    pub authority: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub token_a_vault: Pubkey,
    pub token_b_vault: Pubkey,
    pub fee_rate: u64,
    pub total_liquidity: u64,
    pub reserve_a: u64,
    pub reserve_b: u64,
    pub total_swaps: u64,
    pub total_volume: u64,
    pub bump: u8,
}
```

## 🚀 Deployment Information

### Network
- **Cluster**: Mainnet Beta
- **RPC**: https://api.mainnet-beta.solana.com

### Program Deployment
```bash
# Build programs
anchor build

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show [PROGRAM_ID]
```

### Initialize Pools
```typescript
// Initialize Staking Pool
const stakingClient = new StakingClient(connection, wallet);
await stakingClient.initializePool(rewardRate, lockPeriod);

// Initialize Swap Pool
const swapClient = new SwapClient(connection, wallet);
await swapClient.initializePool(feeRate);
```

## 🔐 Security Features

### Staking Security
- ✅ Lock period enforcement
- ✅ Reward rate validation
- ✅ Authority-only pool management
- ✅ Overflow protection

### Swap Security
- ✅ Slippage protection
- ✅ Minimum amount out validation
- ✅ Liquidity checks
- ✅ Fee rate limits

## 📱 Integration dalam DApp

### Frontend Integration
```typescript
// Import clients
import { StakingClient } from '../utils/stakingClient';
import { SwapClient } from '../utils/swapClient';

// Initialize clients
const stakingClient = new StakingClient(connection, wallet);
const swapClient = new SwapClient(connection, wallet);

// Perform operations
const stakeTx = await stakingClient.stake(amount);
const swapTx = await swapClient.swap(amountIn, minAmountOut, fromToken, toToken);
```

### Solscan Links dalam UI
```typescript
// Generate Solscan links
const stakingProgramUrl = SOLSCAN_CONFIG.programUrls.staking;
const swapProgramUrl = SOLSCAN_CONFIG.programUrls.swap;
const transactionUrl = SOLSCAN_CONFIG.transactionUrl(txSignature);
```

## 🎯 Monitoring & Analytics

### Key Metrics to Track
1. **Staking Metrics**:
   - Total SOL staked
   - Total rewards distributed
   - Number of active stakers
   - Average stake duration

2. **Swap Metrics**:
   - Total swap volume
   - Number of swaps
   - Liquidity depth
   - Fee revenue

### Solscan Analytics
- Program transaction history
- Account state changes
- Token transfer tracking
- Event log monitoring

## 🔧 Troubleshooting

### Common Issues
1. **Program not found**: Pastikan Program ID benar
2. **Pool not initialized**: Jalankan initialize pool terlebih dahulu
3. **Insufficient balance**: Pastikan ada SOL untuk transaction fees
4. **Slippage exceeded**: Tingkatkan slippage tolerance

### Debug Tools
```typescript
// Enable logging
DEVELOPER_CONFIG.logTransactions = true;

// Check program info
const programInfo = await connection.getAccountInfo(programId);
console.log('Program Info:', programInfo);

// Check pool state
const poolInfo = await stakingClient.getPoolInfo();
console.log('Pool Info:', poolInfo);
```

---

**📝 Note**: Program IDs ini adalah contoh untuk development. Untuk production, pastikan menggunakan Program ID yang sudah di-deploy ke mainnet dan telah diaudit keamanannya.

**🔗 Useful Links**:
- [Solscan Explorer](https://solscan.io)
- [Solana Explorer](https://explorer.solana.com)
- [Anchor Documentation](https://anchor-lang.com)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)