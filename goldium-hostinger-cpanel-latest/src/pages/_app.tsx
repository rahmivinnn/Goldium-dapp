import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>Goldium.io - The Golden Future of DeFi</title>
            <meta name="description" content="Goldium.io - Revolutionary DeFi platform with SOL-GOLD trading, NFT marketplace, games, and education. Join the golden revolution!" />
            <meta name="keywords" content="Goldium, DeFi, Solana, SOL, GOLD, NFT, Staking, Trading, Games" />
            <meta property="og:title" content="Goldium.io - The Golden Future of DeFi" />
            <meta property="og:description" content="Revolutionary DeFi platform with SOL-GOLD trading, NFT marketplace, games, and education." />
            <meta property="og:type" content="website" />
            <link rel="icon" href="/logo.jpg" />
          </Head>

          <ContextProvider>
            <div className="flex flex-col h-screen">
              <Notifications />
              <Component {...pageProps} />
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
