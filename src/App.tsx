import React, { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import PhantomConnect from "./components/wallet/PhantomConnect";
import DarkModeToggle from "./components/ui/DarkModeToggle";
import BackgroundMusic from "./components/sound/BackgroundMusic";
import Notification from "./components/ui/Notification";
import NftGallery from "./components/nft/NftGallery";
import BattleGame from "./components/game/BattleGame";
import DeckBuilder from "./components/deck/DeckBuilder";
import Marketplace from "./components/marketplace/Marketplace";
import Leaderboard from "./components/leaderboard/Leaderboard";
import { NotificationProvider } from "./components/ui/NotificationContext";

const App = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [battleDeck, setBattleDeck] = useState<any[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);

  const handleStartBattle = (deck: any[]) => {
    setBattleDeck(deck);
    setBattleStarted(true);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <Head>
          <title>Goldium.io - Golden Egg NFT dApp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <header className="flex justify-between items-center p-4">
          <div className="flex gap-2 items-center">
            <img src="/logo.png" alt="Goldium Logo" className="w-10 h-10" />
            <span className="font-bold text-2xl text-yellow-700 dark:text-yellow-300">Goldium.io</span>
          </div>
          <div className="flex gap-4 items-center">
            <BackgroundMusic />
            <DarkModeToggle />
            <PhantomConnect />
          </div>
        </header>
        <main className="p-4 max-w-5xl mx-auto flex flex-col gap-8">
          <Marketplace />
          <Leaderboard />
          {!battleStarted ? (
            <DeckBuilder onSelectDeck={handleStartBattle} deckSize={3} />
          ) : (
            <BattleGame playerDeck={battleDeck} />
          )}
          <NftGallery />
        </main>
        <Notification
          message={notification || ""}
          show={!!notification}
          onClose={() => setNotification(null)}
        />
      </div>
    </NotificationProvider>
  );
};

export default App;
