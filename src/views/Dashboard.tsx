import { FC, useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SendToken } from '../components/SendToken';
import { SwapToken } from '../components/SwapToken';
import { Staking } from '../components/Staking';
import useTokenBalanceStore from '../stores/useTokenBalanceStore';

type TabType = 'send' | 'swap' | 'staking';

export const Dashboard: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { balances, getAllTokenBalances } = useTokenBalanceStore();
  const [activeTab, setActiveTab] = useState<TabType>('send');

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

  const tabs = [
    { id: 'send' as TabType, label: 'Send', icon: '📤' },
    { id: 'swap' as TabType, label: 'Swap', icon: '🔄' },
    { id: 'staking' as TabType, label: 'Staking', icon: '🔒' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'send':
        return <SendToken onSuccess={handleSuccess} />;
      case 'swap':
        return <SwapToken onSuccess={handleSuccess} />;
      case 'staking':
        return <Staking onSuccess={handleSuccess} />;
      default:
        return <SendToken onSuccess={handleSuccess} />;
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
              Please connect your Solana wallet to access the Goldium DApp
            </p>
            <WalletMultiButton className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200" />
            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <p className="font-medium">✅ Supported wallets:</p>
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
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Connected Wallet</h4>
                  <div className="text-sm text-gray-400">
                    <a 
                      href={`https://solscan.io/account/${wallet.publicKey.toBase58()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      View on Solscan →
                    </a>
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
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
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