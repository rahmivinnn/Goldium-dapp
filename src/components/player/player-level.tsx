import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDataFetch } from '@utils/use-data-fetch';
import Link from 'next/link';

interface PlayerLevelProps {
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlayerLevel: React.FC<PlayerLevelProps> = ({
  showDetails = true,
  size = 'md',
  className = '',
}) => {
  const { publicKey, connected } = useWallet();
  
  // Mock data - in a real app, this would come from an API
  const playerData = {
    username: "GoldenEggMaster",
    level: 42,
    experience: 8750,
    nextLevelExp: 10000,
    rank: "Egg Master",
  };
  
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];
  
  if (!connected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
            <span>?</span>
          </div>
        </div>
        <span className={sizeClass}>Connect wallet</span>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className="avatar">
          <div className="w-8 rounded-full ring ring-goldium-500 ring-offset-base-100 ring-offset-2">
            <img src="/images/egg-avatar.png" alt="Profile" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`font-bold ${sizeClass}`}>{playerData.username}</span>
            <span className="badge badge-sm badge-goldium">Lvl {playerData.level}</span>
          </div>
          
          {showDetails && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-goldium-500 h-1.5 rounded-full" 
                  style={{ width: `${(playerData.experience / playerData.nextLevelExp) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs mt-0.5">{playerData.experience} / {playerData.nextLevelExp} XP</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerLevel;
