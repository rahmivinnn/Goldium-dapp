import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { FC, useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  lessons: number;
  icon: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  date: string;
  featured: boolean;
}

const Education: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const todayDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const courses: Course[] = [
    {
      id: '1',
      title: 'Introduction to DeFi',
      description: 'Learn the fundamentals of decentralized finance and how it\'s revolutionizing traditional banking.',
      duration: '2 hours',
      level: 'Beginner',
      category: 'DeFi Basics',
      lessons: 8,
      icon: '📚'
    },
    {
      id: '2',
      title: 'Solana Blockchain Deep Dive',
      description: 'Explore Solana\'s high-performance blockchain and understand its unique features.',
      duration: '3 hours',
      level: 'Intermediate',
      category: 'Blockchain',
      lessons: 12,
      icon: '⚡'
    },
    {
      id: '3',
      title: 'Trading Strategies for Crypto',
      description: 'Master advanced trading techniques and risk management in cryptocurrency markets.',
      duration: '4 hours',
      level: 'Advanced',
      category: 'Trading',
      lessons: 15,
      icon: '📈'
    },
    {
      id: '4',
      title: 'NFT Fundamentals',
      description: 'Understand non-fungible tokens, their use cases, and how to evaluate NFT projects.',
      duration: '2.5 hours',
      level: 'Beginner',
      category: 'NFTs',
      lessons: 10,
      icon: '🎨'
    },
    {
      id: '5',
      title: 'Smart Contract Development',
      description: 'Learn to build and deploy smart contracts on Solana using Rust and Anchor.',
      duration: '6 hours',
      level: 'Advanced',
      category: 'Development',
      lessons: 20,
      icon: '🔧'
    },
    {
      id: '6',
      title: 'Yield Farming & Staking',
      description: 'Discover how to maximize your returns through yield farming and staking strategies.',
      duration: '3.5 hours',
      level: 'Intermediate',
      category: 'DeFi Basics',
      lessons: 14,
      icon: '🌾'
    }
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'The Future of DeFi: What to Expect in 2024',
      excerpt: 'Explore the latest trends and innovations shaping the decentralized finance landscape.',
      readTime: '8 min read',
      category: 'DeFi Trends',
      date: 'Dec 15, 2024',
      featured: true
    },
    {
      id: '2',
      title: 'Understanding Solana\'s Proof of Stake',
      excerpt: 'Deep dive into Solana\'s consensus mechanism and how it achieves high performance.',
      readTime: '12 min read',
      category: 'Blockchain',
      date: 'Dec 12, 2024',
      featured: false
    },
    {
      id: '3',
      title: 'Risk Management in Crypto Trading',
      excerpt: 'Essential strategies to protect your capital while trading cryptocurrencies.',
      readTime: '10 min read',
      category: 'Trading',
      date: 'Dec 10, 2024',
      featured: false
    },
    {
      id: '4',
      title: 'The Rise of Play-to-Earn Gaming',
      excerpt: 'How blockchain gaming is creating new economic opportunities for players.',
      readTime: '6 min read',
      category: 'Gaming',
      date: 'Dec 8, 2024',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'DeFi Basics', name: 'DeFi Basics', icon: '💰' },
    { id: 'Blockchain', name: 'Blockchain', icon: '🔗' },
    { id: 'Trading', name: 'Trading', icon: '📈' },
    { id: 'NFTs', name: 'NFTs', icon: '🎨' },
    { id: 'Development', name: 'Development', icon: '💻' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <Layout>
      <Head>
        <title>Education - Goldium.io</title>
        <meta name="description" content="Learn about DeFi, blockchain, trading, and cryptocurrency with comprehensive educational resources" />
      </Head>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Educational Hub
            </h1>
            <p className="text-xl text-white mb-6">
              Master DeFi, blockchain, and cryptocurrency trading with our comprehensive learning resources
            </p>
          </div>

          {/* Daily Solana Education */}
          <div className="mb-8">
            <div className="bg-black/80 rounded-xl p-6 border border-cyan-500/30">
              <div className="flex items-center mb-2">
                <span className="text-cyan-400 font-medium text-sm">Solana Education</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-300 text-sm">{todayDate}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">What is Solana?</h2>
              <p className="text-white">Solana is a high-performance blockchain supporting fast transactions and low fees, making it ideal for DeFi, NFTs, and Web3 applications.</p>
            </div>
          </div>

          {/* Goldium Token Info */}
          <div className="mb-8">
            <div className="bg-black/80 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 font-medium text-sm">Goldium Token Info</span>
              </div>
              <ul className="text-white text-sm list-disc ml-6">
                <li>Total Supply: 1,000,000,000 GOLD</li>
                <li>Contract: <span className="text-yellow-300 font-mono">APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump</span></li>
                <li>Utility: Staking, NFT, Games, and the Goldium.io DeFi ecosystem</li>
              </ul>
            </div>
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            {articles.filter(article => article.featured).map(article => (
              <div key={article.id} className="bg-black/80 rounded-xl p-8 border border-yellow-500/30">
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 font-medium text-sm">Featured Article</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-300 text-sm">{article.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{article.title}</h2>
                <p className="text-white mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span className="bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded-full text-xs">{article.category}</span>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-300 font-medium">Read More →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === category.id ? 'bg-yellow-500 text-white' : 'bg-black/80 text-white hover:bg-yellow-900/30'}`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-black/80 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700">
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 text-center">
                    <div className="text-4xl mb-3">{course.icon}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>{course.level}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-white text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {course.lessons} lessons</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200">Start Learning</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.filter(article => !article.featured).map(article => (
                <div key={article.id} className="bg-black/80 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-900/60 text-white px-2 py-1 rounded-full text-xs">{article.category}</span>
                    <span className="text-gray-300 text-sm">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-white text-sm mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{article.readTime}</span>
                    <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎯 Recommended Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">DeFi Basics</h3>
                <p className="text-gray-600 text-sm">
                  Understand the fundamentals of decentralized finance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
                <p className="text-gray-600 text-sm">
                  Learn about Solana and blockchain technology
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trading</h3>
                <p className="text-gray-600 text-sm">
                  Master crypto trading strategies
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced</h3>
                <p className="text-gray-600 text-sm">
                  Explore advanced DeFi concepts
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of learners mastering DeFi and blockchain technology
            </p>
            <Link href="/dapp" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Education;