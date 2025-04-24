import React from 'react';
import Link from 'next/link';
import { useSound } from '@components/common/sound-manager';

export interface ListingCardProps {
  id: string;
  name: string;
  collection?: string;
  imageUrl?: string;
  rarity?: string;
  price: number;
  seller: string;
  listedAt: string;
  expiresAt?: string;
  onClick?: () => void;
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  name,
  collection,
  imageUrl,
  rarity = 'Common',
  price,
  seller,
  listedAt,
  expiresAt,
  onClick,
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Truncate seller address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  return (
    <div 
      className={`card bg-base-100 shadow-xl card-hover ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <figure className="px-4 pt-4">
        <img 
          src={imageUrl || "/images/placeholder-nft.png"} 
          alt={name} 
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">{name}</h2>
        <p className="text-sm">{collection}</p>
        
        <div className="flex justify-between items-center mt-2">
          <span className={`badge ${rarityColor}`}>
            {rarity}
          </span>
          <span className="font-bold text-goldium-600">{price} GOLD</span>
        </div>
        
        <div className="text-xs opacity-70 mt-2">
          <div className="flex justify-between">
            <span>Seller:</span>
            <span>{truncateAddress(seller)}</span>
          </div>
          <div className="flex justify-between">
            <span>Listed:</span>
            <span>{formatDate(listedAt)}</span>
          </div>
          {expiresAt && (
            <div className="flex justify-between">
              <span>Expires:</span>
              <span>{formatDate(expiresAt)}</span>
            </div>
          )}
        </div>
        
        <div className="card-actions justify-end mt-2">
          <Link href={`/marketplace/${id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
