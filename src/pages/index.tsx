import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { ButtonState } from "@components/home/button";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { TxConfirmData } from "@pages/api/tx/confirm";
import { TxCreateData } from "@pages/api/tx/create";
import { TxSendData } from "@pages/api/tx/send";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { fetcher, useDataFetch } from "@utils/use-data-fetch";
import { toast } from "react-hot-toast";
import { Modal } from "@components/layout/modal";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME } from "@utils/globals";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Home: NextPage = () => {
  const { publicKey, signTransaction, connected } = useWallet();

  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  const [txState, setTxState] = React.useState<ButtonState>("initial");

  const onTxClick =
    ({
      isToken = false,
      address,
      amount,
    }: {
      isToken: boolean;
      address?: string;
      amount?: string;
    }) =>
    async () => {
      if (connected && publicKey && signTransaction && txState !== "loading") {
        setTxState("loading");
        const buttonToastId = toast.loading("Creating transaction...", {
          id: `buttonToast${isToken ? "Token" : ""}`,
        });

        try {
          // Create transaction
          let { tx: txCreateResponse } = await fetcher<TxCreateData>(
            "/api/tx/create",
            {
              method: "POST",
              body: JSON.stringify({
                payerAddress: publicKey.toBase58(),
                receiverAddress: address
                  ? new PublicKey(address).toBase58()
                  : undefined,
                amount: amount,
                type: isToken ? "token" : "sol",
              }),
              headers: { "Content-type": "application/json; charset=UTF-8" },
            }
          );

          const tx = Transaction.from(Buffer.from(txCreateResponse, "base64"));

          // Request signature from wallet
          const signedTx = await signTransaction(tx);
          const signedTxBase64 = signedTx.serialize().toString("base64");

          // Send signed transaction
          let { txSignature } = await fetcher<TxSendData>("/api/tx/send", {
            method: "POST",
            body: JSON.stringify({ signedTx: signedTxBase64 }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });

          setTxState("success");
          toast.success(
            (t) => (
              <a
                href={`https://solscan.io/tx/${txSignature}`}
                target="_blank"
                rel="noreferrer"
              >
                Transaction created
              </a>
            ),
            { id: buttonToastId, duration: 10000 }
          );

          const confirmationToastId = toast.loading(
            "Confirming transaction..."
          );

          const confirmationResponse = await fetcher<TxConfirmData>(
            "/api/tx/confirm",
            {
              method: "POST",
              body: JSON.stringify({ txSignature }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );

          if (confirmationResponse.confirmed) {
            toast.success("Transaction confirmed", {
              id: confirmationToastId,
            });
          } else {
            toast.success("Error confirming transaction", {
              id: confirmationToastId,
            });
          }
        } catch (error: any) {
          setTxState("error");
          toast.error("Error creating transaction", { id: buttonToastId });
        }
      }
    };

  return (
    <>
      <Head>
        <title>{APP_NAME} - {APP_DESCRIPTION}</title>
        <meta
          name="description"
          content={APP_DESCRIPTION}
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />

          {/* Hero Section */}
          <div className="hero min-h-[70vh] bg-base-200 rounded-box mb-8">
            <div className="hero-content flex-col lg:flex-row-reverse">
              <img src="/images/hero-egg.png" className="max-w-sm rounded-lg shadow-2xl egg-bounce" alt="Golden Egg Character" />
              <div>
                <h1 className="text-5xl font-bold">Welcome to {APP_NAME}!</h1>
                <p className="py-6">
                  Dive into the world of golden eggs! Battle with your unique egg characters,
                  collect rare NFTs, and earn GOLD tokens in this exciting decentralized game.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/game/play" className="btn btn-goldium">Play Now</Link>
                  <Link href="/marketplace" className="btn btn-skyblue">Explore Marketplace</Link>
                  {!connected && (
                    <WalletMultiButton className="btn btn-outline" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img src="/images/card-game.png" alt="Card Game" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">2D Card Game</h2>
                <p>Battle with your egg characters in PvP and PvE modes. Build your deck and climb the leaderboard!</p>
                <div className="card-actions">
                  <Link href="/game" className="btn btn-primary">Play Game</Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img src="/images/nft-gallery.png" alt="NFT Gallery" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">NFT Gallery</h2>
                <p>Explore and showcase your collection of rare golden egg NFTs with unique traits and abilities.</p>
                <div className="card-actions">
                  <Link href="/gallery" className="btn btn-primary">View Gallery</Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img src="/images/gold-token.png" alt="GOLD Token" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">GOLD Token</h2>
                <p>Earn, stake, and use GOLD tokens to unlock rare cards, trade NFTs, and participate in tournaments.</p>
                <div className="card-actions">
                  <Link href="/staking" className="btn btn-primary">Stake GOLD</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats shadow w-full mb-8">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <div className="stat-title">Total Players</div>
              <div className="stat-value text-primary">25.6K</div>
              <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="stat-title">NFTs Minted</div>
              <div className="stat-value text-secondary">2.6M</div>
              <div className="stat-desc">14% more than last month</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src="/images/top-player.png" alt="Top Player" />
                  </div>
                </div>
              </div>
              <div className="stat-value">86%</div>
              <div className="stat-title">Battles Won</div>
              <div className="stat-desc text-secondary">By top player this season</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card w-full bg-gradient-to-r from-goldium-500 to-goldium-600 text-white shadow-xl mb-8">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center">Ready to start your adventure?</h2>
              <p>Connect your wallet and join thousands of players in the Goldium universe!</p>
              <div className="card-actions justify-center mt-4">
                {!connected ? (
                  <WalletMultiButton className="btn bg-white text-goldium-600 hover:bg-gray-200" />
                ) : (
                  <Link href="/game/play" className="btn bg-white text-goldium-600 hover:bg-gray-200">Play Now</Link>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </PageContainer>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <Menu
            twitterHandle={twitterHandle}
            className="p-4 w-80 bg-base-100 text-base-content"
          />
        </div>
      </DrawerContainer>
      <Modal
        onClick={onTxClick}
        butttonState={txState}
        headerContent="Send some $GOLD to someone you love"
        buttonContent="Send $GOLD"
        isToken={true}
        id="gold-modal"
      />
      <Modal
        onClick={onTxClick}
        butttonState={txState}
        headerContent="Send some SOL to someone you love"
        buttonContent="Send SOL"
        isToken={false}
        id="sol-modal"
      />
    </>
  );
};

export default Home;
