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
import { APP_DESCRIPTION, APP_NAME, MAX_DECK_SIZE, MIN_DECK_SIZE } from "@utils/globals";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Mock card collection data
const mockCardCollection = [
  { id: 1, name: "Golden Egg", power: 5, health: 5, type: "Normal", rarity: "Common", imageUrl: "/images/card-1.png", description: "A basic golden egg with balanced stats." },
  { id: 2, name: "Fire Egg", power: 7, health: 3, type: "Fire", rarity: "Rare", imageUrl: "/images/card-2.png", description: "A fiery egg with high attack but low health." },
  { id: 3, name: "Water Egg", power: 3, health: 7, type: "Water", rarity: "Rare", imageUrl: "/images/card-3.png", description: "A water egg with low attack but high health." },
  { id: 4, name: "Earth Egg", power: 4, health: 6, type: "Earth", rarity: "Uncommon", imageUrl: "/images/card-4.png", description: "An earth egg with balanced stats and defensive abilities." },
  { id: 5, name: "Wind Egg", power: 6, health: 4, type: "Wind", rarity: "Uncommon", imageUrl: "/images/card-5.png", description: "A wind egg with high attack and mobility." },
  { id: 6, name: "Thunder Egg", power: 8, health: 2, type: "Thunder", rarity: "Epic", imageUrl: "/images/card-6.png", description: "A thunder egg with very high attack but very low health." },
  { id: 7, name: "Ice Egg", power: 2, health: 8, type: "Ice", rarity: "Epic", imageUrl: "/images/card-7.png", description: "An ice egg with very low attack but very high health." },
  { id: 8, name: "Light Egg", power: 6, health: 6, type: "Light", rarity: "Epic", imageUrl: "/images/card-8.png", description: "A light egg with balanced stats and healing abilities." },
  { id: 9, name: "Dark Egg", power: 7, health: 5, type: "Dark", rarity: "Epic", imageUrl: "/images/card-9.png", description: "A dark egg with high attack and debuff abilities." },
  { id: 10, name: "Dragon Egg", power: 9, health: 9, type: "Dragon", rarity: "Legendary", imageUrl: "/images/card-10.png", description: "A legendary dragon egg with very high stats." },
];

// Mock saved decks
const mockSavedDecks = [
  { id: 1, name: "Fire Deck", cards: [2, 6, 9, 10] },
  { id: 2, name: "Water Deck", cards: [3, 7, 8, 1] },
];

const DeckBuilderPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const [filter, setFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("name");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentDeck, setCurrentDeck] = React.useState<number[]>([]);
  const [deckName, setDeckName] = React.useState("New Deck");
  const [savedDecks, setSavedDecks] = React.useState(mockSavedDecks);
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Filter and sort card collection
  const filteredCards = React.useMemo(() => {
    let result = [...mockCardCollection];
    
    // Filter by type
    if (filter !== "all") {
      result = result.filter(card => card.type.toLowerCase() === filter.toLowerCase() || card.rarity.toLowerCase() === filter.toLowerCase());
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "power":
        result.sort((a, b) => b.power - a.power);
        break;
      case "health":
        result.sort((a, b) => b.health - a.health);
        break;
      case "rarity":
        const rarityOrder = { "Common": 0, "Uncommon": 1, "Rare": 2, "Epic": 3, "Legendary": 4 };
        result.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        break;
      default:
        break;
    }
    
    return result;
  }, [filter, sortBy, searchTerm]);
  
  // Get current deck cards
  const currentDeckCards = React.useMemo(() => {
    return currentDeck.map(cardId => mockCardCollection.find(card => card.id === cardId)).filter(Boolean);
  }, [currentDeck]);
  
  // Add card to deck
  const addCardToDeck = (cardId: number) => {
    if (currentDeck.length >= MAX_DECK_SIZE) {
      toast.error(`Your deck can't have more than ${MAX_DECK_SIZE} cards!`);
      return;
    }
    
    setCurrentDeck(prev => [...prev, cardId]);
    toast.success("Card added to deck!");
  };
  
  // Remove card from deck
  const removeCardFromDeck = (cardId: number) => {
    const cardIndex = currentDeck.indexOf(cardId);
    if (cardIndex === -1) return;
    
    const newDeck = [...currentDeck];
    newDeck.splice(cardIndex, 1);
    setCurrentDeck(newDeck);
    toast.success("Card removed from deck!");
  };
  
  // Save current deck
  const saveDeck = () => {
    if (currentDeck.length < MIN_DECK_SIZE) {
      toast.error(`Your deck must have at least ${MIN_DECK_SIZE} cards!`);
      return;
    }
    
    const newDeck = {
      id: savedDecks.length + 1,
      name: deckName,
      cards: currentDeck,
    };
    
    setSavedDecks(prev => [...prev, newDeck]);
    toast.success("Deck saved successfully!");
  };
  
  // Load saved deck
  const loadDeck = (deckId: number) => {
    const deck = savedDecks.find(d => d.id === deckId);
    if (!deck) return;
    
    setCurrentDeck(deck.cards);
    setDeckName(deck.name);
    toast.success(`Loaded deck: ${deck.name}`);
  };
  
  // Clear current deck
  const clearDeck = () => {
    setCurrentDeck([]);
    setDeckName("New Deck");
    toast.success("Deck cleared!");
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Deck Builder</title>
        <meta
          name="description"
          content="Build your card deck for the Goldium card game"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          {connected ? (
            <div className="bg-base-200 p-4 rounded-box mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Deck Builder</h1>
                
                <div>
                  <Link href="/game" className="btn btn-outline">
                    Back to Game
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Card Collection */}
                <div className="lg:col-span-2">
                  <div className="bg-base-100 p-4 rounded-box">
                    <h2 className="text-xl font-bold mb-4">Card Collection</h2>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="form-control">
                        <div className="input-group">
                          <input 
                            type="text" 
                            placeholder="Search cards..." 
                            className="input input-bordered w-full max-w-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <button className="btn btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </button>
                        </div>
                      </div>
                      
                      <select 
                        className="select select-bordered"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="normal">Normal</option>
                        <option value="fire">Fire</option>
                        <option value="water">Water</option>
                        <option value="earth">Earth</option>
                        <option value="wind">Wind</option>
                        <option value="thunder">Thunder</option>
                        <option value="ice">Ice</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="dragon">Dragon</option>
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                      
                      <select 
                        className="select select-bordered"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name">Sort by Name</option>
                        <option value="power">Sort by Power</option>
                        <option value="health">Sort by Health</option>
                        <option value="rarity">Sort by Rarity</option>
                      </select>
                    </div>
                    
                    {/* Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {filteredCards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`card bg-base-200 shadow-xl cursor-pointer hover:shadow-2xl transition-all ${selectedCard === card.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedCard(card.id)}
                        >
                          <figure className="px-4 pt-4">
                            <img 
                              src={card.imageUrl || "/images/placeholder-card.png"} 
                              alt={card.name} 
                              className="rounded-xl h-32 w-full object-contain"
                            />
                          </figure>
                          <div className="card-body p-4">
                            <h3 className="card-title text-sm flex justify-between">
                              {card.name}
                              <span className={`badge ${
                                card.rarity === "Legendary" ? "badge-secondary" :
                                card.rarity === "Epic" ? "badge-primary" :
                                card.rarity === "Rare" ? "badge-info" :
                                card.rarity === "Uncommon" ? "badge-success" :
                                "badge-ghost"
                              }`}>
                                {card.rarity}
                              </span>
                            </h3>
                            
                            <div className="flex justify-between mt-2">
                              <span className="badge badge-sm">{card.type}</span>
                              <div className="flex gap-1">
                                <span className="badge badge-sm badge-error">ATK: {card.power}</span>
                                <span className="badge badge-sm badge-success">HP: {card.health}</span>
                              </div>
                            </div>
                            
                            <div className="card-actions justify-end mt-2">
                              <button 
                                className="btn btn-xs btn-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addCardToDeck(card.id);
                                }}
                                disabled={currentDeck.includes(card.id) || currentDeck.length >= MAX_DECK_SIZE}
                              >
                                Add to Deck
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredCards.length === 0 && (
                      <div className="text-center py-8">
                        <h3 className="font-bold mb-2">No cards found</h3>
                        <p>Try adjusting your filters</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Current Deck & Card Details */}
                <div>
                  {/* Card Details */}
                  {selectedCard !== null && (
                    <div className="bg-base-100 p-4 rounded-box mb-4">
                      <h2 className="text-xl font-bold mb-4">Card Details</h2>
                      
                      {mockCardCollection.find(card => card.id === selectedCard) && (
                        <div className="card bg-base-200">
                          <figure className="px-4 pt-4">
                            <img 
                              src={mockCardCollection.find(card => card.id === selectedCard)?.imageUrl || "/images/placeholder-card.png"} 
                              alt={mockCardCollection.find(card => card.id === selectedCard)?.name} 
                              className="rounded-xl h-48 w-full object-contain"
                            />
                          </figure>
                          <div className="card-body">
                            <h3 className="card-title">
                              {mockCardCollection.find(card => card.id === selectedCard)?.name}
                              <span className={`badge ${
                                mockCardCollection.find(card => card.id === selectedCard)?.rarity === "Legendary" ? "badge-secondary" :
                                mockCardCollection.find(card => card.id === selectedCard)?.rarity === "Epic" ? "badge-primary" :
                                mockCardCollection.find(card => card.id === selectedCard)?.rarity === "Rare" ? "badge-info" :
                                mockCardCollection.find(card => card.id === selectedCard)?.rarity === "Uncommon" ? "badge-success" :
                                "badge-ghost"
                              }`}>
                                {mockCardCollection.find(card => card.id === selectedCard)?.rarity}
                              </span>
                            </h3>
                            
                            <div className="flex justify-between mt-2">
                              <span className="badge">{mockCardCollection.find(card => card.id === selectedCard)?.type}</span>
                              <div className="flex gap-2">
                                <span className="badge badge-error">ATK: {mockCardCollection.find(card => card.id === selectedCard)?.power}</span>
                                <span className="badge badge-success">HP: {mockCardCollection.find(card => card.id === selectedCard)?.health}</span>
                              </div>
                            </div>
                            
                            <p className="mt-4">
                              {mockCardCollection.find(card => card.id === selectedCard)?.description}
                            </p>
                            
                            <div className="card-actions justify-end mt-4">
                              {currentDeck.includes(selectedCard) ? (
                                <button 
                                  className="btn btn-sm btn-error"
                                  onClick={() => removeCardFromDeck(selectedCard)}
                                >
                                  Remove from Deck
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={() => addCardToDeck(selectedCard)}
                                  disabled={currentDeck.length >= MAX_DECK_SIZE}
                                >
                                  Add to Deck
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Current Deck */}
                  <div className="bg-base-100 p-4 rounded-box">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Current Deck</h2>
                      <span className="badge badge-lg">{currentDeck.length}/{MAX_DECK_SIZE}</span>
                    </div>
                    
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Deck Name</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered" 
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                      />
                    </div>
                    
                    {currentDeckCards.length > 0 ? (
                      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                        {currentDeckCards.map((card) => (
                          <div key={card.id} className="flex justify-between items-center bg-base-200 p-2 rounded-box">
                            <div className="flex items-center gap-2">
                              <img 
                                src={card.imageUrl || "/images/placeholder-card.png"} 
                                alt={card.name} 
                                className="h-10 w-10 object-cover rounded-box"
                              />
                              <div>
                                <h4 className="font-bold text-sm">{card.name}</h4>
                                <div className="flex gap-1">
                                  <span className="badge badge-xs">{card.type}</span>
                                  <span className="badge badge-xs badge-error">ATK: {card.power}</span>
                                  <span className="badge badge-xs badge-success">HP: {card.health}</span>
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              className="btn btn-xs btn-ghost"
                              onClick={() => removeCardFromDeck(card.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-base-200 rounded-box mb-4">
                        <h3 className="font-bold mb-2">Empty Deck</h3>
                        <p>Add cards from your collection</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mb-4">
                      <button 
                        className="btn btn-primary flex-1"
                        onClick={saveDeck}
                        disabled={currentDeck.length < MIN_DECK_SIZE}
                      >
                        Save Deck
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={clearDeck}
                        disabled={currentDeck.length === 0}
                      >
                        Clear
                      </button>
                    </div>
                    
                    {/* Saved Decks */}
                    <div>
                      <h3 className="font-bold mb-2">Saved Decks</h3>
                      
                      {savedDecks.length > 0 ? (
                        <div className="space-y-2">
                          {savedDecks.map((deck) => (
                            <div key={deck.id} className="flex justify-between items-center bg-base-200 p-2 rounded-box">
                              <div>
                                <h4 className="font-bold">{deck.name}</h4>
                                <p className="text-xs">{deck.cards.length} cards</p>
                              </div>
                              
                              <button 
                                className="btn btn-xs btn-primary"
                                onClick={() => loadDeck(deck.id)}
                              >
                                Load
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-base-200 rounded-box">
                          <p>No saved decks</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-box mb-8">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="mb-6">Connect your wallet to build your deck.</p>
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

export default DeckBuilderPage;
