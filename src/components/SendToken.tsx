import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
  TransactionSignature
} from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { FC, useState, useCallback } from 'react';
import { notify } from '../utils/notifications';
import { TOKENS, getTokenDecimals } from '../config/tokens';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';
import { motion } from 'framer-motion';

interface SendTokenProps {
  onSuccess?: () => void;
}

export const SendToken: FC<SendTokenProps> = ({ onSuccess }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'SOL' | 'GOLD'>('SOL');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTxid, setLastTxid] = useState<string | null>(null);

  const handleSend = useCallback(async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    if (!recipient || !amount) {
      notify({ type: 'error', message: 'Please fill in all fields!' });
      return;
    }

    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipient);
    } catch (error) {
      notify({ type: 'error', message: 'Invalid recipient address!' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      notify({ type: 'error', message: 'Invalid amount!' });
      return;
    }

    // Check balance
    const currentBalance = balances[tokenType];
    if (amountNum > currentBalance) {
      notify({ type: 'error', message: `Insufficient ${tokenType} balance!` });
      return;
    }

    setIsLoading(true);
    let signature: TransactionSignature = '';
    setLastTxid(null);
    try {
      const instructions = [];
      const decimals = getTokenDecimals(tokenType);
      const amountInSmallestUnit = Math.floor(amountNum * Math.pow(10, decimals));

      if (tokenType === 'SOL') {
        // Send SOL
        instructions.push(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: amountInSmallestUnit,
          })
        );
      } else if (tokenType === 'GOLD') {
        // Send GOLD token
        const tokenMint = new PublicKey(TOKENS.GOLD.mint);
        const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
        const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPubkey);

        // Check if recipient token account exists
        try {
          await connection.getAccountInfo(recipientTokenAccount);
        } catch (error) {
          // Create recipient token account if it doesn't exist
          instructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              recipientTokenAccount,
              recipientPubkey,
              tokenMint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        // Transfer tokens
        instructions.push(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            publicKey,
            amountInSmallestUnit
          )
        );
      }

      // Get latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();

      // Create transaction
      const message = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToLegacyMessage();

      const transaction = new VersionedTransaction(message);

      // Send transaction
      signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      notify({ type: 'success', message: 'Send successful!', txid: signature });
      setLastTxid(signature);
      await getAllTokenBalances(publicKey, connection);
      if (onSuccess) onSuccess();
      setAmount('');
      setRecipient('');
    } catch (error: any) {
      notify({ type: 'error', message: 'Send failed!', description: error?.message, txid: signature });
      setLastTxid(signature || null);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, recipient, amount, tokenType, balances, connection, sendTransaction, getAllTokenBalances, onSuccess]);

  return (
    <div className="max-w-md mx-auto bg-base-200 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Send Tokens</h3>
      
      <div className="space-y-4">
        {/* Token Type Selection */}
        <div>
          <label className="label">
            <span className="label-text">Token Type</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value as 'SOL' | 'GOLD')}
          >
            <option value="SOL">SOL</option>
            <option value="GOLD">GOLD</option>
          </select>
        </div>

        {/* Balance Display */}
        <div className="text-sm text-gray-600">
          Balance: {balances[tokenType].toFixed(6)} {tokenType}
        </div>

        {/* Recipient Address */}
        <div>
          <label className="label">
            <span className="label-text">Recipient Address</span>
          </label>
          <input
            type="text"
            placeholder="Enter recipient address"
            className="input input-bordered w-full"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Amount */}
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

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
          onClick={handleSend}
          disabled={!publicKey || isLoading || !recipient || !amount}
        >
          {isLoading ? 'Sending...' : `Send ${tokenType}`}
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