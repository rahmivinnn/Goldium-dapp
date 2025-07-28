import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import Link from "next/link";

const About: NextPage = () => {
  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Blockchain veteran with 8+ years in DeFi and cryptocurrency development.',
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Solana ecosystem expert and smart contract architect.',
      avatar: '👩‍💻'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Head of Product',
      bio: 'UX/UI specialist focused on creating intuitive DeFi experiences.',
      avatar: '👨‍🎨'
    },
    {
      name: 'Emma Wilson',
      role: 'Head of Marketing',
      bio: 'Crypto marketing strategist with deep community building experience.',
      avatar: '👩‍💼'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Goldium.io Launch',
      description: 'Successfully launched the platform with SOL-GOLD trading and staking features.'
    },
    {
      year: '2024',
      title: 'NFT Marketplace',
      description: 'Introduced exclusive Goldium Eggs NFT collection with real utility.'
    },
    {
      year: '2024',
      title: 'Play-to-Earn Games',
      description: 'Launched interactive games allowing users to earn GOLD tokens.'
    },
    {
      year: '2024',
      title: 'Educational Hub',
      description: 'Comprehensive learning resources for DeFi and blockchain education.'
    }
  ];

  const stats = [
    { label: 'Total Users', value: '125K+', icon: '👥' },
    { label: 'Total Volume', value: '$1M+', icon: '📊' },
    { label: 'NFTs Minted', value: '45K+', icon: '🎨' },
    { label: 'Countries', value: '50+', icon: '🌍' }
  ];

  return (
    <Layout>
      <Head>
        <title>About - Goldium.io</title>
        <meta name="description" content="Learn about Goldium.io&apos;s mission to revolutionize DeFi and our team of blockchain experts" />
      </Head>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About Goldium.io
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              We&apos;re revolutionizing decentralized finance by creating an accessible, 
              secure, and rewarding platform for everyone to participate in the future of finance.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <ul className="list-disc pl-6 text-white mb-6">
                  <li className="mb-2">Goldium&apos;s mission is to make DeFi accessible, secure, and rewarding for all users.</li>
                  <li className="mb-2">Our team&apos;s expertise spans blockchain development, finance, and user experience design.</li>
                </ul>
                <p className="text-white">We believe in transparency, security, and innovation as the core values driving Goldium&apos;s growth and success. &quot;Join us on this journey to revolutionize DeFi!&quot;</p>
                <p className="text-white">Goldium&apos;s vision is to empower users with cutting-edge DeFi tools and opportunities, making financial freedom a reality for everyone. &quot;Experience the future of finance with Goldium!&quot;</p>
                <div className="flex space-x-4">
                  <Link href="/dapp" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
                    Try Our DApp
                  </Link>
                  <Link href="/education" className="border-2 border-yellow-500 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-900/30 transition-all duration-200">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="bg-black/80 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Vision Statement
                  </h3>
                  <p className="text-white">
                    "To become the leading DeFi platform that bridges traditional finance 
                    with blockchain technology, making financial services accessible, 
                    transparent, and beneficial for everyone."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-black/80 rounded-xl p-6 text-center border border-gray-700">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/80 rounded-xl p-6 text-center border border-gray-700">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Security First</h3>
                <p className="text-white">
                  We prioritize the security of our users&apos; assets and data above everything else.
                </p>
              </div>
              <div className="bg-black/80 rounded-xl p-6 text-center border border-gray-700">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Accessibility</h3>
                <p className="text-white">
                  Making DeFi accessible to everyone, regardless of their technical background.
                </p>
              </div>
              <div className="bg-black/80 rounded-xl p-6 text-center border border-gray-700">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
                <p className="text-white">
                  Continuously pushing the boundaries of what&apos;s possible in DeFi.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-black/80 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 border border-gray-700">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-yellow-400 font-medium mb-3">{member.role}</p>
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Our Journey
            </h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4 bg-black/80 rounded-xl p-6 border border-gray-700">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                    <p className="text-white">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-16 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Built on Cutting-Edge Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Solana Blockchain</h3>
                <p className="text-gray-600">
                  Leveraging Solana&apos;s high-performance blockchain for lightning-fast transactions.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Anchor Framework</h3>
                <p className="text-gray-600">
                  Using Anchor for secure and efficient smart contract development.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Audits</h3>
                <p className="text-gray-600">
                  Regular security audits and best practices to protect user assets.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join the Golden Revolution
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Be part of the future of decentralized finance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dapp" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
                Start Trading
              </Link>
              <Link href="/education" className="border-2 border-yellow-500 text-yellow-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 transition-all duration-200">
                Learn DeFi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About; 