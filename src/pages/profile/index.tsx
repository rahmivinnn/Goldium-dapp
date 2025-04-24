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
import { ItemData } from "@components/home/item";

const ProfilePage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = React.useState("overview");

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const { data: nfts } = useDataFetch<Array<ItemData>>(
    connected && publicKey ? `/api/items/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  // Mock player data
  const playerData = {
    username: "GoldenEggMaster",
    level: 42,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: "2023-01-15",
    totalGames: 256,
    wins: 178,
    losses: 78,
    winRate: 69.5,
    goldBalance: 1250,
    stakedGold: 500,
    nftCount: nfts?.length || 0,
    achievements: [
      { id: 1, name: "First Victory", description: "Win your first game", completed: true, date: "2023-01-16" },
      { id: 2, name: "Collector", description: "Own 10 different NFTs", completed: true, date: "2023-02-05" },
      { id: 3, name: "High Roller", description: "Stake 500+ GOLD tokens", completed: true, date: "2023-03-10" },
      { id: 4, name: "Winning Streak", description: "Win 10 games in a row", completed: true, date: "2023-04-22" },
      { id: 5, name: "Master Tactician", description: "Win 100 games", completed: true, date: "2023-06-30" },
      { id: 6, name: "Legendary Collection", description: "Own a legendary NFT", completed: false, date: null },
    ],
    recentGames: [
      { id: 1, opponent: "EggWarrior", result: "win", date: "2023-07-15", goldEarned: 25 },
      { id: 2, opponent: "SolanaKing", result: "loss", date: "2023-07-14", goldEarned: 0 },
      { id: 3, opponent: "CryptoEgg", result: "win", date: "2023-07-12", goldEarned: 30 },
      { id: 4, opponent: "GoldenGoose", result: "win", date: "2023-07-10", goldEarned: 20 },
      { id: 5, opponent: "EggCollector", result: "loss", date: "2023-07-08", goldEarned: 0 },
    ],
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Player Profile</title>
        <meta
          name="description"
          content="View your player profile, achievements, and game history"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />

          {connected ? (
            <>
              {/* Profile Header */}
              <div className="bg-base-200 p-6 rounded-box mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-goldium-500 ring-offset-base-100 ring-offset-2">
                      <img src="/images/egg-avatar.png" alt="Profile" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                      <div>
                        <h1 className="text-3xl font-bold">{playerData.username}</h1>
                        <p className="text-sm opacity-70">Joined {playerData.joinDate}</p>
                      </div>

                      <div className="mt-4 md:mt-0">
                        <Link href="/profile/edit" className="btn btn-sm btn-goldium">
                          Edit Profile
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">Level {playerData.level}</span>
                        <div className="badge badge-primary">Egg Master</div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-goldium-500 h-2.5 rounded-full"
                          style={{ width: `${(playerData.experience / playerData.nextLevelExp) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{playerData.experience} / {playerData.nextLevelExp} XP</p>
                    </div>

                    <div className="stats stats-vertical lg:stats-horizontal shadow mt-4">
                      <div className="stat">
                        <div className="stat-title">Games</div>
                        <div className="stat-value">{playerData.totalGames}</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Win Rate</div>
                        <div className="stat-value">{playerData.winRate}%</div>
                        <div className="stat-desc">{playerData.wins}W - {playerData.losses}L</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">GOLD</div>
                        <div className="stat-value">{playerData.goldBalance}</div>
                        <div className="stat-desc">{playerData.stakedGold} staked</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">NFTs</div>
                        <div className="stat-value">{playerData.nftCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="tabs tabs-boxed mb-6">
                <a
                  className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </a>
                <a
                  className={`tab ${activeTab === 'achievements' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </a>
                <a
                  className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  Game History
                </a>
                <a
                  className={`tab ${activeTab === 'inventory' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  Inventory
                </a>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Recent Games */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Recent Games</h2>

                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>Opponent</th>
                              <th>Result</th>
                              <th>Date</th>
                              <th>GOLD</th>
                            </tr>
                          </thead>
                          <tbody>
                            {playerData.recentGames.map((game) => (
                              <tr key={game.id}>
                                <td>{game.opponent}</td>
                                <td>
                                  <span className={`badge ${
                                    game.result === 'win' ? 'badge-success' : 'badge-error'
                                  }`}>
                                    {game.result.toUpperCase()}
                                  </span>
                                </td>
                                <td>{game.date}</td>
                                <td>+{game.goldEarned}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <Link href="/game/history" className="btn btn-sm btn-primary">
                          View All Games
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Recent Achievements</h2>

                      <div className="space-y-4">
                        {playerData.achievements
                          .filter(a => a.completed)
                          .slice(0, 3)
                          .map((achievement) => (
                            <div key={achievement.id} className="flex items-center gap-4">
                              <div className="bg-goldium-500 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-bold">{achievement.name}</h3>
                                <p className="text-sm">{achievement.description}</p>
                                <p className="text-xs opacity-70">Completed on {achievement.date}</p>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setActiveTab('achievements')}
                        >
                          View All Achievements
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Featured NFTs */}
                  <div className="card bg-base-100 shadow-xl md:col-span-2">
                    <div className="card-body">
                      <h2 className="card-title">Featured NFTs</h2>

                      {nfts && nfts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {nfts.slice(0, 4).map((nft) => (
                            <div key={nft.tokenAddress} className="card bg-base-200">
                              <figure className="px-4 pt-4">
                                <img
                                  src={nft.imageUrl || "/images/placeholder-nft.png"}
                                  alt={nft.name}
                                  className="rounded-xl h-32 w-full object-cover"
                                />
                              </figure>
                              <div className="card-body p-4">
                                <h3 className="card-title text-sm">{nft.name}</h3>
                                <div className="card-actions justify-end">
                                  <Link href={`/gallery/${nft.tokenAddress}`} className="btn btn-xs btn-primary">
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span>You don&apos;t have any NFTs yet. Visit the marketplace to get started!</span>
                        </div>
                      )}

                      <div className="card-actions justify-end mt-4">
                        <Link href="/gallery" className="btn btn-sm btn-primary">
                          View All NFTs
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Achievements</h2>
                    <p>Track your progress and earn rewards for completing achievements.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {playerData.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`card ${achievement.completed ? 'bg-base-200' : 'bg-base-300 opacity-70'}`}
                        >
                          <div className="card-body p-4">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${achievement.completed ? 'bg-success' : 'bg-base-content bg-opacity-20'}`}>
                                {achievement.completed ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold">{achievement.name}</h3>
                                <p className="text-sm">{achievement.description}</p>
                                {achievement.completed && (
                                  <p className="text-xs opacity-70">Completed on {achievement.date}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Game History Tab */}
              {activeTab === 'history' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Game History</h2>
                    <p>View your past games and performance.</p>

                    <div className="stats shadow mt-4 mb-6">
                      <div className="stat">
                        <div className="stat-title">Total Games</div>
                        <div className="stat-value">{playerData.totalGames}</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Wins</div>
                        <div className="stat-value text-success">{playerData.wins}</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Losses</div>
                        <div className="stat-value text-error">{playerData.losses}</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Win Rate</div>
                        <div className="stat-value">{playerData.winRate}%</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Opponent</th>
                            <th>Result</th>
                            <th>Date</th>
                            <th>GOLD</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerData.recentGames.map((game) => (
                            <tr key={game.id}>
                              <td>{game.opponent}</td>
                              <td>
                                <span className={`badge ${
                                  game.result === 'win' ? 'badge-success' : 'badge-error'
                                }`}>
                                  {game.result.toUpperCase()}
                                </span>
                              </td>
                              <td>{game.date}</td>
                              <td>+{game.goldEarned}</td>
                              <td>
                                <Link href={`/game/replay/${game.id}`} className="btn btn-xs btn-primary">
                                  Watch Replay
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Inventory</h2>
                    <p>Manage your cards, items, and resources.</p>

                    <div className="tabs mt-4">
                      <a className="tab tab-bordered tab-active">Cards</a>
                      <a className="tab tab-bordered">Items</a>
                      <a className="tab tab-bordered">Resources</a>
                    </div>

                    {nfts && nfts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        {nfts.map((nft) => (
                          <div key={nft.tokenAddress} className="card bg-base-200">
                            <figure className="px-4 pt-4">
                              <img
                                src={nft.imageUrl || "/images/placeholder-nft.png"}
                                alt={nft.name}
                                className="rounded-xl h-32 w-full object-cover"
                              />
                            </figure>
                            <div className="card-body p-4">
                              <h3 className="card-title text-sm">{nft.name}</h3>
                              <div className="card-actions justify-end">
                                <Link href={`/gallery/${nft.tokenAddress}`} className="btn btn-xs btn-primary">
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>You don&apos;t have any cards yet. Visit the marketplace to get started!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="mb-6">Connect your wallet to view your profile.</p>
              <button className="btn btn-goldium">Connect Wallet</button>
            </div>
          )}

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

export default ProfilePage;
