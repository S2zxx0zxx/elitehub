import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Search, BarChart2 } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export function TopBar() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 w-full bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <Link href="/" className="font-display text-2xl font-bold text-brand-yellow tracking-tight">
          EliteHub
        </Link>
        <div className="flex items-center gap-4 text-elite-white">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-yellow transition-colors">
                <BarChart2 size={24} />
              </Link>
              <Link href="/explore" className="hover:text-brand-yellow transition-colors">
                <Search size={24} />
              </Link>
              <WalletConnect />
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            isLoaded && (
              <SignInButton mode="modal">
                <button className="text-sm font-bold bg-brand-yellow text-bg-dark px-4 py-2 rounded-full">
                  Sign In
                </button>
              </SignInButton>
            )
          )}
        </div>
      </div>
    </div>
  );
}
