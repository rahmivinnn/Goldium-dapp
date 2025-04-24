import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDataFetch } from "@utils/use-data-fetch";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME, DAILY_CLAIM_AMOUNT } from "@utils/globals";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSound } from "@components/common/sound-manager";
import { ButtonLoading } from "@components/common/loading";

const DailyClaimPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const { playSound } = useSound();
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastClaimDate, setLastClaimDate] = useState<Date | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>("");
  const [canClaim, setCanClaim] = useState(false);
  const [claimStreak, setClaimStreak] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Initialize claim data
  useEffect(() => {
    if (connected) {
      // In a real app, this would come from an API
      // For demo purposes, we'll use localStorage
      const storedLastClaimDate = localStorage.getItem('goldium-last-claim');
      const storedClaimStreak = localStorage.getItem('goldium-claim-streak');
      
      if (storedLastClaimDate) {
        const lastClaim = new Date(storedLastClaimDate);
        setLastClaimDate(lastClaim);
        
        // Check if 24 hours have passed since last claim
        const now = new Date();
        const timeDiff = now.getTime() - lastClaim.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
          setCanClaim(true);
        } else {
          setCanClaim(false);
          updateTimeUntilNextClaim(lastClaim);
        }
      } else {
        // First time claiming
        setCanClaim(true);
      }
      
      if (storedClaimStreak) {
        const streak = parseInt(storedClaimStreak);
        setClaimStreak(streak);
        
        // Calculate bonus based on streak
        const bonus = Math.min(streak * 2, 20); // Max 20% bonus
        setBonusAmount(Math.floor(DAILY_CLAIM_AMOUNT * (bonus / 100)));
      }
    }
  }, [connected]);
  
  // Update countdown timer
  useEffect(() => {
    if (!canClaim && lastClaimDate) {
      const timer = setInterval(() => {
        updateTimeUntilNextClaim(lastClaimDate);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [canClaim, lastClaimDate]);
  
  // Update time until next claim
  const updateTimeUntilNextClaim = (lastClaim: Date) => {
    const now = new Date();
    const nextClaimTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
    const timeRemaining = nextClaimTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      setCanClaim(true);
      setTimeUntilNextClaim("");
      return;
    }
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    setTimeUntilNextClaim(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };
  
  // Handle claim
  const handleClaim = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!canClaim) {
      toast.error('You can only claim once every 24 hours');
      return;
    }
    
    setIsClaiming(true);
    playSound('click');
    
    try {
      // In a real app, this would call an API to claim tokens
      // For demo purposes, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last claim date
      const now = new Date();
      setLastClaimDate(now);
      localStorage.setItem('goldium-last-claim', now.toISOString());
      
      // Update claim streak
      const newStreak = claimStreak + 1;
      setClaimStreak(newStreak);
      localStorage.setItem('goldium-claim-streak', newStreak.toString());
      
      // Calculate new bonus
      const newBonus = Math.min(newStreak * 2, 20); // Max 20% bonus
      const newBonusAmount = Math.floor(DAILY_CLAIM_AMOUNT * (newBonus / 100));
      setBonusAmount(newBonusAmount);
      
      setCanClaim(false);
      updateTimeUntilNextClaim(now);
      
      playSound('success');
      toast.success(`Claimed ${DAILY_CLAIM_AMOUNT + newBonusAmount} GOLD tokens!`);
    } catch (error) {
      console.error('Error claiming tokens:', error);
      playSound('error');
      toast.error('Failed to claim tokens. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Daily Claim</title>
        <meta
          name="description"
          content="Claim your daily GOLD tokens"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Daily Claim</h1>
                <p>Claim your daily GOLD tokens and build your streak for bonuses!</p>
              </div>
            </div>
            
            {connected ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Claim Card */}
                <div className="lg:col-span-2">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Daily Reward</h2>
                      
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative">
                          <img 
                            src="/images/gold-token-large.png" 
                            alt="GOLD Token" 
                            className="w-32 h-32 egg-bounce"
                          />
                          <div className="absolute top-0 right-0 bg-goldium-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                            {DAILY_CLAIM_AMOUNT}
                          </div>
                        </div>
                        
                        {bonusAmount > 0 && (
                          <div className="mt-4 bg-goldium-100 p-2 rounded-box">
                            <p className="text-center">
                              <span className="font-bold text-goldium-600">+{bonusAmount} Bonus</span> from {claimStreak} day streak!
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-6">
                          {canClaim ? (
                            <button 
                              className="btn btn-primary btn-lg"
                              onClick={handleClaim}
                              disabled={isClaiming}
                            >
                              {isClaiming ? <ButtonLoading /> : 'Claim Daily Reward'}
                            </button>
                          ) : (
                            <div className="text-center">
                              <p className="mb-2">Next claim available in:</p>
                              <div className="text-3xl font-bold">{timeUntilNextClaim}</div>
                              <p className="mt-4 text-sm opacity-70">
                                Last claimed: {lastClaimDate?.toLocaleDateString()} at {lastClaimDate?.toLocaleTimeString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Streak Info */}
                <div>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Claim Streak</h2>
                      
                      <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-goldium-600">{claimStreak}</div>
                          <p className="mt-2">Days in a row</p>
                        </div>
                      </div>
                      
                      <div className="divider">Streak Bonuses</div>
                      
                      <div className="space-y-4">
                        <div className={`flex justify-between items-center ${claimStreak >= 1 ? 'text-success' : 'opacity-50'}`}>
                          <span>1 Day</span>
                          <span>+2% Bonus</span>
                        </div>
                        <div className={`flex justify-between items-center ${claimStreak >= 3 ? 'text-success' : 'opacity-50'}`}>
                          <span>3 Days</span>
                          <span>+6% Bonus</span>
                        </div>
                        <div className={`flex justify-between items-center ${claimStreak >= 5 ? 'text-success' : 'opacity-50'}`}>
                          <span>5 Days</span>
                          <span>+10% Bonus</span>
                        </div>
                        <div className={`flex justify-between items-center ${claimStreak >= 7 ? 'text-success' : 'opacity-50'}`}>
                          <span>7 Days</span>
                          <span>+14% Bonus</span>
                        </div>
                        <div className={`flex justify-between items-center ${claimStreak >= 10 ? 'text-success' : 'opacity-50'}`}>
                          <span>10+ Days</span>
                          <span>+20% Bonus</span>
                        </div>
                      </div>
                      
                      <div className="alert alert-warning mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Missing a day will reset your streak!</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-base-100 shadow-xl mt-6">
                    <div className="card-body">
                      <h2 className="card-title">Other Ways to Earn</h2>
                      
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Win battles in the game</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Stake your GOLD tokens</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Complete achievements</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Participate in tournaments</span>
                        </li>
                      </ul>
                      
                      <div className="card-actions justify-end mt-4">
                        <Link href="/staking" className="btn btn-sm btn-primary">
                          Stake GOLD
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-base-100 rounded-box">
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="mb-6">Connect your wallet to claim your daily GOLD tokens.</p>
                <button className="btn btn-goldium">Connect Wallet</button>
              </div>
            )}
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

export default DailyClaimPage;
