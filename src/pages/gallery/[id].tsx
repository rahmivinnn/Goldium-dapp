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

// Mock NFT data
const mockNfts = [
  {
    id: "1",
    name: "Golden Egg #1234",
    collection: "Genesis Collection",
    owner: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-1.png",
    rarity: "Rare",
    mintDate: "2023-01-15",
    description: "A rare golden egg from the Genesis Collection. This egg has a unique golden pattern and glows in the dark.",
    traits: [
      { trait_type: "Background", value: "Gold" },
      { trait_type: "Shell", value: "Cracked" },
      { trait_type: "Eyes", value: "Blue" },
      { trait_type: "Mouth", value: "Smile" },
      { trait_type: "Accessory", value: "Crown" },
    ],
    stats: {
      power: 7,
      health: 5,
      speed: 6,
      intelligence: 8,
    },
    history: [
      { type: "Mint", from: "Goldium", to: "User1", price: null, date: "2023-01-15" },
      { type: "Transfer", from: "User1", to: "User2", price: null, date: "2023-02-20" },
      { type: "Sale", from: "User2", to: "User3", price: 80, date: "2023-03-15" },
    ],
    lore: "This golden egg was discovered in the ancient ruins of the Solana Temple. Legend says it contains the spirit of a powerful dragon that will hatch when the time is right.",
  },
  {
    id: "2",
    name: "Fire Egg #5678",
    collection: "Elemental Collection",
    owner: "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E",
    imageUrl: "/images/nft-2.png",
    rarity: "Epic",
    mintDate: "2023-02-10",
    description: "An epic fire egg from the Elemental Collection. This egg radiates heat and has a fiery aura.",
    traits: [
      { trait_type: "Background", value: "Flames" },
      { trait_type: "Shell", value: "Smooth" },
      { trait_type: "Eyes", value: "Red" },
      { trait_type: "Mouth", value: "Grin" },
      { trait_type: "Accessory", value: "Flame Halo" },
    ],
    stats: {
      power: 9,
      health: 4,
      speed: 7,
      intelligence: 6,
    },
    history: [
      { type: "Mint", from: "Goldium", to: "User5", price: null, date: "2023-02-10" },
      { type: "Sale", from: "User5", to: "User6", price: 200, date: "2023-03-05" },
    ],
    lore: "Born in the heart of a volcano, this fire egg contains the essence of pure flame. Its bearer gains resistance to fire and can control flames at will.",
  },
];

const GalleryDetailPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { id } = router.query;
  const { playSound } = useSound();

  const [isListing, setIsListing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  // Find the NFT by ID
  const nft = mockNfts.find(nft => nft.id === id);

  // Handle list for sale
  const handleListForSale = () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    playSound('click');
    router.push(`/marketplace/create-listing?nft=${id}`);
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

  // Share NFT
  const shareNft = () => {
    playSound('click');

    if (navigator.share) {
      navigator.share({
        title: nft?.name,
        text: `Check out my ${nft?.name} NFT on Goldium.io!`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!nft) {
    return (
      <>
        <Head>
          <title>{APP_NAME} - NFT Not Found</title>
          <meta
            name="description"
            content="The requested NFT could not be found"
          />
        </Head>
        <DrawerContainer>
          <PageContainer>
            <Header twitterHandle={twitterHandle} />

            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
              <p className="mb-6">The NFT you are looking for does not exist or has been removed.</p>
              <Link href="/gallery" className="btn btn-goldium">
                Back to Gallery
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
        <title>{APP_NAME} - {nft.name}</title>
        <meta
          name="description"
          content={`${nft.name} - ${nft.collection} - ${nft.rarity} - ${nft.description}`}
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />

          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Link href="/gallery" className="btn btn-sm btn-ghost mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Gallery
                </Link>
                <h1 className="text-3xl font-bold">{nft.name}</h1>
                <p>{nft.collection}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* NFT Image */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
                  <div className="relative group">
                    <figure className="px-6 pt-6 overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-goldium-400 to-goldium-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                      <img
                        src={nft.imageUrl || "/images/placeholder-nft.png"}
                        alt={nft.name}
                        className="rounded-xl w-full object-cover egg-float shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
                        loading="lazy"
                      />
                      <div className="absolute top-8 right-8 z-10">
                        <span className={`badge ${
                          nft.rarity === "Legendary" ? "badge-secondary" :
                          nft.rarity === "Epic" ? "badge-primary" :
                          nft.rarity === "Rare" ? "badge-info" :
                          nft.rarity === "Uncommon" ? "badge-success" :
                          "badge-ghost"
                        } shadow-lg`}>
                          {nft.rarity}
                        </span>
                      </div>
                    </figure>
                  </div>

                  <div className="card-body">
                    <div className="flex justify-center gap-4 mb-2">
                      <button
                        className="btn btn-circle btn-sm btn-ghost tooltip"
                        data-tip="View Full Size"
                        onClick={() => window.open(nft.imageUrl || "/images/placeholder-nft.png", "_blank")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-circle btn-sm btn-ghost tooltip"
                        data-tip="Share"
                        onClick={shareNft}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-circle btn-sm btn-ghost tooltip"
                        data-tip="Add to Favorites"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      {connected && (
                        <button
                          className="btn btn-goldium btn-3d btn-block gap-2 transform transition-transform duration-200 hover:scale-105 active:scale-95"
                          onClick={handleListForSale}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          List for Sale
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="card-body">
                    <h2 className="card-title flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Owner
                    </h2>

                    <div className="bg-base-200 p-3 rounded-lg mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Address:</span>
                        <div className="flex items-center">
                          <span className="font-mono">{truncateAddress(nft.owner)}</span>
                          <button
                            className="btn btn-xs btn-circle btn-ghost ml-1 tooltip"
                            data-tip="Copy Address"
                            onClick={() => {
                              navigator.clipboard.writeText(nft.owner);
                              // Show toast notification
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span>Mint Date:</span>
                        <span className="badge badge-ghost">{formatDate(nft.mintDate)}</span>
                      </div>

                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span>Ownership Duration:</span>
                        <span className="badge badge-primary">3 months, 12 days</span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-sm btn-outline gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFT Details */}
              <div className="lg:col-span-2">
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    {/* Tabs */}
                    <div className="tabs tabs-boxed mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      <a
                        className={`tab gap-2 transition-all duration-200 ${activeTab === 'details' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('details')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveTab('details');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Details
                      </a>
                      <a
                        className={`tab gap-2 transition-all duration-200 ${activeTab === 'stats' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveTab('stats');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Stats
                      </a>
                      <a
                        className={`tab gap-2 transition-all duration-200 ${activeTab === 'history' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('history')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveTab('history');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        History
                      </a>
                      <a
                        className={`tab gap-2 transition-all duration-200 ${activeTab === 'lore' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('lore')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveTab('lore');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Lore
                      </a>
                    </div>

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div>
                        <h2 className="card-title">Description</h2>
                        <p className="mb-4">{nft.description}</p>

                        <h3 className="font-bold mt-6 mb-2">Traits</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {nft.traits.map((trait, index) => (
                            <div key={index} className="bg-base-200 p-3 rounded-box">
                              <p className="text-xs opacity-70">{trait.trait_type}</p>
                              <p className="font-bold">{trait.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                      <div>
                        <h2 className="card-title">Card Stats</h2>
                        <p className="mb-4">These stats determine how this card performs in battles.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Power</span>
                              <span className="label-text-alt">{nft.stats.power}/10</span>
                            </label>
                            <progress
                              className="progress progress-error"
                              value={nft.stats.power}
                              max="10"
                            ></progress>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text">Health</span>
                              <span className="label-text-alt">{nft.stats.health}/10</span>
                            </label>
                            <progress
                              className="progress progress-success"
                              value={nft.stats.health}
                              max="10"
                            ></progress>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text">Speed</span>
                              <span className="label-text-alt">{nft.stats.speed}/10</span>
                            </label>
                            <progress
                              className="progress progress-info"
                              value={nft.stats.speed}
                              max="10"
                            ></progress>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text">Intelligence</span>
                              <span className="label-text-alt">{nft.stats.intelligence}/10</span>
                            </label>
                            <progress
                              className="progress progress-warning"
                              value={nft.stats.intelligence}
                              max="10"
                            ></progress>
                          </div>
                        </div>

                        <div className="alert alert-info mt-6">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span>Use this card in the game to take advantage of its unique stats!</span>
                        </div>
                      </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                      <div>
                        <h2 className="card-title">Transaction History</h2>
                        <p className="mb-4">A record of all transactions involving this NFT.</p>

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
                              {nft.history.map((event, index) => (
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
                    )}

                    {/* Lore Tab */}
                    {activeTab === 'lore' && (
                      <div>
                        <h2 className="card-title">Lore</h2>
                        <p className="mb-4">The story behind this golden egg.</p>

                        <div className="bg-base-200 p-4 rounded-box">
                          <p className="italic">{nft.lore}</p>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-bold mb-2">Special Abilities</h3>
                          <ul className="list-disc list-inside space-y-2">
                            <li>Can be used in the card game as a playable character</li>
                            <li>Grants special bonuses based on its traits and rarity</li>
                            <li>Can be evolved by combining with other eggs or items</li>
                            <li>Provides access to exclusive game modes and areas</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Similar NFTs */}
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="card-body">
                    <h2 className="card-title flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Similar NFTs
                    </h2>

                    <div className="carousel carousel-center max-w-full p-4 space-x-4 rounded-box">
                      {mockNfts.filter(item => item.id !== nft.id).map((item, index) => (
                        <div key={item.id} className="carousel-item">
                          <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300 w-48"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                              opacity: 0,
                              animation: 'fadeIn 0.5s ease-out forwards',
                              animationDelay: `${index * 0.1 + 0.5}s`
                            }}
                          >
                            <figure className="px-2 pt-2 relative overflow-hidden">
                              <img
                                src={item.imageUrl || "/images/placeholder-nft.png"}
                                alt={item.name}
                                className="rounded-xl h-32 w-full object-cover transform transition-transform duration-500 hover:scale-110"
                                onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
                                loading="lazy"
                              />
                              <div className="absolute top-3 right-3">
                                <span className={`badge badge-sm ${
                                  item.rarity === "Legendary" ? "badge-secondary" :
                                  item.rarity === "Epic" ? "badge-primary" :
                                  item.rarity === "Rare" ? "badge-info" :
                                  item.rarity === "Uncommon" ? "badge-success" :
                                  "badge-ghost"
                                }`}>
                                  {item.rarity}
                                </span>
                              </div>
                            </figure>
                            <div className="card-body p-3">
                              <h3 className="card-title text-sm">{item.name}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                <img src="/images/gold-token-icon.png" alt="GOLD" className="w-4 h-4" />
                                <span className="text-xs font-bold text-goldium-600">{Math.floor(Math.random() * 100) + 10} GOLD</span>
                              </div>
                              <div className="card-actions justify-end mt-2">
                                <Link
                                  href={`/gallery/${item.id}`}
                                  className="btn btn-xs btn-primary hover:scale-105 transition-transform duration-200"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-4">
                      <button className="btn btn-sm btn-outline gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        View More
                      </button>
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

export default GalleryDetailPage;
