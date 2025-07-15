import create, { State } from 'zustand';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { TOKENS } from '../config/tokens';

interface TokenBalance {
  SOL: number;
  GOLD: number;
}

interface TokenBalanceStore extends State {
  balances: TokenBalance;
  isLoading: boolean;
  getTokenBalance: (publicKey: PublicKey, connection: Connection, tokenSymbol: keyof TokenBalance) => Promise<void>;
  getAllTokenBalances: (publicKey: PublicKey, connection: Connection) => Promise<void>;
}

const useTokenBalanceStore = create<TokenBalanceStore>((set, get) => ({
  balances: {
    SOL: 0,
    GOLD: 0,
  },
  isLoading: false,
  
  getTokenBalance: async (publicKey, connection, tokenSymbol) => {
    set({ isLoading: true });
    
    try {
      let balance = 0;
      
      if (tokenSymbol === 'SOL') {
        // Get SOL balance
        const solBalance = await connection.getBalance(publicKey, 'confirmed');
        balance = solBalance / LAMPORTS_PER_SOL;
      } else if (tokenSymbol === 'GOLD') {
        // Get GOLD token balance
        const tokenMint = new PublicKey(TOKENS.GOLD.mint);
        const tokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
        
        try {
          const accountInfo = await getAccount(connection, tokenAccount);
          balance = Number(accountInfo.amount) / Math.pow(10, TOKENS.GOLD.decimals);
        } catch (error) {
          // Token account doesn't exist, balance is 0
          balance = 0;
        }
      }
      
      set((state) => ({
        balances: {
          ...state.balances,
          [tokenSymbol]: balance,
        },
        isLoading: false,
      }));
      
      console.log(`${tokenSymbol} balance updated:`, balance);
    } catch (error) {
      console.error(`Error getting ${tokenSymbol} balance:`, error);
      set({ isLoading: false });
    }
  },
  
  getAllTokenBalances: async (publicKey, connection) => {
    set({ isLoading: true });
    
    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey, 'confirmed');
      const solAmount = solBalance / LAMPORTS_PER_SOL;
      
      // Get GOLD balance
      let goldAmount = 0;
      try {
        const tokenMint = new PublicKey(TOKENS.GOLD.mint);
        const tokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
        const accountInfo = await getAccount(connection, tokenAccount);
        goldAmount = Number(accountInfo.amount) / Math.pow(10, TOKENS.GOLD.decimals);
      } catch (error) {
        // Token account doesn't exist
        goldAmount = 0;
      }
      
      set({
        balances: {
          SOL: solAmount,
          GOLD: goldAmount,
        },
        isLoading: false,
      });
      
      console.log('All token balances updated:', { SOL: solAmount, GOLD: goldAmount });
    } catch (error) {
      console.error('Error getting all token balances:', error);
      set({ isLoading: false });
    }
  },
}));

export default useTokenBalanceStore; 