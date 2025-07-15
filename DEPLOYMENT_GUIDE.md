# 🚀 Smart Contract Deployment Guide

## 📋 Prerequisites

### 1. Install Rust & Solana CLI
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### 2. Setup Solana Wallet
```bash
# Generate new keypair
solana-keygen new

# Set to mainnet
solana config set --url mainnet-beta

# Check balance
solana balance
```

## 🏗️ Build & Deploy Smart Contract

### 1. Build Program
```bash
# Build the program
anchor build

# Get program ID
solana address -k target/deploy/sol_gold_staking-keypair.json
```

### 2. Update Program ID
```bash
# Update in lib.rs
declare_id!("YOUR_PROGRAM_ID_HERE");

# Update in Anchor.toml
[programs.mainnet]
sol_gold_staking = "YOUR_PROGRAM_ID_HERE"
```

### 3. Deploy to Mainnet
```bash
# Deploy program
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show YOUR_PROGRAM_ID_HERE
```

## 🔧 Initialize Staking Pool

### 1. Create Script
```typescript
// scripts/initialize-pool.ts
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { IDL } from '../src/idl/sol_gold_staking';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const wallet = Keypair.fromSecretKey(/* your wallet secret key */);
const provider = new AnchorProvider(connection, { publicKey: wallet.publicKey, signTransaction: (tx) => Promise.resolve(tx) }, { commitment: 'confirmed' });

const program = new Program(IDL, new PublicKey('YOUR_PROGRAM_ID'), provider);

async function initializePool() {
  const [poolPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('pool')],
    program.programId
  );

  const [rewardVaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('reward_vault')],
    program.programId
  );

  const rewardMint = new PublicKey('APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'); // GOLD token

  const tx = await program.methods
    .initializePool(
      new BN(1000), // reward_rate: 1000 tokens per second per lamport
      new BN(2592000) // lock_period: 30 days in seconds
    )
    .accounts({
      pool: poolPDA,
      rewardMint: rewardMint,
      rewardVault: rewardVaultPDA,
      authority: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: web3.TokenProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  console.log('Pool initialized:', tx);
}

initializePool();
```

### 2. Run Initialization
```bash
# Install dependencies
npm install

# Run initialization script
npx ts-node scripts/initialize-pool.ts
```

## 💰 Add Rewards to Pool

### 1. Create Add Rewards Script
```typescript
// scripts/add-rewards.ts
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { IDL } from '../src/idl/sol_gold_staking';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const wallet = Keypair.fromSecretKey(/* your wallet secret key */);
const provider = new AnchorProvider(connection, { publicKey: wallet.publicKey, signTransaction: (tx) => Promise.resolve(tx) }, { commitment: 'confirmed' });

const program = new Program(IDL, new PublicKey('YOUR_PROGRAM_ID'), provider);

async function addRewards() {
  const [poolPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('pool')],
    program.programId
  );

  const [rewardVaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('reward_vault')],
    program.programId
  );

  const rewardMint = new PublicKey('APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump');
  const authorityRewardAccount = await getAssociatedTokenAddress(rewardMint, wallet.publicKey);

  const rewardAmount = 1000000000; // 1000 GOLD tokens (6 decimals)

  const tx = await program.methods
    .addRewards(new BN(rewardAmount))
    .accounts({
      pool: poolPDA,
      rewardVault: rewardVaultPDA,
      authorityRewardAccount: authorityRewardAccount,
      authority: wallet.publicKey,
      tokenProgram: web3.TokenProgram.programId,
    })
    .rpc();

  console.log('Rewards added:', tx);
}

addRewards();
```

### 2. Run Add Rewards
```bash
npx ts-node scripts/add-rewards.ts
```

## 🔍 Verify Deployment

### 1. Check Program
```bash
# Verify program exists
solana program show YOUR_PROGRAM_ID

# Check program data
solana account YOUR_PROGRAM_ID
```

### 2. Check Pool
```bash
# Get pool PDA
solana account POOL_PDA_ADDRESS

# Check pool info
npx ts-node scripts/check-pool.ts
```

## 🛡️ Security Checklist

- [ ] Program deployed to mainnet
- [ ] Pool initialized with correct parameters
- [ ] Rewards added to pool vault
- [ ] Program ID updated in frontend
- [ ] Test all functions (stake, claim, unstake)
- [ ] Verify reward calculations
- [ ] Check lock period enforcement
- [ ] Test error handling

## 📊 Monitoring

### 1. Track Transactions
```bash
# Monitor program logs
solana logs YOUR_PROGRAM_ID

# Check pool balance
solana balance POOL_PDA_ADDRESS
```

### 2. Analytics Dashboard
- Total staked amount
- Total rewards distributed
- Number of stakers
- Average stake amount
- Reward rate utilization

## 🚨 Emergency Procedures

### 1. Pause Staking
```typescript
// Emergency pause function (add to program)
pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
    // Only authority can pause
    require!(ctx.accounts.authority.key() == ctx.accounts.pool.authority, ErrorCode::Unauthorized);
    
    // Set pool to paused state
    ctx.accounts.pool.paused = true;
    
    msg!("Staking pool paused");
    Ok(())
}
```

### 2. Emergency Withdraw
```typescript
// Emergency withdraw function
pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
    // Only authority can emergency withdraw
    require!(ctx.accounts.authority.key() == ctx.accounts.pool.authority, ErrorCode::Unauthorized);
    
    // Return all staked SOL to users
    // Implementation depends on specific emergency scenario
}
```

## 📞 Support

For deployment issues:
1. Check Solana mainnet status
2. Verify wallet has sufficient SOL for deployment
3. Ensure all dependencies are installed
4. Check program logs for errors
5. Contact development team

**Happy Deploying! 🚀** 