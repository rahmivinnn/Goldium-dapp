import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDataFetch } from "@utils/use-data-fetch";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME } from "@utils/globals";
import Link from "next/link";
import { useRouter } from "next/router";

// Mock card data
const mockCards = [
  { id: 1, name: "Golden Egg", power: 5, health: 5, type: "Normal", imageUrl: "/images/card-1.png", description: "A basic golden egg with balanced stats." },
  { id: 2, name: "Fire Egg", power: 7, health: 3, type: "Fire", imageUrl: "/images/card-2.png", description: "A fiery egg with high attack but low health." },
  { id: 3, name: "Water Egg", power: 3, health: 7, type: "Water", imageUrl: "/images/card-3.png", description: "A water egg with low attack but high health." },
  { id: 4, name: "Earth Egg", power: 4, health: 6, type: "Earth", imageUrl: "/images/card-4.png", description: "An earth egg with balanced stats and defensive abilities." },
  { id: 5, name: "Wind Egg", power: 6, health: 4, type: "Wind", imageUrl: "/images/card-5.png", description: "A wind egg with high attack and mobility." },
];

// Mock opponent data
const mockOpponent = {
  name: "AI Opponent",
  level: 5,
  cards: [
    { id: 101, name: "Dark Egg", power: 6, health: 6, type: "Dark", imageUrl: "/images/opponent-card-1.png" },
    { id: 102, name: "Light Egg", power: 8, health: 4, type: "Light", imageUrl: "/images/opponent-card-2.png" },
    { id: 103, name: "Thunder Egg", power: 7, health: 5, type: "Thunder", imageUrl: "/images/opponent-card-3.png" },
  ],
};

const GamePlayPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { mode } = router.query;
  
  const [gameState, setGameState] = React.useState("waiting"); // waiting, playing, ended
  const [playerTurn, setPlayerTurn] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const [playerCards, setPlayerCards] = React.useState(mockCards);
  const [opponentCards, setOpponentCards] = React.useState(mockOpponent.cards);
  const [playerHealth, setPlayerHealth] = React.useState(20);
  const [opponentHealth, setOpponentHealth] = React.useState(20);
  const [gameLog, setGameLog] = React.useState<string[]>([]);
  const [turnCount, setTurnCount] = React.useState(0);
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Start game
  const startGame = () => {
    setGameState("playing");
    setPlayerTurn(true);
    setTurnCount(1);
    addToGameLog("Game started! Your turn.");
  };
  
  // End turn
  const endTurn = () => {
    setPlayerTurn(false);
    setSelectedCard(null);
    addToGameLog("Your turn ended. Opponent's turn.");
    
    // Simulate opponent's turn after a delay
    setTimeout(() => {
      opponentTurn();
    }, 1500);
  };
  
  // Opponent's turn logic
  const opponentTurn = () => {
    if (opponentCards.length === 0 || playerCards.length === 0) {
      endGame();
      return;
    }
    
    // Simple AI: randomly select a card and attack
    const randomCardIndex = Math.floor(Math.random() * opponentCards.length);
    const attackingCard = opponentCards[randomCardIndex];
    
    addToGameLog(`Opponent attacks with ${attackingCard.name}!`);
    
    // Apply damage to player
    const newPlayerHealth = Math.max(0, playerHealth - attackingCard.power);
    setPlayerHealth(newPlayerHealth);
    addToGameLog(`You take ${attackingCard.power} damage!`);
    
    if (newPlayerHealth <= 0) {
      // Player lost
      setTimeout(() => {
        endGame();
      }, 1000);
      return;
    }
    
    // End opponent's turn
    setTimeout(() => {
      setPlayerTurn(true);
      setTurnCount(turnCount + 1);
      addToGameLog(`Turn ${turnCount + 1}. Your turn.`);
    }, 1000);
  };
  
  // Player attacks with selected card
  const attackWithCard = () => {
    if (selectedCard === null) return;
    
    const attackingCard = playerCards.find(card => card.id === selectedCard);
    if (!attackingCard) return;
    
    addToGameLog(`You attack with ${attackingCard.name}!`);
    
    // Apply damage to opponent
    const newOpponentHealth = Math.max(0, opponentHealth - attackingCard.power);
    setOpponentHealth(newOpponentHealth);
    addToGameLog(`Opponent takes ${attackingCard.power} damage!`);
    
    if (newOpponentHealth <= 0) {
      // Player won
      setTimeout(() => {
        endGame();
      }, 1000);
      return;
    }
    
    // End player's turn
    endTurn();
  };
  
  // End game
  const endGame = () => {
    setGameState("ended");
    
    if (opponentHealth <= 0) {
      addToGameLog("You won the game! +50 GOLD");
    } else if (playerHealth <= 0) {
      addToGameLog("You lost the game! Better luck next time.");
    } else {
      addToGameLog("The game ended in a draw.");
    }
  };
  
  // Add message to game log
  const addToGameLog = (message: string) => {
    setGameLog(prev => [...prev, message]);
  };
  
  // Reset game
  const resetGame = () => {
    setGameState("waiting");
    setPlayerTurn(true);
    setSelectedCard(null);
    setPlayerCards(mockCards);
    setOpponentCards(mockOpponent.cards);
    setPlayerHealth(20);
    setOpponentHealth(20);
    setGameLog([]);
    setTurnCount(0);
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Play Game</title>
        <meta
          name="description"
          content="Play the 2D interactive card game with your golden egg characters"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          {connected ? (
            <div className="bg-base-200 p-4 rounded-box mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                  {mode === 'pvp' ? 'PvP Battle' : 'PvE Battle'} - {gameState === 'waiting' ? 'Waiting to Start' : gameState === 'playing' ? `Turn ${turnCount}` : 'Game Over'}
                </h1>
                
                <div>
                  {gameState === 'waiting' && (
                    <button className="btn btn-goldium" onClick={startGame}>
                      Start Game
                    </button>
                  )}
                  
                  {gameState === 'ended' && (
                    <button className="btn btn-goldium" onClick={resetGame}>
                      Play Again
                    </button>
                  )}
                  
                  <Link href="/game" className="btn btn-outline ml-2">
                    Exit Game
                  </Link>
                </div>
              </div>
              
              {/* Game Board */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Opponent Area */}
                <div className="col-span-2">
                  <div className="bg-base-100 p-4 rounded-box mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img src="/images/opponent-avatar.png" alt="Opponent" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{mockOpponent.name}</h3>
                          <p className="text-xs">Level {mockOpponent.level}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Health:</span>
                        <div className="w-40 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-error h-2.5 rounded-full" 
                            style={{ width: `${(opponentHealth / 20) * 100}%` }}
                          ></div>
                        </div>
                        <span>{opponentHealth}/20</span>
                      </div>
                    </div>
                    
                    <div className="divider my-2">Opponent's Cards</div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      {opponentCards.map((card) => (
                        <div 
                          key={card.id} 
                          className="game-card"
                        >
                          <div className="game-card-inner">
                            <div className="game-card-front">
                              <div className="text-center mb-2">
                                <h4 className="font-bold">{card.name}</h4>
                                <span className="badge badge-sm">{card.type}</span>
                              </div>
                              
                              <div className="flex-1 flex items-center justify-center">
                                <img 
                                  src={card.imageUrl || "/images/placeholder-card.png"} 
                                  alt={card.name} 
                                  className="h-24 w-24 object-contain"
                                />
                              </div>
                              
                              <div className="flex justify-between mt-2">
                                <div className="badge badge-error">ATK: {card.power}</div>
                                <div className="badge badge-success">HP: {card.health}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Battlefield */}
                  <div className="bg-base-100 p-4 rounded-box mb-4 min-h-[200px] flex items-center justify-center">
                    {gameState === 'waiting' && (
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Ready to Battle?</h3>
                        <p>Click "Start Game" to begin!</p>
                      </div>
                    )}
                    
                    {gameState === 'playing' && (
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">
                          {playerTurn ? "Your Turn" : "Opponent's Turn"}
                        </h3>
                        {playerTurn && (
                          <div>
                            <p className="mb-4">Select a card to attack with</p>
                            {selectedCard !== null && (
                              <button 
                                className="btn btn-error"
                                onClick={attackWithCard}
                              >
                                Attack!
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {gameState === 'ended' && (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">
                          {opponentHealth <= 0 ? "Victory!" : "Defeat!"}
                        </h3>
                        <p className="mb-4">
                          {opponentHealth <= 0 
                            ? "Congratulations! You won the battle." 
                            : "Better luck next time!"}
                        </p>
                        <button 
                          className="btn btn-goldium"
                          onClick={resetGame}
                        >
                          Play Again
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Player Area */}
                  <div className="bg-base-100 p-4 rounded-box">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img src="/images/egg-avatar.png" alt="Player" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">You</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Health:</span>
                        <div className="w-40 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-success h-2.5 rounded-full" 
                            style={{ width: `${(playerHealth / 20) * 100}%` }}
                          ></div>
                        </div>
                        <span>{playerHealth}/20</span>
                      </div>
                    </div>
                    
                    <div className="divider my-2">Your Cards</div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      {playerCards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`game-card ${selectedCard === card.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => gameState === 'playing' && playerTurn && setSelectedCard(card.id)}
                        >
                          <div className="game-card-inner">
                            <div className="game-card-front">
                              <div className="text-center mb-2">
                                <h4 className="font-bold">{card.name}</h4>
                                <span className="badge badge-sm">{card.type}</span>
                              </div>
                              
                              <div className="flex-1 flex items-center justify-center">
                                <img 
                                  src={card.imageUrl || "/images/placeholder-card.png"} 
                                  alt={card.name} 
                                  className="h-24 w-24 object-contain"
                                />
                              </div>
                              
                              <div className="flex justify-between mt-2">
                                <div className="badge badge-error">ATK: {card.power}</div>
                                <div className="badge badge-success">HP: {card.health}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {gameState === 'playing' && playerTurn && (
                      <div className="flex justify-center mt-4">
                        <button 
                          className="btn btn-outline"
                          onClick={endTurn}
                        >
                          End Turn
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Game Log */}
                <div className="bg-base-100 p-4 rounded-box h-[600px] flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Game Log</h3>
                  
                  <div className="flex-1 overflow-y-auto bg-base-200 p-2 rounded-box mb-4">
                    {gameLog.length > 0 ? (
                      <div className="space-y-2">
                        {gameLog.map((log, index) => (
                          <div key={index} className="bg-base-100 p-2 rounded-box">
                            {log}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 opacity-50">
                        Game log will appear here
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Card Details</h3>
                    {selectedCard !== null ? (
                      <div>
                        {playerCards.find(card => card.id === selectedCard) && (
                          <div>
                            <h4 className="font-bold">
                              {playerCards.find(card => card.id === selectedCard)?.name}
                            </h4>
                            <p className="text-sm">
                              {playerCards.find(card => card.id === selectedCard)?.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm opacity-50">
                        Select a card to view details
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="mb-6">Connect your wallet to play the game.</p>
              <button className="btn btn-goldium">Connect Wallet</button>
            </div>
          )}
          
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
    </>
  );
};

export default GamePlayPage;
