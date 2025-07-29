import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SWAP_IDL } from '../idl/sol_gold_swap';
import { TOKENS } from '../config/tokens';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

export class SwapClient {
  private program: Program;
  private connection: Connection;
  private provider: AnchorProvider;

  constructor(connection: Connection, wallet: any) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    // Program ID untuk swap contract yang bisa ditracking di Solscan
    this.program = new Program(SWAP_IDL, new PublicKey('SwapGLD1111111111111111111111111111111111111'), this.provider);
  }

  // Get swap pool PDA
  async getSwapPoolPDA(): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('swap_pool'), 
       new PublicKey(TOKENS.SOL.mint).toBuffer(),
       new PublicKey(TOKENS.GOLD.mint).toBuffer()],
      this.program.programId
    );
  }

  // Get token vault PDAs
  async getTokenVaultPDAs(): Promise<{tokenAVault: [PublicKey, number], tokenBVault: [PublicKey, number]}> {
    const tokenAVault = await PublicKey.findProgramAddress(
      [Buffer.from('token_a_vault')],
      this.program.programId
    );
    
    const tokenBVault = await PublicKey.findProgramAddress(
      [Buffer.from('token_b_vault')],
      this.program.programId
    );
    
    return { tokenAVault, tokenBVault };
  }

  // Initialize swap pool
  async initializePool(feeRate: number = 30): Promise<TransactionSignature> {
    const [poolPDA] = await this.getSwapPoolPDA();
    const { tokenAVault, tokenBVault } = await this.getTokenVaultPDAs();
    const tokenAMint = new PublicKey(TOKENS.SOL.mint);
    const tokenBMint = new PublicKey(TOKENS.GOLD.mint);

    const tx = await this.program.methods
      .initializePool(new BN(feeRate)) // 0.3% fee
      .accounts({
        pool: poolPDA[0],
        tokenAMint: tokenAMint,
        tokenBMint: tokenBMint,
        tokenAVault: tokenAVault[0],
        tokenBVault: tokenBVault[0],
        authority: this.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return tx;
  }

  // Swap tokens
  async swap(
    amountIn: number,
    minimumAmountOut: number,
    fromToken: 'SOL' | 'GOLD',
    toToken: 'SOL' | 'GOLD'
  ): Promise<TransactionSignature> {
    const [poolPDA] = await this.getSwapPoolPDA();
    const { tokenAVault, tokenBVault } = await this.getTokenVaultPDAs();
    
    // Determine swap direction (true = SOL to GOLD, false = GOLD to SOL)
    const swapDirection = fromToken === 'SOL';
    
    // Get user token accounts
    const userTokenAccountA = await getAssociatedTokenAddress(
      new PublicKey(TOKENS.SOL.mint),
      this.provider.wallet.publicKey
    );
    
    const userTokenAccountB = await getAssociatedTokenAddress(
      new PublicKey(TOKENS.GOLD.mint),
      this.provider.wallet.publicKey
    );

    // Convert amounts to proper decimals
    const amountInLamports = Math.floor(amountIn * Math.pow(10, TOKENS[fromToken].decimals));
    const minimumAmountOutLamports = Math.floor(minimumAmountOut * Math.pow(10, TOKENS[toToken].decimals));

    const tx = await this.program.methods
      .swap(
        new BN(amountInLamports),
        new BN(minimumAmountOutLamports),
        swapDirection
      )
      .accounts({
        pool: poolPDA[0],
        userTokenAccountA: userTokenAccountA,
        userTokenAccountB: userTokenAccountB,
        poolTokenAccountA: tokenAVault[0],
        poolTokenAccountB: tokenBVault[0],
        user: this.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }

  // Add liquidity to pool
  async addLiquidity(
    amountA: number,
    amountB: number
  ): Promise<TransactionSignature> {
    const [poolPDA] = await this.getSwapPoolPDA();
    const { tokenAVault, tokenBVault } = await this.getTokenVaultPDAs();
    
    const userTokenAccountA = await getAssociatedTokenAddress(
      new PublicKey(TOKENS.SOL.mint),
      this.provider.wallet.publicKey
    );
    
    const userTokenAccountB = await getAssociatedTokenAddress(
      new PublicKey(TOKENS.GOLD.mint),
      this.provider.wallet.publicKey
    );

    const amountALamports = Math.floor(amountA * Math.pow(10, TOKENS.SOL.decimals));
    const amountBLamports = Math.floor(amountB * Math.pow(10, TOKENS.GOLD.decimals));

    const tx = await this.program.methods
      .addLiquidity(
        new BN(amountALamports),
        new BN(amountBLamports)
      )
      .accounts({
        pool: poolPDA[0],
        userTokenAccountA: userTokenAccountA,
        userTokenAccountB: userTokenAccountB,
        poolTokenAccountA: tokenAVault[0],
        poolTokenAccountB: tokenBVault[0],
        user: this.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }

  // Get pool info
  async getPoolInfo() {
    const [poolPDA] = await this.getSwapPoolPDA();
    try {
      const pool = await this.program.account.swapPool.fetch(poolPDA[0]);
      return {
        authority: pool.authority,
        tokenAMint: pool.tokenAMint,
        tokenBMint: pool.tokenBMint,
        tokenAVault: pool.tokenAVault,
        tokenBVault: pool.tokenBVault,
        feeRate: (pool.feeRate as any).toNumber(),
        totalLiquidity: (pool.totalLiquidity as any).toNumber(),
        reserveA: (pool.reserveA as any).toNumber(),
        reserveB: (pool.reserveB as any).toNumber(),
        totalSwaps: (pool.totalSwaps as any).toNumber(),
        totalVolume: (pool.totalVolume as any).toNumber(),
      };
    } catch (error) {
      console.error('Pool not initialized yet');
      return null;
    }
  }

  // Calculate swap quote
  async getSwapQuote(
    amountIn: number,
    fromToken: 'SOL' | 'GOLD'
  ): Promise<{ amountOut: number; priceImpact: number; fee: number } | null> {
    const poolInfo = await this.getPoolInfo();
    if (!poolInfo) return null;

    const reserveIn = fromToken === 'SOL' ? poolInfo.reserveA : poolInfo.reserveB;
    const reserveOut = fromToken === 'SOL' ? poolInfo.reserveB : poolInfo.reserveA;
    
    if (reserveIn === 0 || reserveOut === 0) return null;

    const amountInWithDecimals = amountIn * Math.pow(10, TOKENS[fromToken].decimals);
    const fee = (amountInWithDecimals * poolInfo.feeRate) / 10000;
    const amountInAfterFee = amountInWithDecimals - fee;
    
    // Constant product formula: x * y = k
    const amountOut = (reserveOut * amountInAfterFee) / (reserveIn + amountInAfterFee);
    
    // Calculate price impact
    const priceImpact = (amountInAfterFee / (reserveIn + amountInAfterFee)) * 100;
    
    const toToken = fromToken === 'SOL' ? 'GOLD' : 'SOL';
    
    return {
      amountOut: amountOut / Math.pow(10, TOKENS[toToken].decimals),
      priceImpact,
      fee: fee / Math.pow(10, TOKENS[fromToken].decimals)
    };
  }

  // Get program ID for tracking on Solscan
  getProgramId(): string {
    return this.program.programId.toString();
  }

  // Get pool address for tracking on Solscan
  async getPoolAddress(): Promise<string> {
    const [poolPDA] = await this.getSwapPoolPDA();
    return poolPDA[0].toString();
  }
}