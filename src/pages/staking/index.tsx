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
import { APP_DESCRIPTION, APP_NAME, STAKING_YIELD_RATE } from "@utils/globals";
import Link from "next/link";

const StakingPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = React.useState("stake");
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [stakeDuration, setStakeDuration] = React.useState("30");
  const [unstakeAmount, setUnstakeAmount] = React.useState("");

  // Mock data
  const [goldBalance, setGoldBalance] = React.useState(1000);
  const [stakedAmount, setStakedAmount] = React.useState(500);
  const [rewards, setRewards] = React.useState(25);
  const [stakingHistory, setStakingHistory] = React.useState([
    { id: 1, amount: 200, duration: 30, startDate: "2023-04-01", endDate: "2023-05-01", status: "completed", reward: 10 },
    { id: 2, amount: 300, duration: 60, startDate: "2023-05-15", endDate: "2023-07-14", status: "active", reward: 15 },
  ]);

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  // Calculate estimated rewards
  const calculateRewards = (amount: number, days: number) => {
    return (amount * STAKING_YIELD_RATE * days / 365).toFixed(2);
  };

  // Handle staking
  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amount = parseFloat(stakeAmount);
    const duration = parseInt(stakeDuration);
    
    if (amount > goldBalance) return;
    
    // Mock staking process
    setGoldBalance(prev => prev - amount);
    setStakedAmount(prev => prev + amount);
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);
    
    const newStake = {
      id: stakingHistory.length + 1,
      amount,
      duration,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "active",
      reward: parseFloat(calculateRewards(amount, duration)),
    };
    
    setStakingHistory(prev => [...prev, newStake]);
    setStakeAmount("");
  };

  // Handle unstaking
  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    
    const amount = parseFloat(unstakeAmount);
    
    if (amount > stakedAmount) return;
    
    // Mock unstaking process
    setGoldBalance(prev => prev + amount);
    setStakedAmount(prev => prev - amount);
    setUnstakeAmount("");
  };

  // Handle claiming rewards
  const handleClaimRewards = () => {
    setGoldBalance(prev => prev + rewards);
    setRewards(0);
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Staking</title>
        <meta
          name="description"
          content="Stake your GOLD tokens to earn rewards"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          {/* Staking Header */}
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <h1 className="text-4xl font-bold mb-4">GOLD Token Staking</h1>
            <p className="mb-6">Stake your GOLD tokens to earn rewards and unlock exclusive benefits!</p>
            
            {connected ? (
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">GOLD Balance</div>
                  <div className="stat-value text-primary">{goldBalance}</div>
                  <div className="stat-desc">Available to stake</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Staked GOLD</div>
                  <div className="stat-value">{stakedAmount}</div>
                  <div className="stat-desc">Currently earning {(STAKING_YIELD_RATE * 100).toFixed(2)}% APY</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Pending Rewards</div>
                  <div className="stat-value text-secondary">{rewards}</div>
                  <div className="stat-desc">
                    <button 
                      className="btn btn-xs btn-secondary mt-1"
                      onClick={handleClaimRewards}
                      disabled={rewards <= 0}
                    >
                      Claim Rewards
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Connect your wallet to start staking GOLD tokens.</span>
              </div>
            )}
          </div>
          
          {connected && (
            <>
              {/* Staking Tabs */}
              <div className="tabs tabs-boxed mb-6">
                <a 
                  className={`tab ${activeTab === 'stake' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('stake')}
                >
                  Stake
                </a>
                <a 
                  className={`tab ${activeTab === 'unstake' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('unstake')}
                >
                  Unstake
                </a>
                <a 
                  className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  History
                </a>
              </div>
              
              {/* Stake Tab */}
              {activeTab === 'stake' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Stake GOLD Tokens</h2>
                    <p>Stake your GOLD tokens to earn {(STAKING_YIELD_RATE * 100).toFixed(2)}% APY.</p>
                    
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Amount to Stake</span>
                      </label>
                      <div className="input-group">
                        <input 
                          type="number" 
                          placeholder="0" 
                          className="input input-bordered w-full max-w-xs" 
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                        />
                        <button 
                          className="btn btn-square"
                          onClick={() => setStakeAmount(goldBalance.toString())}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-control w-full max-w-xs mt-4">
                      <label className="label">
                        <span className="label-text">Staking Duration</span>
                      </label>
                      <select 
                        className="select select-bordered"
                        value={stakeDuration}
                        onChange={(e) => setStakeDuration(e.target.value)}
                      >
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="180">180 Days</option>
                        <option value="365">365 Days</option>
                      </select>
                    </div>
                    
                    {stakeAmount && parseFloat(stakeAmount) > 0 && (
                      <div className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>
                          Estimated Rewards: {calculateRewards(parseFloat(stakeAmount), parseInt(stakeDuration))} GOLD
                        </span>
                      </div>
                    )}
                    
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-goldium"
                        onClick={handleStake}
                        disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > goldBalance}
                      >
                        Stake GOLD
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Unstake Tab */}
              {activeTab === 'unstake' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Unstake GOLD Tokens</h2>
                    <p>Unstake your GOLD tokens to return them to your wallet.</p>
                    
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Amount to Unstake</span>
                      </label>
                      <div className="input-group">
                        <input 
                          type="number" 
                          placeholder="0" 
                          className="input input-bordered w-full max-w-xs" 
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                        />
                        <button 
                          className="btn btn-square"
                          onClick={() => setUnstakeAmount(stakedAmount.toString())}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    
                    <div className="alert alert-warning mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span>Unstaking before the end of your staking period may result in reduced rewards.</span>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-goldium"
                        onClick={handleUnstake}
                        disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > stakedAmount}
                      >
                        Unstake GOLD
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="card bg-base-100 shadow-xl mb-8">
                  <div className="card-body">
                    <h2 className="card-title">Staking History</h2>
                    <p>View your staking history and rewards.</p>
                    
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Duration</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stakingHistory.map((stake) => (
                            <tr key={stake.id}>
                              <td>{stake.amount} GOLD</td>
                              <td>{stake.duration} days</td>
                              <td>{stake.startDate}</td>
                              <td>{stake.endDate}</td>
                              <td>
                                <span className={`badge ${
                                  stake.status === 'active' ? 'badge-primary' : 
                                  stake.status === 'completed' ? 'badge-success' : 
                                  'badge-warning'
                                }`}>
                                  {stake.status}
                                </span>
                              </td>
                              <td>{stake.reward} GOLD</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {stakingHistory.length === 0 && (
                      <div className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>You have no staking history yet. Start staking to earn rewards!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Staking Benefits */}
              <div className="bg-base-200 p-6 rounded-box mb-8">
                <h2 className="text-2xl font-bold mb-4">Staking Benefits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Earn Passive Income</h3>
                      <p>Earn {(STAKING_YIELD_RATE * 100).toFixed(2)}% APY on your staked GOLD tokens.</p>
                    </div>
                  </div>
                  
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Unlock Rare Cards</h3>
                      <p>Stake 1000+ GOLD to unlock access to rare and legendary cards.</p>
                    </div>
                  </div>
                  
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Governance Rights</h3>
                      <p>Stakers get voting rights on future game features and updates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
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

export default StakingPage;
