import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import Link from "next/link";

const About: NextPage = () => {
  const stats = [
    { label: 'Following', value: '28', icon: '👥' },
    { label: 'Followers', value: '78', icon: '👥' },
    { label: 'Posts', value: 'Active', icon: '📝' },
    { label: 'Joined', value: 'March 2025', icon: '📅' }
  ];

  return (
    <Layout>
      <Head>
        <title>About - Goldium.io</title>
        <meta name="description" content="Learn about Goldium.io&apos;s mission to revolutionize DeFi and our team of blockchain experts" />
      </Head>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Twitter Profile Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 h-48 rounded-t-xl relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-black rounded-full border-4 border-white flex items-center justify-center">
                <img src="/logo.jpg" alt="Goldium Logo" className="w-20 h-20 rounded-full object-cover" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Follow
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-black/90 rounded-b-xl p-8 pt-20">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">GOLDIUM</h1>
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">@goldiumofficial</p>
            
            <div className="mb-4">
              <p className="text-white mb-2">Web3 Gaming & DeFi Platform | <a href="https://t.me/goldiumofficial" className="text-blue-400 hover:underline">t.me/goldiumofficial</a></p>
              <div className="flex items-center gap-4 text-gray-400">
                <span>📍 Solana Ecosystem</span>
                <span>🔗 <a href="https://goldium.io" className="text-blue-400 hover:underline">goldium.io</a></span>
                <span>📅 Joined March 2025</span>
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              <span className="text-white"><strong>28</strong> <span className="text-gray-400">Following</span></span>
              <span className="text-white"><strong>78</strong> <span className="text-gray-400">Followers</span></span>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8">
                <a href="#" className="text-white border-b-2 border-blue-500 pb-3 font-semibold">Posts</a>
                <a href="#" className="text-gray-400 pb-3 hover:text-white">Replies</a>
                <a href="#" className="text-gray-400 pb-3 hover:text-white">Highlights</a>
                <a href="#" className="text-gray-400 pb-3 hover:text-white">Media</a>
              </nav>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dapp" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
                Visit Our DApp
              </Link>
              <Link href="https://t.me/goldiumofficial" className="border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-900/30 transition-all duration-200">
                Join Telegram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;