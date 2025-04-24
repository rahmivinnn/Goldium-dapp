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
      className={`game-card transform transition-all duration-300
        ${selected ? 'ring-4 ring-primary scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label={`Card: ${name}`}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          handleClick();
        }
      }}
    >
      <div className="game-card-inner relative">
        <div className={`game-card-front ${typeColor} rounded-lg p-3 shadow-md`}>
          <div className="text-center mb-2">
            <h4 className="font-bold text-sm">{name}</h4>
            <div className="flex justify-center gap-1 mt-1">
              <span className="badge badge-sm">{type}</span>
              {rarity && <span className={`badge badge-sm ${rarityColor}`}>{rarity}</span>}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full filter blur-md"></div>
            <img
              src={imageUrl || "/images/placeholder-card.png"}
              alt={name}
              className="h-24 w-24 object-contain egg-bounce relative z-10"
              onError={(e) => { e.currentTarget.src = "/images/placeholder-card.png"; }}
              loading="lazy"
            />
          </div>

          <div className="flex justify-between mt-3">
            <div className="badge badge-sm badge-error gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
              </svg>
              {power}
            </div>
            <div className="badge badge-sm badge-success gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {health}
            </div>
          </div>

          {showDetails && description && (
            <div className="mt-2 text-xs text-center opacity-80 bg-white bg-opacity-50 p-1 rounded">
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </div>
          )}

          {selected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
        </div>

        <div className="game-card-back rounded-lg overflow-hidden">
          <img
            src="/images/card-back.png"
            alt="Card Back"
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = "/images/placeholder-card.png"; }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
