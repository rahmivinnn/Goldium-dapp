import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { notify } from '../utils/notifications';

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();

  const handleNetworkChange = (network: string) => {
    setNetworkConfiguration(network);
    notify({ 
      type: 'info', 
      message: `Switched to ${network === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}`,
      description: 'Please refresh the page for changes to take effect'
    });
  };

  return (
    <div className="form-control">
      <label className="cursor-pointer label">
        <span className="label-text">Network</span>
      </label>
      <select 
        className="select select-bordered select-sm w-full max-w-xs"
        value={networkConfiguration}
        onChange={(e) => handleNetworkChange(e.target.value)}
      >
        <option value="mainnet-beta">🌐 Mainnet</option>
        <option value="devnet">🧪 Devnet</option>
      </select>
      <div className="text-xs text-gray-500 mt-1">
        Current: {networkConfiguration === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false
})