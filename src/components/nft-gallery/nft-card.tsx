import React from 'react';
import Link from 'next/link';
import { useSound } from '@components/common/sound-manager';

export interface NFTCardProps {
  id: string;
  name: string;
  collection?: string;
  imageUrl?: string;
  rarity?: string;
  traits?: Array<{ trait_type: string; value: string }>;
  price?: number;
  seller?: string;
  onClick?: () => void;
  showPrice?: boolean;
  showLink?: boolean;
  linkUrl?: string;
  className?: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  id,
  name,
  collection,
  imageUrl,
  rarity = 'Common',
  traits = [],
  price,
  seller,
  onClick,
  showPrice = false,
  showLink = true,
  linkUrl,
  className = '',
}) => {
  const { playSound } = useSound();

  const handleClick = () => {
    playSound('click');
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    playSound('hover');
  };

  const rarityColor = {
    'Common': 'badge-ghost',
    'Uncommon': 'badge-success',
    'Rare': 'badge-info',
    'Epic': 'badge-primary',
    'Legendary': 'badge-secondary',
  }[rarity] || 'badge-ghost';

  return (
    <div
      className={`nft-card card-hover group ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label={`NFT Card: ${name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="relative overflow-hidden px-4 pt-4">
        <figure className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10"></div>
          <img
            src={imageUrl || "/images/placeholder-nft.png"}
            alt={name}
            className="rounded-xl h-48 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
            loading="lazy"
          />
          {rarity && (
            <span className={`absolute top-2 right-2 badge ${rarityColor} z-20`}>
              {rarity}
            </span>
          )}
        </figure>
      </div>

      <div className="card-body p-4">
        <h2 className="card-title text-lg">
          {name}
        </h2>

        {collection && <p className="text-sm opacity-70">{collection}</p>}

        {traits && traits.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {traits.slice(0, 3).map((trait, index) => (
              <span key={index} className="badge badge-sm badge-outline">{trait.value}</span>
            ))}
            {traits.length > 3 && (
              <span className="badge badge-sm badge-outline tooltip" data-tip="Click to see all traits">
                +{traits.length - 3}
              </span>
            )}
          </div>
        )}

        {showPrice && price !== undefined && (
          <div className="mt-2 flex items-center">
            <img src="/images/gold-token-icon.png" alt="GOLD" className="w-5 h-5 mr-1" />
            <span className="font-bold text-goldium-600">{price} GOLD</span>
          </div>
        )}

        <div className="card-actions justify-end mt-2">
          {showLink && (
            <Link
              href={linkUrl || `/gallery/${id}`}
              className="btn btn-sm btn-primary hover:scale-105 transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
              }}
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
