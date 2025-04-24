import { PublicKey } from "@solana/web3.js";

export const DEFAULT_THEME = "goldium";
export const DEFAULT_WALLET = "2Sop5SDdP7tSWwUSWnCMYxFfJWT6SnfZbxNsmYgzxw2E";
export const DEFAULT_TOKEN = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"; // Replace with GOLD token address when deployed
export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);
export const NONCE = "403265f0a783981524204603a5923dfc35fae665"; // Just for demo, this should be generated

// Goldium.io specific constants
export const APP_NAME = "Goldium.io";
export const APP_DESCRIPTION = "A 2D interactive card game and NFT platform powered by the GOLD token";

// Game constants
export const GAME_TURN_TIME = 60; // seconds
export const MAX_DECK_SIZE = 30;
export const MIN_DECK_SIZE = 20;

// NFT constants
export const NFT_RARITY_LEVELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

// Token constants
export const DAILY_CLAIM_AMOUNT = 10; // GOLD tokens
export const STAKING_YIELD_RATE = 0.05; // 5% APY
