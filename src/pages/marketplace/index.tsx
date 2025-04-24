import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
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

// Mock marketplace data
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
  },
  {
    id: "3",
    name: "Dragon Egg #9012",
    collection: "Mythic Collection",
    price: 500,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-3.png",
    rarity: "Legendary",
    listedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Water Egg #3456",
    collection: "Elemental Collection",
    price: 150,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-4.png",
    rarity: "Rare",
    listedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Earth Egg #7890",
    collection: "Elemental Collection",
    price: 200,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-5.png",
    rarity: "Epic",
    listedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Phoenix Egg #1357",
    collection: "Mythic Collection",
    price: 750,
    seller: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-6.png",
    rarity: "Legendary",
    listedAt: new Date().toISOString(),
  },
];

const MarketplacePage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [filter, setFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  // Filter and sort listings
  const filteredListings = React.useMemo(() => {
    let result = [...mockListings];
    
    // Filter by rarity
    if (filter !== "all") {
      result = result.filter(listing => listing.rarity.toLowerCase() === filter.toLowerCase());
    }
    
    // Filter by price range
    result = result.filter(listing => 
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(listing => 
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.collection.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime());
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rarity":
        const rarityOrder = { "Common": 0, "Uncommon": 1, "Rare": 2, "Epic": 3, "Legendary": 4 };
        result.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        break;
      default:
        break;
    }
    
    return result;
  }, [filter, sortBy, priceRange, searchTerm]);

  return (
    <>
      <Head>
        <title>{APP_NAME} - Marketplace</title>
        <meta
          name="description"
          content="Buy, sell, and trade golden egg NFTs in the marketplace"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          {/* Marketplace Header */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">NFT Marketplace</h1>
                <p>Buy, sell, and trade golden egg NFTs using GOLD tokens</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Link href="/marketplace/create-listing" className="btn btn-goldium">
                  Create Listing
                </Link>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Search NFTs..." 
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="form-control">
                <select 
                  className="select select-bordered w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              
              <div className="form-control">
                <select 
                  className="select select-bordered w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rarity">Rarity: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="form-label">Price Range (GOLD)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={priceRange[1]} 
                  className="range range-primary" 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <span>{priceRange[0]} - {priceRange[1]} GOLD</span>
              </div>
            </div>
          </div>
          
          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="card bg-base-100 shadow-xl card-hover">
                <figure className="px-4 pt-4">
                  <img 
                    src={listing.imageUrl || "/images/placeholder-nft.png"} 
                    alt={listing.name} 
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg">{listing.name}</h2>
                  <p className="text-sm">{listing.collection}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`badge ${
                      listing.rarity === "Legendary" ? "badge-secondary" :
                      listing.rarity === "Epic" ? "badge-primary" :
                      listing.rarity === "Rare" ? "badge-info" :
                      "badge-ghost"
                    }`}>
                      {listing.rarity}
                    </span>
                    <span className="font-bold text-goldium-600">{listing.price} GOLD</span>
                  </div>
                  
                  <div className="card-actions justify-end mt-2">
                    <Link href={`/marketplace/${listing.id}`} className="btn btn-sm btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">No Listings Found</h2>
              <p className="mb-6">Try adjusting your filters to see more results.</p>
              <button 
                className="btn btn-goldium"
                onClick={() => {
                  setFilter("all");
                  setSortBy("newest");
                  setPriceRange([0, 1000]);
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Featured Collections */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img src="/images/genesis-collection.png" alt="Genesis Collection" className="rounded-xl" />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title">Genesis Collection</h3>
                  <p>Floor Price: 100 GOLD</p>
                  <div className="card-actions justify-end">
                    <Link href="/marketplace?collection=genesis" className="btn btn-sm btn-primary">View Collection</Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img src="/images/elemental-collection.png" alt="Elemental Collection" className="rounded-xl" />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title">Elemental Collection</h3>
                  <p>Floor Price: 150 GOLD</p>
                  <div className="card-actions justify-end">
                    <Link href="/marketplace?collection=elemental" className="btn btn-sm btn-primary">View Collection</Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img src="/images/mythic-collection.png" alt="Mythic Collection" className="rounded-xl" />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title">Mythic Collection</h3>
                  <p>Floor Price: 500 GOLD</p>
                  <div className="card-actions justify-end">
                    <Link href="/marketplace?collection=mythic" className="btn btn-sm btn-primary">View Collection</Link>
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

export default MarketplacePage;
