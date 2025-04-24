import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useDataFetch } from "@utils/use-data-fetch";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME } from "@utils/globals";
import Link from "next/link";
import { ItemData } from "@components/home/item";

const GalleryPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [filter, setFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const { data: nfts } = useDataFetch<Array<ItemData>>(
    connected && publicKey ? `/api/items/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  return (
    <>
      <Head>
        <title>{APP_NAME} - NFT Gallery</title>
        <meta
          name="description"
          content="Explore your collection of golden egg NFTs"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />

          {/* Gallery Header */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <h1 className="text-4xl font-bold mb-4">NFT Gallery</h1>
            <p className="mb-6">Explore your collection of golden egg NFTs and their unique traits!</p>

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex flex-wrap gap-4">
                <button
                  className={`btn ${filter === 'all' ? 'btn-goldium' : 'btn-outline'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`btn ${filter === 'common' ? 'btn-goldium' : 'btn-outline'}`}
                  onClick={() => setFilter('common')}
                >
                  Common
                </button>
                <button
                  className={`btn ${filter === 'rare' ? 'btn-goldium' : 'btn-outline'}`}
                  onClick={() => setFilter('rare')}
                >
                  Rare
                </button>
                <button
                  className={`btn ${filter === 'epic' ? 'btn-goldium' : 'btn-outline'}`}
                  onClick={() => setFilter('epic')}
                >
                  Epic
                </button>
                <button
                  className={`btn ${filter === 'legendary' ? 'btn-goldium' : 'btn-outline'}`}
                  onClick={() => setFilter('legendary')}
                >
                  Legendary
                </button>
              </div>

              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rarity">Rarity (High to Low)</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          {connected ? (
            nfts && nfts.length > 0 ? (
              <div className="mb-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {nfts.map((nft, index) => (
                    <div
                      key={nft.tokenAddress}
                      className="nft-card card-hover transform transition-all duration-300"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards',
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <figure className="relative px-4 pt-4 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10"></div>
                        <img
                          src={nft.imageUrl || "/images/placeholder-nft.png"}
                          alt={nft.name}
                          className="rounded-xl h-48 w-full object-cover transform transition-transform duration-500 hover:scale-110"
                          onError={(e) => { e.currentTarget.src = "/images/placeholder-nft.png"; }}
                          loading="lazy"
                        />
                      </figure>
                      <div className="card-body p-4">
                        <h2 className="card-title text-lg">{nft.name}</h2>
                        <p className="text-sm opacity-70">{nft.collectionName}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {nft.traits && nft.traits.slice(0, 3).map((trait, index) => (
                            <span key={index} className="badge badge-primary badge-sm">{trait.value}</span>
                          ))}
                          {nft.traits && nft.traits.length > 3 && (
                            <span className="badge badge-sm badge-outline tooltip" data-tip="Click to see all traits">
                              +{nft.traits.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="card-actions justify-end mt-2">
                          <Link
                            href={`/gallery/${nft.tokenAddress}`}
                            className="btn btn-sm btn-primary hover:scale-105 transition-transform duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-base-200 rounded-box mb-8 animate-fade-in shadow-lg">
                <div className="flex flex-col items-center">
                  <img src="/images/placeholder-nft.png" alt="No NFTs" className="w-32 h-32 mb-4 opacity-50" />
                  <h2 className="text-2xl font-bold mb-4">No NFTs Found</h2>
                  <p className="mb-6">You don&apos;t have any golden egg NFTs in your wallet yet.</p>
                  <Link href="/marketplace" className="btn btn-goldium btn-3d">
                    <span className="mr-2">🛒</span>
                    Explore Marketplace
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-box mb-8 animate-fade-in shadow-lg">
              <div className="flex flex-col items-center">
                <img src="/images/gold-token-icon.png" alt="Connect Wallet" className="w-32 h-32 mb-4 egg-bounce" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="mb-6">Connect your wallet to view your golden egg NFT collection.</p>
                <WalletMultiButton className="btn btn-goldium btn-3d">
                  <span className="mr-2">🔗</span>
                  Connect Wallet
                </WalletMultiButton>
              </div>
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
                  <p>The original golden egg characters that started it all.</p>
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
                  <p>Golden eggs infused with elemental powers.</p>
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
                  <p>Legendary golden eggs with mythical abilities.</p>
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

export default GalleryPage;
