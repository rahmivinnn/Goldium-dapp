import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import ClientWalletProvider from "@components/contexts/ClientWalletProvider";
import { NETWORK } from "@utils/endpoints";
import { SoundProvider } from "@components/common/sound-manager";

import "../styles/globals.css";
import "../styles/App.css";
import { Toaster } from "react-hot-toast";
import { PageLoading } from "@components/common/loading";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <ClientWalletProvider wallets={wallets}>
        <ReactUIWalletModalProviderDynamic>
          <SoundProvider>
            <Toaster position="bottom-right" reverseOrder={true} />
            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-base-100">
                <PageLoading />
              </div>
            ) : (
              <Component {...pageProps} />
            )}
          </SoundProvider>
        </ReactUIWalletModalProviderDynamic>
      </ClientWalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
