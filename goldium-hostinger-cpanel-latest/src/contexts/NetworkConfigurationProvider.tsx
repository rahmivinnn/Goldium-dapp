import { useLocalStorage } from '@solana/wallet-adapter-react';
import { createContext, FC, ReactNode, useContext } from 'react';

export interface NetworkConfigurationState {
    networkConfiguration: string;
    setNetworkConfiguration(networkConfiguration: string): void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
    return useContext(NetworkConfigurationContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Support dynamic network switching between mainnet and devnet
    const [networkConfiguration, setNetworkConfiguration] = useLocalStorage(
        'network',
        process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'
    );
    
    return (
        <NetworkConfigurationContext.Provider value={{ networkConfiguration, setNetworkConfiguration }}>
            {children}
        </NetworkConfigurationContext.Provider>
    );
};