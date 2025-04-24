import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import classNames from "classnames";
import Link from "next/link";

type Props = {
  twitterHandle?: string;
  className?: string;
};

export function Menu({ twitterHandle, className }: Props) {
  const { connected } = useWallet();
  const menuClasses = classNames("menu", className);

  return (
    <ul className={menuClasses}>
      {connected && (
        <>
          <li className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-goldium-500 ring-offset-base-100 ring-offset-2">
                <img src="/images/egg-avatar.png" alt="Profile" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                  <span className="badge badge-sm badge-goldium">New</span>
                </Link>
              </li>
              <li><Link href="/inventory">Inventory</Link></li>
              <li><Link href="/achievements">Achievements</Link></li>
              <li><Link href="/settings">Settings</Link></li>
              <li><a>Logout</a></li>
            </ul>
          </li>

          {twitterHandle && (
            <li className="rounded-box">
              <a
                href={`https://www.twitter.com/${twitterHandle}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost lg:btn mb-1 lg:mr-1 lg:mb-0"
              >
                @{twitterHandle}
              </a>
            </li>
          )}

          <li>
            <label
              htmlFor="gold-modal"
              className="btn-goldium lg:btn mb-1 lg:mr-1 lg:mb-0"
            >
              Send $GOLD
            </label>
          </li>

          <li>
            <label
              htmlFor="sol-modal"
              className="btn-ghost lg:btn mb-1 lg:mr-1 lg:mb-0"
            >
              Send SOL
            </label>
          </li>

          <li className="rounded-box">
            <Link href="/daily-claim" className="btn-skyblue lg:btn mb-1 lg:mr-1 lg:mb-0">
              Daily Claim
            </Link>
          </li>
        </>
      )}
      <WalletMultiButton className="btn bg-goldium-500 hover:bg-goldium-600 text-white" />
    </ul>
  );
}
