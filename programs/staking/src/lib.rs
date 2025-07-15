use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sol_gold_staking {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        reward_rate: u64,
        lock_period: i64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.reward_mint = ctx.accounts.reward_mint.key();
        pool.reward_vault = ctx.accounts.reward_vault.key();
        pool.reward_rate = reward_rate;
        pool.lock_period = lock_period;
        pool.total_staked = 0;
        pool.total_rewards_distributed = 0;
        pool.bump = *ctx.bumps.get("pool").unwrap();
        
        msg!("Staking pool initialized");
        Ok(())
    }

    pub fn stake(
        ctx: Context<Stake>,
        amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        // Transfer SOL to pool
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.pool.key(),
            amount,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.pool.to_account_info(),
            ],
        )?;

        // Create or update user stake record
        if user_stake.user == Pubkey::default() {
            user_stake.user = ctx.accounts.user.key();
            user_stake.pool = pool.key();
            user_stake.amount = amount;
            user_stake.stake_time = clock.unix_timestamp;
            user_stake.last_claim_time = clock.unix_timestamp;
            user_stake.bump = *ctx.bumps.get("user_stake").unwrap();
        } else {
            user_stake.amount = user_stake.amount.checked_add(amount).unwrap();
            user_stake.stake_time = clock.unix_timestamp;
        }

        pool.total_staked = pool.total_staked.checked_add(amount).unwrap();

        msg!("Staked {} lamports", amount);
        Ok(())
    }

    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        require!(
            user_stake.amount > 0,
            StakingError::NoStakeFound
        );

        require!(
            clock.unix_timestamp >= user_stake.last_claim_time.checked_add(pool.lock_period).unwrap(),
            StakingError::LockPeriodNotMet
        );

        // Calculate rewards
        let time_staked = clock.unix_timestamp.checked_sub(user_stake.last_claim_time).unwrap();
        let reward_amount = calculate_rewards(
            user_stake.amount,
            time_staked,
            pool.reward_rate,
        );

        require!(reward_amount > 0, StakingError::NoRewardsAvailable);

        // Transfer rewards
        let seeds = &[
            b"pool".as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.user_reward_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::transfer(cpi_ctx, reward_amount)?;

        // Update user stake record
        user_stake.last_claim_time = clock.unix_timestamp;
        pool.total_rewards_distributed = pool.total_rewards_distributed.checked_add(reward_amount).unwrap();

        msg!("Claimed {} reward tokens", reward_amount);
        Ok(())
    }

    pub fn unstake(
        ctx: Context<Unstake>,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        require!(
            user_stake.amount > 0,
            StakingError::NoStakeFound
        );

        require!(
            clock.unix_timestamp >= user_stake.stake_time.checked_add(pool.lock_period).unwrap(),
            StakingError::LockPeriodNotMet
        );

        let stake_amount = user_stake.amount;

        // Transfer SOL back to user
        let seeds = &[
            b"pool".as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.pool.key(),
            &ctx.accounts.user.key(),
            stake_amount,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.pool.to_account_info(),
                ctx.accounts.user.to_account_info(),
            ],
            signer,
        )?;

        // Reset user stake record
        user_stake.amount = 0;
        user_stake.stake_time = 0;
        user_stake.last_claim_time = 0;

        pool.total_staked = pool.total_staked.checked_sub(stake_amount).unwrap();

        msg!("Unstaked {} lamports", stake_amount);
        Ok(())
    }

    pub fn add_rewards(
        ctx: Context<AddRewards>,
        amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        // Transfer reward tokens to pool vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_reward_account.to_account_info(),
            to: ctx.accounts.reward_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        msg!("Added {} reward tokens to pool", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pool::LEN,
        seeds = [b"pool"],
        bump
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub reward_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = reward_mint,
        token::authority = pool,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::LEN,
        seeds = [b"user_stake", user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref()],
        bump = user_stake.bump,
        has_one = user
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,
    
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref()],
        bump = user_stake.bump,
        has_one = user
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddRewards<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority_reward_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_vault: Pubkey,
    pub reward_rate: u64, // Rewards per second per lamport
    pub lock_period: i64, // Lock period in seconds
    pub total_staked: u64,
    pub total_rewards_distributed: u64,
    pub bump: u8,
}

impl Pool {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub stake_time: i64,
    pub last_claim_time: i64,
    pub bump: u8,
}

impl UserStake {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1;
}

#[error_code]
pub enum StakingError {
    #[msg("No stake found for user")]
    NoStakeFound,
    #[msg("Lock period not met")]
    LockPeriodNotMet,
    #[msg("No rewards available")]
    NoRewardsAvailable,
}

fn calculate_rewards(
    stake_amount: u64,
    time_staked: i64,
    reward_rate: u64,
) -> u64 {
    if time_staked <= 0 || stake_amount == 0 {
        return 0;
    }
    
    // Calculate rewards: (stake_amount * time_staked * reward_rate) / 1e9
    let reward = (stake_amount as u128)
        .checked_mul(time_staked as u128)
        .unwrap()
        .checked_mul(reward_rate as u128)
        .unwrap()
        .checked_div(1_000_000_000)
        .unwrap();
    
    reward as u64
} 