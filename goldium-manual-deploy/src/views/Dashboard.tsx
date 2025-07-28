import { FC, useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SendToken } from '../components/SendToken';
import { SwapToken } from '../components/SwapToken';
import { Staking } from '../components/Staking';
import { BalanceTracker } from '../components/BalanceTracker';
import { TransactionHistory } from '../components/TransactionHistory';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { SOLSCAN_CONFIG } from '../config/tokens';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';

type TabType = 'balance' | 'send' | 'learn' | 'staking' | 'history';

export const Dashboard: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  const [activeTab, setActiveTab] = useState<TabType>('balance');

  useEffect(() => {
    if (wallet.publicKey) {
      console.log('Wallet connected:', wallet.publicKey.toBase58());
      getAllTokenBalances(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getAllTokenBalances]);

  const handleSuccess = () => {
    if (wallet.publicKey) {
      getAllTokenBalances(wallet.publicKey, connection);
    }
  };

  const getSolscanUrl = (address: string) => {
    const network = networkConfiguration === 'mainnet-beta' ? '' : `?cluster=${networkConfiguration}`;
    return `${SOLSCAN_CONFIG.baseUrl}/account/${address}${network}`;
  };

  const tabs = [
    { id: 'balance' as TabType, label: 'Balance', icon: '💰' },
    { id: 'send' as TabType, label: 'Send', icon: '📤' },
    { id: 'learn' as TabType, label: 'Learn', icon: '🎓' },
    { id: 'staking' as TabType, label: 'Staking', icon: '🔒' },
    { id: 'history' as TabType, label: 'History', icon: '📋' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'balance':
        return <BalanceTracker />;
      case 'send':
        return <SendToken onSuccess={handleSuccess} />;
      case 'learn':
        return <SwapToken onSuccess={handleSuccess} />;
      case 'staking':
        return <Staking onSuccess={handleSuccess} />;
      case 'history':
        return <TransactionHistory />;
      default:
        return <BalanceTracker />;
    }
  };

  return (
    <div className="min-h-screen overflow-auto">
      <div className="container mx-auto px-4">
        {/* Wallet Connection Status */}
        {!wallet.publicKey ? (
          <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-gray-700">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-4 text-white">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-6">
              Please connect your Solana wallet to access the Goldium Educational DApp
            </p>
            <WalletMultiButton className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200" />
            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <p className="font-medium">🎓 Educational Features Available:</p>
              <div className="text-xs space-y-1">
                <p>• Real-time SOL & GOLD balance tracking</p>
                <p>• Learn to send tokens to any Solana address</p>
                <p>• Educational token exchange simulation</p>
                <p>• Learn about staking GOLD tokens</p>
                <p>• View transaction history</p>
                <p>• Educational mode for safe learning</p>
              </div>
              <p className="font-medium mt-4">✅ Supported wallets:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p>• Phantom</p>
                <p>• Solflare</p>
                <p>• Backpack</p>
                <p>• Slope</p>
                <p>• Torus</p>
                <p>• Ledger</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2 md:mb-0">Connected Wallet</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">Network:</span>
                      <span className={`text-sm font-semibold ${
                        networkConfiguration === 'mainnet-beta' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {networkConfiguration === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <a 
                        href={getSolscanUrl(wallet.publicKey.toBase58())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 inline-flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        View on Solscan
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 break-all bg-gray-900/50 p-3 rounded-lg border border-gray-600">
                  {wallet.publicKey.toBase58()}
                </p>
              </div>
            </div>

            {/* Saldo User Selalu Tampil */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="bg-black/80 rounded-xl px-6 py-4 border border-blue-500/30 text-white text-lg font-semibold shadow-lg flex-1 text-center">
                  <span className="text-blue-400">SOL:</span> {balances.SOL.toFixed(6)}
                </div>
                <div className="bg-black/80 rounded-xl px-6 py-4 border border-yellow-500/30 text-white text-lg font-semibold shadow-lg flex-1 text-center">
                  <span className="text-yellow-400">GOLD:</span> {balances.GOLD.toFixed(6)}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-2 border border-gray-700">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      className={`group relative px-6 py-3 rounded-lg font-medium transition-all duration-300 overflow-hidden ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30 animate-cyber-pulse'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-105'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {/* Enhanced Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/20 group-hover:to-orange-500/20 transition-all duration-300 animate-hologram"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-shimmer"></div>
                      </div>
                      
                      <span className="relative z-10 mr-2 group-hover:scale-110 transition-transform duration-300 group-hover:animate-twinkle">{tab.icon}</span>
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Component */}
              <div className="flex justify-center">
                {renderActiveComponent()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};