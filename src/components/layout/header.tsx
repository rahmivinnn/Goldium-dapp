import { Menu } from "@components/layout/menu";
import { ThemeToggle } from "@components/layout/theme-toggle";
import { APP_NAME } from "@utils/globals";
import Link from "next/link";
import React from "react";
import { SoundButton } from "@components/common/sound-manager";
import TokenBalance from "@components/token/token-balance";

type Props = {
  twitterHandle?: string;
};

export function Header({ twitterHandle }: Props) {
  return (
    <div className="navbar mb-6 shadow-lg bg-gradient-to-r from-goldium-500 to-goldium-600 text-white rounded-box">
      <div className="navbar-start">
        <div className="px-2 mx-2">
          <Link href="/" className="flex items-center">
            <img
              src="/images/goldium-logo.png"
              alt="Goldium.io Logo"
              className="h-10 mr-2"
            />
            <span className="text-xl md:text-2xl font-bold">
              {APP_NAME}
            </span>
          </Link>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          <li><Link href="/game" className="hover:bg-goldium-600">Game</Link></li>
          <li><Link href="/gallery" className="hover:bg-goldium-600">NFT Gallery</Link></li>
          <li><Link href="/marketplace" className="hover:bg-goldium-600">Marketplace</Link></li>
          <li><Link href="/staking" className="hover:bg-goldium-600">Staking</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="hidden lg:block">
          <Menu
            twitterHandle={twitterHandle}
            className="menu-horizontal px-1"
          />
        </div>
        <div className="flex items-center">
          <div className="hidden md:block">
            <div className="flex items-center gap-2 mr-2">
              <TokenBalance showButtons={false} size="sm" />
            </div>
          </div>
          <SoundButton />
          <ThemeToggle />
        </div>
        <div className="lg:hidden">
          <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
}
