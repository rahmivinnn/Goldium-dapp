import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

const NetworkSwitcher: FC = () => {
  return (
    <div className="text-yellow-400 font-bold">Mainnet</div>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false
})