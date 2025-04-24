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
      className={`nft-card card-hover ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <figure className="px-4 pt-4">
        <img
          src={imageUrl || "/images/placeholder-nft.png"}
          alt={name}
          className="rounded-xl h-48 w-full object-cover"
          onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
          loading="lazy"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg flex justify-between">
          {name}
          {rarity && (
            <span className={`badge ${rarityColor}`}>
              {rarity}
            </span>
          )}
        </h2>

        {collection && <p className="text-sm opacity-70">{collection}</p>}

        {traits && traits.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {traits.slice(0, 3).map((trait, index) => (
              <span key={index} className="badge badge-sm badge-outline">{trait.value}</span>
            ))}
            {traits.length > 3 && <span className="badge badge-sm badge-outline">+{traits.length - 3}</span>}
          </div>
        )}

        {showPrice && price !== undefined && (
          <div className="mt-2">
            <span className="font-bold text-goldium-600">{price} GOLD</span>
          </div>
        )}

        <div className="card-actions justify-end mt-2">
          {showLink && (
            <Link
              href={linkUrl || `/gallery/${id}`}
              className="btn btn-sm btn-primary"
              onClick={(e) => e.stopPropagation()}
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
