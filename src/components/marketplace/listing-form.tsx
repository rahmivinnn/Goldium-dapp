import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSound } from '@components/common/sound-manager';
import { toast } from 'react-hot-toast';
import { ButtonLoading } from '@components/common/loading';

interface NFTItem {
  id: string;
  name: string;
  imageUrl?: string;
  collection?: string;
  rarity?: string;
}

interface ListingFormProps {
  nfts: NFTItem[];
  onSubmit: (data: ListingFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface ListingFormData {
  nftId: string;
  price: number;
  duration: number;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  nfts,
  onSubmit,
  isLoading = false,
}) => {
  const { connected } = useWallet();
  const { playSound } = useSound();

  const [selectedNft, setSelectedNft] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('7');

  const handleNftSelect = (nftId: string) => {
    playSound('click');
    setSelectedNft(nftId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedNft) {
      toast.error('Please select an NFT to list');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    playSound('click');

    try {
      await onSubmit({
        nftId: selectedNft,
        price: parseFloat(price),
        duration: parseInt(duration),
      });

      // Reset form
      setSelectedNft('');
      setPrice('');
      setDuration('7');

      playSound('success');
    } catch (error) {
      console.error('Error creating listing:', error);
      playSound('error');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create Listing</h2>
        <p>List your NFT on the marketplace to sell for GOLD tokens.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Select NFT</span>
            </label>

            {nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-2">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${selectedNft === nft.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleNftSelect(nft.id)}
                  >
                    <figure className="px-2 pt-2">
                      <img
                        src={nft.imageUrl || "/images/placeholder-nft.png"}
                        alt={nft.name}
                        className="rounded-xl h-24 w-full object-cover"
                      />
                    </figure>
                    <div className="card-body p-2">
                      <h3 className="card-title text-sm">{nft.name}</h3>
                      {nft.collection && <p className="text-xs">{nft.collection}</p>}
                      {nft.rarity && <span className="badge badge-sm">{nft.rarity}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>You don&apos;t have any NFTs to list. Visit the gallery to get started!</span>
              </div>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Price (GOLD)</span>
            </label>
            <input
              type="number"
              placeholder="Enter price in GOLD tokens"
              className="input input-bordered"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Listing Duration</span>
            </label>
            <select
              className="select select-bordered"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          <div className="card-actions justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !connected || !selectedNft || !price || parseFloat(price) <= 0}
            >
              {isLoading ? <ButtonLoading /> : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
