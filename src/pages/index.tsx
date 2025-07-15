import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: NextPage = () => {
  const { publicKey, connect } = useWallet();

  const stats = [
    { label: 'Total Supply', value: '1,000,000,000 GOLD', change: '' },
    { label: 'Active Users (Live)', value: '--', change: 'Live from CA' },
    { label: 'SOL-GOLD Volume (Live)', value: '$1M+', change: 'Live from CA' },
    { label: "NFT's Minted (Live)", value: '--', change: 'Live from CA' },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast Trading',
      description: 'Trade SOL and GOLD tokens instantly with sub-second confirmation times on Solana.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🥚',
      title: 'Exclusive NFT Marketplace',
      description: 'Mint and trade unique Goldium Eggs with real utility and rewards.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🎮',
      title: 'Play-to-Earn Games',
      description: 'Earn GOLD tokens by playing our innovative blockchain games.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📚',
      title: 'Educational Hub',
      description: 'Learn about DeFi, blockchain, and trading with our comprehensive guides.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔒',
      title: 'Secure Staking',
      description: 'Stake your SOL to earn GOLD rewards with industry-leading security.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track your portfolio and market trends with advanced analytics.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Goldium.io - The Golden Future of DeFi</title>
        <meta name="description" content="Revolutionary DeFi platform with SOL-GOLD trading, NFT marketplace, games, and education. Join the golden revolution!" />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Welcome to the
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Golden Future
                </span>
              </h1>
            </div>
            <div className="animate-slide-up">
              <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
                Revolutionizing DeFi with innovative SOL-GOLD trading, exclusive NFT marketplace, 
                play-to-earn games, and comprehensive educational resources.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              {publicKey ? (
                <Link href="/dapp" className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden">
                  <span className="relative z-10">Connect Wallet</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <Link href="/dapp" className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden">
                  <span className="relative z-10">Connect Wallet</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              )}
              <p className="text-yellow-300 text-sm mt-2">Connect wallet from the top right button for best experience.</p>
              <Link href="/education" className="group relative border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center p-6 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-700 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white mb-1 group-hover:text-yellow-200 transition-colors duration-300">{stat.label}</div>
                  <div className="text-xs text-green-400 font-medium group-hover:text-green-300 transition-colors duration-300">{stat.change}</div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Goldium.io?
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Experience the next generation of DeFi with cutting-edge features designed for maximum efficiency and user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-yellow-500/50 hover:scale-105 relative overflow-hidden">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-glow`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white group-hover:text-yellow-200 transition-colors duration-300">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the Golden Revolution?
          </h2>
          <p className="text-xl text-white mb-8">
            Start trading, staking, and earning with Goldium.io today. 
            Experience the future of decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dapp" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
              Get Started Now
            </Link>
            <Link href="/about" className="border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 hover:text-white transition-all duration-200">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Updates
            </h2>
            <p className="text-xl text-white">
              Stay informed about the latest developments in the Goldium ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">December 15, 2024</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                New NFT Collection Launch
              </h3>
              <p className="text-white mb-4">
                Introducing the Golden Egg Collection - exclusive NFTs with real utility and rewards.
              </p>
              <Link href="/nft" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">December 10, 2024</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Staking Rewards Increased
              </h3>
              <p className="text-white mb-4">
                We've increased staking rewards to 15% APY for early adopters. Stake now!
              </p>
              <Link href="/dapp" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Start Staking →
              </Link>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">December 5, 2024</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                New Educational Content
              </h3>
              <p className="text-white mb-4">
                Comprehensive guides on DeFi strategies and Solana ecosystem now available.
              </p>
              <Link href="/education" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Explore →
              </Link>
            </div>
          </div>
    </div>
      </section>
    </Layout>
  );
};

export default Home;
