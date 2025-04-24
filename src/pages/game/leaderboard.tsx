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

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, username: "GoldenEggMaster", level: 78, wins: 542, losses: 87, winRate: 86.2, goldEarned: 25840 },
  { rank: 2, username: "SolanaKing", level: 65, wins: 489, losses: 102, winRate: 82.7, goldEarned: 21560 },
  { rank: 3, username: "EggWarrior", level: 71, wins: 476, losses: 124, winRate: 79.3, goldEarned: 19870 },
  { rank: 4, username: "CryptoEgg", level: 59, wins: 412, losses: 98, winRate: 80.8, goldEarned: 17650 },
  { rank: 5, username: "GoldenGoose", level: 62, wins: 398, losses: 112, winRate: 78.0, goldEarned: 16920 },
  { rank: 6, username: "EggCollector", level: 54, wins: 367, losses: 143, winRate: 72.0, goldEarned: 15480 },
  { rank: 7, username: "SolanaEgg", level: 49, wins: 342, losses: 128, winRate: 72.8, goldEarned: 14320 },
  { rank: 8, username: "GoldRush", level: 51, wins: 329, losses: 115, winRate: 74.1, goldEarned: 13750 },
  { rank: 9, username: "EggHunter", level: 47, wins: 312, losses: 132, winRate: 70.3, goldEarned: 12980 },
  { rank: 10, username: "CryptoChamp", level: 45, wins: 298, losses: 124, winRate: 70.6, goldEarned: 12450 },
];

// Mock seasons data
const mockSeasons = [
  { id: "current", name: "Season 5: Golden Dawn", startDate: "2023-07-01", endDate: "2023-09-30", status: "active" },
  { id: "4", name: "Season 4: Elemental Fury", startDate: "2023-04-01", endDate: "2023-06-30", status: "completed" },
  { id: "3", name: "Season 3: Dragon's Awakening", startDate: "2023-01-01", endDate: "2023-03-31", status: "completed" },
  { id: "2", name: "Season 2: Winter Solstice", startDate: "2022-10-01", endDate: "2022-12-31", status: "completed" },
  { id: "1", name: "Season 1: Genesis", startDate: "2022-07-01", endDate: "2022-09-30", status: "completed" },
];

const LeaderboardPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState("global");
  const [selectedSeason, setSelectedSeason] = useState("current");
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Get current player rank
  const currentPlayerRank = mockLeaderboard.find(player => player.username === "GoldenEggMaster")?.rank || 0;
  
  // Get current season
  const currentSeason = mockSeasons.find(season => season.id === selectedSeason);
  
  return (
    <>
      <Head>
        <title>{APP_NAME} - Leaderboard</title>
        <meta
          name="description"
          content="View the top players in the Goldium card game"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Link href="/game" className="btn btn-sm btn-ghost mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Game
                </Link>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p>See who's on top of the Goldium card game rankings</p>
              </div>
              
              {currentSeason && (
                <div className="text-right">
                  <h2 className="text-xl font-bold">{currentSeason.name}</h2>
                  <p className="text-sm opacity-70">
                    {new Date(currentSeason.startDate).toLocaleDateString()} - {new Date(currentSeason.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Season Selector */}
            <div className="flex justify-end mb-6">
              <select 
                className="select select-bordered"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                {mockSeasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
              <a 
                className={`tab ${activeTab === 'global' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('global')}
              >
                Global
              </a>
              <a 
                className={`tab ${activeTab === 'friends' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </a>
              <a 
                className={`tab ${activeTab === 'guild' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('guild')}
              >
                Guild
              </a>
            </div>
            
            {/* Player Highlight */}
            {connected && (
              <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                  <h2 className="card-title">Your Ranking</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Player</th>
                          <th>Level</th>
                          <th>Win Rate</th>
                          <th>Wins</th>
                          <th>Losses</th>
                          <th>GOLD Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-base-200">
                          <td>
                            <span className="font-bold">{currentPlayerRank}</span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar">
                                <div className="w-8 rounded-full ring ring-goldium-500 ring-offset-base-100 ring-offset-2">
                                  <img src="/images/egg-avatar.png" alt="Avatar" />
                                </div>
                              </div>
                              <span className="font-bold">GoldenEggMaster</span>
                              <span className="badge badge-sm">You</span>
                            </div>
                          </td>
                          <td>78</td>
                          <td>86.2%</td>
                          <td>542</td>
                          <td>87</td>
                          <td>25,840</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Leaderboard Table */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Top Players</h2>
                
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Level</th>
                        <th>Win Rate</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>GOLD Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLeaderboard.map((player) => (
                        <tr key={player.rank} className={player.username === "GoldenEggMaster" ? "bg-base-200" : ""}>
                          <td>
                            {player.rank <= 3 ? (
                              <div className="avatar placeholder">
                                <div className={`bg-${
                                  player.rank === 1 ? "goldium" : 
                                  player.rank === 2 ? "base-300" : 
                                  "amber"
                                }-500 text-neutral-content rounded-full w-8`}>
                                  <span>{player.rank}</span>
                                </div>
                              </div>
                            ) : (
                              <span>{player.rank}</span>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img src={`/images/avatar-${player.rank}.png`} alt="Avatar" />
                                </div>
                              </div>
                              <span className="font-bold">{player.username}</span>
                              {player.username === "GoldenEggMaster" && (
                                <span className="badge badge-sm">You</span>
                              )}
                            </div>
                          </td>
                          <td>{player.level}</td>
                          <td>{player.winRate}%</td>
                          <td>{player.wins}</td>
                          <td>{player.losses}</td>
                          <td>{player.goldEarned.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mt-4">
                  <div className="btn-group">
                    <button className="btn btn-sm">«</button>
                    <button className="btn btn-sm btn-active">1</button>
                    <button className="btn btn-sm">2</button>
                    <button className="btn btn-sm">3</button>
                    <button className="btn btn-sm">»</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Season Rewards */}
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <h2 className="card-title">Season Rewards</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="card bg-gradient-to-br from-goldium-300 to-goldium-500 text-neutral-content shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">1st Place</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>10,000 GOLD tokens</li>
                        <li>Exclusive Legendary NFT</li>
                        <li>Season Champion Title</li>
                        <li>Special Card Back</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-base-300 to-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">2nd Place</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>5,000 GOLD tokens</li>
                        <li>Epic NFT</li>
                        <li>Season Runner-up Title</li>
                        <li>Special Avatar Frame</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-amber-300 to-amber-500 text-neutral-content shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">3rd Place</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>2,500 GOLD tokens</li>
                        <li>Rare NFT</li>
                        <li>Season Finalist Title</li>
                        <li>Special Emote</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-info mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>All players who reach Level 20+ during the season will receive a participation reward!</span>
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

export default LeaderboardPage;
