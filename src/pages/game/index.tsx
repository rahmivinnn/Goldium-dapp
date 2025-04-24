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

const GamePage: NextPage = () => {
  const { publicKey, connected } = useWallet();

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  return (
    <>
      <Head>
        <title>{APP_NAME} - Card Game</title>
        <meta
          name="description"
          content="Play the 2D interactive card game with your golden egg characters"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          {/* Game Header */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <h1 className="text-4xl font-bold mb-4">Goldium Card Game</h1>
            <p className="mb-6">Battle with your golden egg characters in exciting PvP and PvE matches!</p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/game/play" className="btn btn-goldium">Play Now</Link>
              <Link href="/game/deck-builder" className="btn btn-skyblue">Deck Builder</Link>
              <Link href="/game/leaderboard" className="btn btn-outline">Leaderboard</Link>
            </div>
          </div>
          
          {/* Game Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img src="/images/pvp-mode.png" alt="PvP Mode" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">PvP Mode</h2>
                <p>Challenge other players in real-time battles. Climb the ranks and earn GOLD tokens!</p>
                <div className="card-actions">
                  <Link href="/game/play?mode=pvp" className="btn btn-primary">Play PvP</Link>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img src="/images/pve-mode.png" alt="PvE Mode" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">PvE Mode</h2>
                <p>Battle against AI opponents of varying difficulty. Practice your skills and earn rewards!</p>
                <div className="card-actions">
                  <Link href="/game/play?mode=pve" className="btn btn-primary">Play PvE</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Features */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <h2 className="text-2xl font-bold mb-4">Game Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Deck Building</h3>
                <p>Create powerful decks with your collection of golden egg character cards.</p>
              </div>
              
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Card Evolution</h3>
                <p>Evolve your cards by fusing them with other cards or special items.</p>
              </div>
              
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Special Abilities</h3>
                <p>Each card has unique abilities and traits that can turn the tide of battle.</p>
              </div>
              
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Tournaments</h3>
                <p>Participate in regular tournaments to win exclusive rewards and GOLD tokens.</p>
              </div>
              
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Seasons</h3>
                <p>Compete in seasonal ranked play with special themes and limited-time rewards.</p>
              </div>
              
              <div className="bg-base-100 p-4 rounded-box">
                <h3 className="font-bold text-lg mb-2">Achievements</h3>
                <p>Complete challenges and earn achievements to showcase your skills.</p>
              </div>
            </div>
          </div>
          
          {/* Coming Soon */}
          <div className="card w-full bg-gradient-to-r from-goldium-500 to-goldium-600 text-white shadow-xl mb-8">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center">Coming Soon: Guild Battles!</h2>
              <p>Form guilds with your friends and compete in massive guild vs guild battles for epic rewards!</p>
              <div className="card-actions justify-center mt-4">
                <button className="btn bg-white text-goldium-600 hover:bg-gray-200">Join Waitlist</button>
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

export default GamePage;
