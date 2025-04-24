// Dummy leaderboard client for local development without on-chain integration
export async function recordWin() {
  // No-op: in demo mode, this does nothing
}

export async function getLeaderboard() {
  // Return dummy leaderboard data
  return [
    { wallet: "EggKing123", wins: 12 },
    { wallet: "GoldenChamp", wins: 9 },
    { wallet: "EggMaster", wins: 7 },
  ];
}
