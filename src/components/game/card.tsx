import React from 'react';
import { useSound } from '@components/common/sound-manager';

export interface CardProps {
  id: number;
  name: string;
  power: number;
  health: number;
  type: string;
  rarity?: string;
  imageUrl?: string;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  name,
  power,
  health,
  type,
  rarity = 'Common',
  imageUrl,
  description,
  onClick,
  selected = false,
  disabled = false,
  showDetails = true,
  className = '',
}) => {
  const { playSound } = useSound();
  
  const handleClick = () => {
    if (disabled) return;
    
    playSound('card');
    if (onClick) onClick();
  };
  
  const handleMouseEnter = () => {
    if (disabled) return;
    playSound('hover');
  };
  
  const rarityColor = {
    'Common': 'badge-ghost',
    'Uncommon': 'badge-success',
    'Rare': 'badge-info',
    'Epic': 'badge-primary',
    'Legendary': 'badge-secondary',
  }[rarity] || 'badge-ghost';
  
  const typeColor = {
    'Normal': 'bg-gray-200',
    'Fire': 'bg-red-100',
    'Water': 'bg-blue-100',
    'Earth': 'bg-green-100',
    'Wind': 'bg-cyan-100',
    'Thunder': 'bg-yellow-100',
    'Ice': 'bg-indigo-100',
    'Light': 'bg-amber-100',
    'Dark': 'bg-purple-100',
    'Dragon': 'bg-rose-100',
  }[type] || 'bg-gray-200';
  
  return (
    <div 
      className={`game-card ${selected ? 'ring-2 ring-primary' : ''} ${disabled ? 'opacity-60' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <div className="game-card-inner">
        <div className={`game-card-front ${typeColor}`}>
          <div className="text-center mb-2">
            <h4 className="font-bold text-sm">{name}</h4>
            <div className="flex justify-center gap-1">
              <span className="badge badge-sm">{type}</span>
              {rarity && <span className={`badge badge-sm ${rarityColor}`}>{rarity}</span>}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <img 
              src={imageUrl || "/images/placeholder-card.png"} 
              alt={name} 
              className="h-24 w-24 object-contain egg-bounce"
            />
          </div>
          
          <div className="flex justify-between mt-2">
            <div className="badge badge-sm badge-error">ATK: {power}</div>
            <div className="badge badge-sm badge-success">HP: {health}</div>
          </div>
          
          {showDetails && description && (
            <div className="mt-2 text-xs text-center opacity-80">
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </div>
          )}
        </div>
        
        <div className="game-card-back">
          <img 
            src="/images/card-back.png" 
            alt="Card Back" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
