import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useState, useCallback, useEffect } from 'react';
import { notify } from '../utils/notifications';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';
import { motion } from 'framer-motion';

interface StakingProps {
  onSuccess?: () => void;
}

interface StakingInfo {
  totalStaked: number;
  pendingRewards: number;
  userStakeAmount: number;
  lockPeriod: number;
  rewardRate: number;
  canUnstake: boolean;
  canClaim: boolean;
}

export const Staking: FC<StakingProps> = ({ onSuccess }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [lastTxid, setLastTxid] = useState<string | null>(null);

  // Simulate staking info loading
  useEffect(() => {
    if (publicKey) {
      // Simulate loading staking data with realistic values
      const mockStakingInfo: StakingInfo = {
        totalStaked: 0, // Start with 0, will be updated when users stake
        pendingRewards: 0,
        userStakeAmount: 0,
        lockPeriod: 2592000, // 30 days in seconds
        rewardRate: 1000,
        canUnstake: false,
        canClaim: false,
      };
      setStakingInfo(mockStakingInfo);
    }
  }, [publicKey]);

  const handleStake = useCallback(async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < 0.01) {
      notify({ type: 'error', message: 'Minimum stake amount is 0.01 SOL!' });
      return;
    }

    if (amount > balances.SOL) {
      notify({ type: 'error', message: 'Insufficient SOL balance!' });
      return;
    }

    setIsLoading(true);
    setLastTxid(null);
    let signature: string = '';
    try {
      // Simulate staking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      signature = 'SIMULATED_TXID_' + Math.random().toString(36).substring(2, 15);
      notify({ 
        type: 'success', 
        message: `${amount} SOL staked successfully! You'll earn GOLD rewards.`,
        txid: signature
      });
      setLastTxid(signature);
      setStakeAmount('');
      await getAllTokenBalances(publicKey, connection);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Staking failed!`, 
        description: error?.message,
        txid: signature
      });
      setLastTxid(signature || null);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, stakeAmount, balances.SOL, stakingInfo, onSuccess, getAllTokenBalances, connection]);

  const handleClaimRewards = useCallback(async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate claiming process
      await new Promise(resolve => setTimeout(resolve, 2000));

      notify({ 
        type: 'success', 
        message: `Rewards claimed successfully!` 
      });

      await getAllTokenBalances(publicKey, connection);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Claim rewards failed!`, 
        description: error?.message 
      });
      console.error('Claim rewards error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, onSuccess, getAllTokenBalances, connection]);

  const handleUnstake = useCallback(async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    if (!stakingInfo?.canUnstake) {
      notify({ type: 'error', message: 'Lock period not met yet!' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate unstaking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      notify({ 
        type: 'success', 
        message: `${stakingInfo.userStakeAmount} SOL unstaked successfully!` 
      });

      // Reset staking info
      if (stakingInfo) {
        setStakingInfo({
          ...stakingInfo,
          totalStaked: stakingInfo.totalStaked - stakingInfo.userStakeAmount,
          userStakeAmount: 0,
        });
      }

      await getAllTokenBalances(publicKey, connection);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      notify({ 
        type: 'error', 
        message: `Unstaking failed!`, 
        description: error?.message 
      });
      console.error('Unstaking error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, stakingInfo, onSuccess, getAllTokenBalances, connection]);

  return (
    <div className="max-w-md mx-auto bg-base-200 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Stake SOL</h3>
      
      <div className="space-y-4">
        {/* Staking Info */}
        <div className="bg-base-300 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Staking Info (Simulation)</h4>
          <div className="text-sm space-y-1">
            <div>Lock Period: 30 days</div>
            <div>APY: ~12%</div>
            <div>Reward Token: GOLD</div>
            {stakingInfo && (
              <>
                <div>Total Staked: {stakingInfo.totalStaked.toFixed(2)} SOL</div>
                <div>Your Stake: {stakingInfo.userStakeAmount.toFixed(4)} SOL</div>
                <div>Pending Rewards: {stakingInfo.pendingRewards.toFixed(4)} GOLD</div>
              </>
            )}
          </div>
        </div>

        {/* Stake Form */}
        <div>
          <label className="label">
            <span className="label-text">Amount to Stake (SOL)</span>
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="input input-bordered w-full"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            step="0.01"
            min="0.01"
          />
          <div className="text-sm text-gray-600 mt-1">
            Available: {balances.SOL.toFixed(6)} SOL
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
            onClick={handleStake}
            disabled={!publicKey || isLoading || !stakeAmount}
          >
            {isLoading ? 'Staking...' : 'Stake SOL'}
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

          {stakingInfo && stakingInfo.userStakeAmount > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn btn-success w-full ${isLoading ? 'loading' : ''}`}
                onClick={handleClaimRewards}
                disabled={!publicKey || isLoading || !stakingInfo.canClaim || stakingInfo.pendingRewards <= 0}
              >
                {isLoading ? 'Claiming...' : `Claim ${stakingInfo.pendingRewards.toFixed(4)} GOLD`}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn btn-warning w-full ${isLoading ? 'loading' : ''}`}
                onClick={handleUnstake}
                disabled={!publicKey || isLoading || !stakingInfo.canUnstake}
              >
                {isLoading ? 'Unstaking...' : `Unstake ${stakingInfo.userStakeAmount.toFixed(4)} SOL`}
              </motion.button>
            </>
          )}
        </div>

        {/* Smart Contract Notice */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Smart contract integration coming soon! 
            This is currently a simulation. Real staking will be available after deployment.
          </p>
        </div>
      </div>
    </div>
  );
}; 