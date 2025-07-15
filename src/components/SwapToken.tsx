import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { FC, useState, useCallback, useEffect } from 'react';
import { notify } from '../utils/notifications';
import { TOKENS, JUPITER_CONFIG } from '../config/tokens';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';
import { motion } from 'framer-motion';

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: any;
  priceImpactPct: string;
  routePlan: any[];
  contextSlot: number;
  timeTaken: number;
}

interface SwapTokenProps {
  onSuccess?: () => void;
}

export const SwapToken: FC<SwapTokenProps> = ({ onSuccess }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  
  const [fromToken, setFromToken] = useState<'SOL' | 'GOLD'>('SOL');
  const [toToken, setToToken] = useState<'SOL' | 'GOLD'>('GOLD');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [lastTxid, setLastTxid] = useState<string | null>(null);

  // Get quote when amount or tokens change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      getQuote();
    } else {
      setQuote(null);
    }
  }, [amount, fromToken, toToken]);

  const getQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsGettingQuote(true);
    try {
      const inputMint = fromToken === 'SOL' ? TOKENS.SOL.mint : TOKENS.GOLD.mint;
      const outputMint = toToken === 'SOL' ? TOKENS.SOL.mint : TOKENS.GOLD.mint;
      const inputAmount = Math.floor(parseFloat(amount) * Math.pow(10, TOKENS[fromToken].decimals));

      const response = await fetch(`${JUPITER_CONFIG.quoteApi}/quote`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputMint,
          outputMint,
          amount: inputAmount.toString(),
          slippageBps: 50, // 0.5% slippage
        }),
      });

      if (response.ok) {
        const quoteData = await response.json();
        setQuote(quoteData);
      } else {
        console.error('Failed to get quote');
        setQuote(null);
      }
    } catch (error) {
      console.error('Error getting quote:', error);
      setQuote(null);
    } finally {
      setIsGettingQuote(false);
    }
  }, [amount, fromToken, toToken]);

  const handleSwap = useCallback(async () => {
    if (!publicKey || !quote) {
      notify({ type: 'error', message: 'Wallet not connected or no quote available!' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      notify({ type: 'error', message: 'Invalid amount!' });
      return;
    }

    // Check balance
    const currentBalance = balances[fromToken];
    if (amountNum > currentBalance) {
      notify({ type: 'error', message: `Insufficient ${fromToken} balance!` });
      return;
    }

    setIsLoading(true);
    let signature: TransactionSignature = '';
    setLastTxid(null);
    try {
      // Get swap transaction
      const swapResponse = await fetch(`${JUPITER_CONFIG.swapApi}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
          wrapUnwrapSOL: true,
        }),
      });

      if (!swapResponse.ok) {
        throw new Error('Failed to create swap transaction');
      }

      const swapData = await swapResponse.json();
      
      // Deserialize and send transaction
      const { Transaction } = await import('@solana/web3.js');
      const transaction = Transaction.from(Buffer.from(swapData.swapTransaction, 'base64'));
      
      signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

      notify({ 
        type: 'success', 
        message: `Swap successful!`, 
        txid: signature 
      });
      setLastTxid(signature);
      // Refresh balances
      await getAllTokenBalances(publicKey, connection);
      
      // Reset form
      setAmount('');
      setQuote(null);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Swap failed!`, 
        description: error?.message, 
        txid: signature 
      });
      setLastTxid(signature || null);
      console.error('Swap error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, quote, amount, fromToken, balances, connection, sendTransaction, getAllTokenBalances, onSuccess]);

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const outputAmount = quote ? parseFloat(quote.outAmount) / Math.pow(10, TOKENS[toToken].decimals) : 0;
  const priceImpact = quote ? parseFloat(quote.priceImpactPct) : 0;

  return (
    <div className="max-w-md mx-auto bg-base-200 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Swap Tokens</h3>
      
      <div className="space-y-4">
        {/* From Token */}
        <div>
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <div className="flex gap-2">
            <select 
              className="select select-bordered flex-1"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as 'SOL' | 'GOLD')}
            >
              <option value="SOL">SOL</option>
              <option value="GOLD">GOLD</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              Balance: {balances[fromToken].toFixed(6)}
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button 
            className="btn btn-circle btn-sm"
            onClick={swapTokens}
            disabled={isLoading}
          >
            ↓
          </button>
        </div>

        {/* To Token */}
        <div>
          <label className="label">
            <span className="label-text">To</span>
          </label>
          <div className="flex gap-2">
            <select 
              className="select select-bordered flex-1"
              value={toToken}
              onChange={(e) => setToToken(e.target.value as 'SOL' | 'GOLD')}
            >
              <option value="SOL">SOL</option>
              <option value="GOLD">GOLD</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              Balance: {balances[toToken].toFixed(6)}
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.000001"
            min="0"
          />
        </div>

        {/* Quote Display */}
        {quote && (
          <div className="bg-base-300 p-4 rounded-lg">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>You&apos;ll receive:</span>
                <span className="font-semibold">{outputAmount.toFixed(6)} {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span>Price Impact:</span>
                <span className={priceImpact > 1 ? 'text-red-500' : 'text-green-500'}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rate:</span>
                <span>1 {fromToken} = {(outputAmount / parseFloat(amount)).toFixed(6)} {toToken}</span>
              </div>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
          onClick={handleSwap}
          disabled={!publicKey || isLoading || !amount || !quote || isGettingQuote}
        >
          {isLoading ? 'Swapping...' : isGettingQuote ? 'Getting Quote...' : 'Swap'}
        </motion.button>
        {lastTxid && (
          <div className="mt-4 text-center">
            <a
              href={`https://solscan.io/tx/${lastTxid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline text-sm"
            >
              View Transaction on Solscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}; 