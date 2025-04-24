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
                <div className="card bg-base-100 shadow-xl">
                  <figure className="px-6 pt-6">
                    <img
                      src={nft.imageUrl || "/images/placeholder-nft.png"}
                      alt={nft.name}
                      className="rounded-xl w-full object-cover egg-bounce"
                      onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
                      loading="lazy"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <span className={`badge ${
                        nft.rarity === "Legendary" ? "badge-secondary" :
                        nft.rarity === "Epic" ? "badge-primary" :
                        nft.rarity === "Rare" ? "badge-info" :
                        nft.rarity === "Uncommon" ? "badge-success" :
                        "badge-ghost"
                      }`}>
                        {nft.rarity}
                      </span>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-circle btn-ghost btn-sm"
                          onClick={shareNft}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      {connected && (
                        <button
                          className="btn btn-primary btn-block"
                          onClick={handleListForSale}
                        >
                          List for Sale
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="card bg-base-100 shadow-xl mt-6">
                  <div className="card-body">
                    <h2 className="card-title">Owner</h2>

                    <div className="flex justify-between items-center mt-2">
                      <span>Address:</span>
                      <span>{truncateAddress(nft.owner)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm opacity-70">
                      <span>Mint Date:</span>
                      <span>{formatDate(nft.mintDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFT Details */}
              <div className="lg:col-span-2">
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    {/* Tabs */}
                    <div className="tabs tabs-boxed mb-4">
                      <a
                        className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('details')}
                      >
                        Details
                      </a>
                      <a
                        className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                      >
                        Stats
                      </a>
                      <a
                        className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('history')}
                      >
                        History
                      </a>
                      <a
                        className={`tab ${activeTab === 'lore' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('lore')}
                      >
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
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">Similar NFTs</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {mockNfts.filter(item => item.id !== nft.id).map((item) => (
                        <div key={item.id} className="card bg-base-200">
                          <figure className="px-2 pt-2">
                            <img
                              src={item.imageUrl || "/images/placeholder-nft.png"}
                              alt={item.name}
                              className="rounded-xl h-24 w-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
                              loading="lazy"
                            />
                          </figure>
                          <div className="card-body p-2">
                            <h3 className="card-title text-sm">{item.name}</h3>
                            <span className={`badge badge-sm ${
                              item.rarity === "Legendary" ? "badge-secondary" :
                              item.rarity === "Epic" ? "badge-primary" :
                              item.rarity === "Rare" ? "badge-info" :
                              item.rarity === "Uncommon" ? "badge-success" :
                              "badge-ghost"
                            }`}>
                              {item.rarity}
                            </span>
                            <div className="card-actions justify-end mt-2">
                              <Link href={`/gallery/${item.id}`} className="btn btn-xs btn-primary">
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
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
