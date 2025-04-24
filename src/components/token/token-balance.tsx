import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDataFetch } from '@utils/use-data-fetch';
import Link from 'next/link';

interface TokenBalanceProps {
  showButtons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({
  showButtons = true,
  size = 'md',
  className = '',
}) => {
  const { publicKey, connected } = useWallet();
  
  // Mock data - in a real app, this would come from an API
  const goldBalance = 1250;
  const goldPrice = 0.05; // in USD
  
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];
  
  if (!connected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img src="/images/gold-token-icon.png" alt="GOLD Token" className="h-6 w-6" />
        <span className={`font-bold ${sizeClass}`}>Connect wallet to view balance</span>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2">
        <img src="/images/gold-token-icon.png" alt="GOLD Token" className="h-6 w-6" />
        <span className={`font-bold ${sizeClass}`}>{goldBalance} GOLD</span>
        <span className="text-xs opacity-70">(${(goldBalance * goldPrice).toFixed(2)})</span>
      </div>
      
      {showButtons && (
        <div className="flex gap-2 mt-2">
          <Link href="/staking" className="btn btn-xs btn-goldium">Stake</Link>
          <Link href="/daily-claim" className="btn btn-xs btn-outline">Daily Claim</Link>
        </div>
      )}
    </div>
  );
};

export default TokenBalance;
