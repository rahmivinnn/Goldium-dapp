import { APP_NAME } from "@utils/globals";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        <img src="/images/goldium-logo.png" alt="Goldium.io Logo" className="h-16" />
        <p className="font-bold text-xl">{APP_NAME}</p>
        <p>A 2D interactive card game and NFT platform<br/>powered by the GOLD token</p>
      </div>
      <div>
        <span className="footer-title">Game</span>
        <Link href="/game/play" className="link link-hover">Play Now</Link>
        <Link href="/game/deck-builder" className="link link-hover">Deck Builder</Link>
        <Link href="/game/leaderboard" className="link link-hover">Leaderboard</Link>
        <Link href="/game/tournaments" className="link link-hover">Tournaments</Link>
      </div>
      <div>
        <span className="footer-title">NFTs</span>
        <Link href="/gallery" className="link link-hover">Gallery</Link>
        <Link href="/marketplace" className="link link-hover">Marketplace</Link>
        <Link href="/staking" className="link link-hover">Staking</Link>
        <Link href="/mint" className="link link-hover">Mint</Link>
      </div>
      <div>
        <span className="footer-title">Community</span>
        <a href="https://twitter.com/goldiumio" target="_blank" rel="noreferrer" className="link link-hover">Twitter</a>
        <a href="https://discord.gg/goldiumio" target="_blank" rel="noreferrer" className="link link-hover">Discord</a>
        <a href="https://t.me/goldiumio" target="_blank" rel="noreferrer" className="link link-hover">Telegram</a>
        <a href="https://medium.com/@goldiumio" target="_blank" rel="noreferrer" className="link link-hover">Medium</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link href="/terms" className="link link-hover">Terms of use</Link>
        <Link href="/privacy" className="link link-hover">Privacy policy</Link>
        <Link href="/cookies" className="link link-hover">Cookie policy</Link>
      </div>
    </footer>
  );
}
