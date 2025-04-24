import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDataFetch } from "@utils/use-data-fetch";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME } from "@utils/globals";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSound } from "@components/common/sound-manager";
import { ButtonLoading } from "@components/common/loading";

// Mock listing data
const mockListings = [
  {
    id: "1",
    name: "Golden Egg #1234",
    collection: "Genesis Collection",
    price: 100,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-1.png",
    rarity: "Rare",
    listedAt: new Date().toISOString(),
    description: "A rare golden egg from the Genesis Collection. This egg has a unique golden pattern and glows in the dark.",
    traits: [
      { trait_type: "Background", value: "Gold" },
      { trait_type: "Shell", value: "Cracked" },
      { trait_type: "Eyes", value: "Blue" },
      { trait_type: "Mouth", value: "Smile" },
      { trait_type: "Accessory", value: "Crown" },
    ],
    history: [
      { type: "Mint", from: "Goldium", to: "User1", price: null, date: "2023-01-15" },
      { type: "Transfer", from: "User1", to: "User2", price: null, date: "2023-02-20" },
      { type: "List", from: "User2", to: null, price: 80, date: "2023-03-10" },
      { type: "Sale", from: "User2", to: "User3", price: 80, date: "2023-03-15" },
      { type: "List", from: "User3", to: null, price: 100, date: "2023-04-05" },
    ],
  },
  {
    id: "2",
    name: "Fire Egg #5678",
    collection: "Elemental Collection",
    price: 250,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-2.png",
    rarity: "Epic",
    listedAt: new Date().toISOString(),
    description: "An epic fire egg from the Elemental Collection. This egg radiates heat and has a fiery aura.",
    traits: [
      { trait_type: "Background", value: "Flames" },
      { trait_type: "Shell", value: "Smooth" },
      { trait_type: "Eyes", value: "Red" },
      { trait_type: "Mouth", value: "Grin" },
      { trait_type: "Accessory", value: "Flame Halo" },
    ],
    history: [
      { type: "Mint", from: "Goldium", to: "User5", price: null, date: "2023-02-10" },
      { type: "List", from: "User5", to: null, price: 200, date: "2023-03-01" },
      { type: "Sale", from: "User5", to: "User6", price: 200, date: "2023-03-05" },
      { type: "List", from: "User6", to: null, price: 250, date: "2023-04-01" },
    ],
  },
];

const ListingDetailPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { id } = router.query;
  const { playSound } = useSound();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Find the listing by ID
  const listing = mockListings.find(listing => listing.id === id);
  
  // Handle purchase
  const handlePurchase = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsPurchasing(true);
    playSound('click');
    
    try {
      // In a real app, this would call an API to purchase the NFT
      console.log('Purchasing NFT:', listing?.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      playSound('success');
      toast.success('NFT purchased successfully!');
      
      // Redirect to gallery
      router.push('/gallery');
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      playSound('error');
      toast.error('Failed to purchase NFT. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Truncate address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  if (!listing) {
    return (
      <>
        <Head>
          <title>{APP_NAME} - Listing Not Found</title>
          <meta
            name="description"
            content="The requested listing could not be found"
          />
        </Head>
        <DrawerContainer>
          <PageContainer>
            <Header twitterHandle={twitterHandle} />
            
            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
              <p className="mb-6">The listing you are looking for does not exist or has been removed.</p>
              <Link href="/marketplace" className="btn btn-goldium">
                Back to Marketplace
              </Link>
            </div>
            
            <Footer />
          </PageContainer>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
            <Menu
              twitterHandle={twitterHandle}
              className="p-4 w-80 bg-base-100 text-base-content"
            />
          </div>
        </DrawerContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{APP_NAME} - {listing.name}</title>
        <meta
          name="description"
          content={`${listing.name} - ${listing.collection} - ${listing.rarity} - ${listing.price} GOLD`}
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Link href="/marketplace" className="btn btn-sm btn-ghost mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Marketplace
                </Link>
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <p>{listing.collection}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* NFT Image */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 shadow-xl">
                  <figure className="px-6 pt-6">
                    <img 
                      src={listing.imageUrl || "/images/placeholder-nft.png"} 
                      alt={listing.name} 
                      className="rounded-xl w-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <span className={`badge ${
                        listing.rarity === "Legendary" ? "badge-secondary" :
                        listing.rarity === "Epic" ? "badge-primary" :
                        listing.rarity === "Rare" ? "badge-info" :
                        listing.rarity === "Uncommon" ? "badge-success" :
                        "badge-ghost"
                      }`}>
                        {listing.rarity}
                      </span>
                      
                      <div className="flex gap-2">
                        <button className="btn btn-circle btn-ghost btn-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="btn btn-circle btn-ghost btn-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Purchase Card */}
                <div className="card bg-base-100 shadow-xl mt-6">
                  <div className="card-body">
                    <h2 className="card-title">Purchase</h2>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span>Price:</span>
                      <span className="text-2xl font-bold text-goldium-600">{listing.price} GOLD</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm opacity-70">
                      <span>Seller:</span>
                      <span>{truncateAddress(listing.seller)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm opacity-70">
                      <span>Listed:</span>
                      <span>{formatDate(listing.listedAt)}</span>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      {connected ? (
                        <button 
                          className="btn btn-primary btn-block"
                          onClick={handlePurchase}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? <ButtonLoading /> : 'Buy Now'}
                        </button>
                      ) : (
                        <button className="btn btn-primary btn-block">
                          Connect Wallet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* NFT Details */}
              <div className="lg:col-span-2">
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    <h2 className="card-title">Description</h2>
                    <p>{listing.description}</p>
                  </div>
                </div>
                
                {/* Traits */}
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    <h2 className="card-title">Traits</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {listing.traits.map((trait, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded-box">
                          <p className="text-xs opacity-70">{trait.trait_type}</p>
                          <p className="font-bold">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* History */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">History</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Event</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Price</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listing.history.map((event, index) => (
                            <tr key={index}>
                              <td>
                                <span className={`badge ${
                                  event.type === "Mint" ? "badge-success" :
                                  event.type === "Transfer" ? "badge-info" :
                                  event.type === "List" ? "badge-warning" :
                                  event.type === "Sale" ? "badge-primary" :
                                  "badge-ghost"
                                }`}>
                                  {event.type}
                                </span>
                              </td>
                              <td>{event.from}</td>
                              <td>{event.to || "-"}</td>
                              <td>{event.price ? `${event.price} GOLD` : "-"}</td>
                              <td>{event.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Footer />
        </PageContainer>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <Menu
            twitterHandle={twitterHandle}
            className="p-4 w-80 bg-base-100 text-base-content"
          />
        </div>
      </DrawerContainer>
    </>
  );
};

export default ListingDetailPage;
