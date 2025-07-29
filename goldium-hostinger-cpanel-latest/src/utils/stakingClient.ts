import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { IDL } from '../idl/sol_gold_staking';
import { TOKENS } from '../config/tokens';

export class StakingClient {
  private program: Program;
  private connection: Connection;
  private provider: AnchorProvider;

  constructor(connection: Connection, wallet: any) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    this.program = new Program(IDL, new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'), this.provider);
  }

  // Get pool PDA
  async getPoolPDA(): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('pool')],
      this.program.programId
    );
  }

  // Get user stake PDA
  async getUserStakePDA(user: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('user_stake'), user.toBuffer()],
      this.program.programId
    );
  }

  // Get reward vault PDA
  async getRewardVaultPDA(): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('reward_vault')],
      this.program.programId
    );
  }

  // Initialize staking pool
  async initializePool(
    rewardRate: number,
    lockPeriod: number
  ): Promise<TransactionSignature> {
    const [poolPDA] = await this.getPoolPDA();
    const [rewardVaultPDA] = await this.getRewardVaultPDA();
    const rewardMint = new PublicKey(TOKENS.GOLD.mint);

    const tx = await this.program.methods
      .initializePool(new BN(rewardRate), new BN(lockPeriod))
      .accounts({
        pool: poolPDA,
        rewardMint: rewardMint,
        rewardVault: rewardVaultPDA,
        authority: this.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return tx;
  }

  // Stake SOL
  async stake(amount: number): Promise<TransactionSignature> {
    const [poolPDA] = await this.getPoolPDA();
    const [userStakePDA] = await this.getUserStakePDA(this.provider.wallet.publicKey);
    const amountLamports = Math.floor(amount * 1e9); // Convert SOL to lamports

    const tx = await this.program.methods
      .stake(new BN(amountLamports))
      .accounts({
        pool: poolPDA,
        userStake: userStakePDA,
        user: this.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  // Claim rewards
  async claimRewards(): Promise<TransactionSignature> {
    const [poolPDA] = await this.getPoolPDA();
    const [userStakePDA] = await this.getUserStakePDA(this.provider.wallet.publicKey);
    const [rewardVaultPDA] = await this.getRewardVaultPDA();
    
    // Get user's GOLD token account
    const userGoldAccount = await this.getAssociatedTokenAddress(
      new PublicKey(TOKENS.GOLD.mint),
      this.provider.wallet.publicKey
    );

    const tx = await this.program.methods
      .claimRewards()
      .accounts({
        pool: poolPDA,
        userStake: userStakePDA,
        rewardVault: rewardVaultPDA,
        userRewardAccount: userGoldAccount,
        user: this.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }

  // Unstake SOL
  async unstake(): Promise<TransactionSignature> {
    const [poolPDA] = await this.getPoolPDA();
    const [userStakePDA] = await this.getUserStakePDA(this.provider.wallet.publicKey);

    const tx = await this.program.methods
      .unstake()
      .accounts({
        pool: poolPDA,
        userStake: userStakePDA,
        user: this.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  // Get pool info
  async getPoolInfo() {
    const [poolPDA] = await this.getPoolPDA();
    try {
      const pool = await this.program.account.pool.fetch(poolPDA);
      return {
        authority: pool.authority,
        rewardMint: pool.rewardMint,
        rewardVault: pool.rewardVault,
        rewardRate: (pool.rewardRate as any).toNumber(),
        lockPeriod: (pool.lockPeriod as any).toNumber(),
        totalStaked: (pool.totalStaked as any).toNumber(),
        totalRewardsDistributed: (pool.totalRewardsDistributed as any).toNumber(),
      };
    } catch (error) {
      console.error('Pool not initialized yet');
      return null;
    }
  }

  // Get user stake info
  async getUserStakeInfo(user: PublicKey) {
    const [userStakePDA] = await this.getUserStakePDA(user);
    try {
      const userStake = await this.program.account.userStake.fetch(userStakePDA);
      return {
        user: userStake.user,
        pool: userStake.pool,
        amount: (userStake.amount as any).toNumber(),
        stakeTime: (userStake.stakeTime as any).toNumber(),
        lastClaimTime: (userStake.lastClaimTime as any).toNumber(),
      };
    } catch (error) {
      console.error('User stake not found');
      return null;
    }
  }

  // Calculate pending rewards
  async calculatePendingRewards(user: PublicKey): Promise<number> {
    const poolInfo = await this.getPoolInfo();
    const userStakeInfo = await this.getUserStakeInfo(user);

    if (!poolInfo || !userStakeInfo || userStakeInfo.amount === 0) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeStaked = currentTime - userStakeInfo.lastClaimTime;
    
    if (timeStaked <= 0) {
      return 0;
    }

    // Calculate rewards: (stake_amount * time_staked * reward_rate) / 1e9
    const reward = (userStakeInfo.amount * timeStaked * poolInfo.rewardRate) / 1e9;
    return reward / Math.pow(10, TOKENS.GOLD.decimals); // Convert to GOLD tokens
  }

  // Helper function to get associated token address
  private async getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey
  ): Promise<PublicKey> {
    const { getAssociatedTokenAddress } = await import('@solana/spl-token');
    return getAssociatedTokenAddress(mint, owner);
  }
}