import { FC, ReactNode, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParticleSystem } from './ParticleSystem';
import Notification from './Notification';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'DApp', href: '/dapp', icon: '⚡' },
    { name: 'NFT Marketplace', href: '/nft', icon: '🥚' },
    { name: 'Games', href: '/games', icon: '🎮' },
    { name: 'Education', href: '/education', icon: '📚' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ];

  const isActive = (path: string) => router.pathname === path;

  const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
  );

  return (
    <div className="min-h-screen bg-black relative">
      {/* Particle System */}
      <ParticleSystem />
      
      {/* Enhanced Galaxy Background */}
      <div className="absolute inset-0">
        {/* Nebula Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 w-full h-full bg-gradient-radial from-pink-900/20 via-transparent to-transparent"></div>
        
        {/* Animated Stars */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse opacity-80 shadow-lg shadow-white/50"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-90 shadow-lg shadow-blue-400/50"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-purple-400/50"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-bounce delay-1000 opacity-70 shadow-lg shadow-yellow-300/50"></div>
        <div className="absolute top-32 left-2/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-500 opacity-60 shadow-lg shadow-pink-400/50"></div>
        <div className="absolute top-96 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-700 opacity-90 shadow-lg shadow-cyan-400/50"></div>
        <div className="absolute top-64 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-300 opacity-70 shadow-lg shadow-green-400/50"></div>
        <div className="absolute top-48 left-1/6 w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-1200 opacity-80 shadow-lg shadow-orange-400/50"></div>
        <div className="absolute top-72 right-1/6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-800 opacity-60 shadow-lg shadow-indigo-400/50"></div>
        <div className="absolute top-88 left-3/4 w-1 h-1 bg-red-400 rounded-full animate-bounce delay-600 opacity-90 shadow-lg shadow-red-400/50"></div>
        
        {/* Shooting Stars */}
        <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-30 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-2000 opacity-70"></div>
        <div className="absolute top-50 left-2/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-4000 opacity-80"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/5 w-0.5 h-0.5 bg-white rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-blue-300 rounded-full animate-float-delay opacity-50"></div>
        <div className="absolute top-2/3 left-1/3 w-0.5 h-0.5 bg-purple-300 rounded-full animate-float-slow opacity-30"></div>
        <div className="absolute top-3/4 right-1/5 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-float-delay-slow opacity-60"></div>
      </div>
      
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-yellow-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Goldium Logo" className="w-10 h-10 rounded-lg" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Goldium.io
                </h1>
                <p className="text-xs text-gray-300">The Golden Future</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive(item.href)
                      ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
                  
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Wallet & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <WalletMultiButtonDynamic className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200" />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 border-t border-yellow-500/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Notification />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <img src="/logo.jpg" alt="Goldium Logo" className="w-8 h-8 object-contain" />
                </div>
                <h3 className="text-xl font-bold">Goldium.io</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Revolutionizing DeFi with innovative SOL-GOLD trading, NFT marketplace, 
                and educational resources. Join the golden revolution!
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/goldium_io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://discord.gg/goldium" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
                <a href="https://t.me/goldium_io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/dapp" className="text-gray-300 hover:text-yellow-400 transition-colors">DApp</Link></li>
                <li><Link href="/nft" className="text-gray-300 hover:text-yellow-400 transition-colors">NFT Marketplace</Link></li>
                <li><Link href="/games" className="text-gray-300 hover:text-yellow-400 transition-colors">Games</Link></li>
                <li><Link href="/education" className="text-gray-300 hover:text-yellow-400 transition-colors">Education</Link></li>
              </ul>
            </div>

            {/* Contract Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contract Address</h4>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">GOLD Token:</p>
                <p className="text-xs text-yellow-400 font-mono break-all">
                  GLDWbWbJ7f1w4zX9LhESBM3A3jUKM7VH5kRz3YLnShjs
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Goldium.io. All rights reserved. | 
              <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 ml-2">Privacy Policy</a> | 
              <a href="/terms" className="text-yellow-400 hover:text-yellow-300 ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 