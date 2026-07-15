"use client";

import React from 'react';
import Link from 'next/link';
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Search, BarChart2, Settings } from 'lucide-react';

export function TopBar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <Link href="/" className="font-display text-2xl font-bold text-brand-yellow tracking-tight">
          EliteHub
        </Link>
        <div className="flex items-center gap-4 text-text-hi">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-yellow transition-colors">
                <BarChart2 size={24} />
              </Link>
              <Link href="/explore" className="hover:text-brand-yellow transition-colors">
                <Search size={24} />
              </Link>
              <Link href="/settings" className="hover:text-brand-yellow transition-colors">
                <Settings size={24} />
              </Link>
              <UserButton />
            </>
          ) : (
            isLoaded && (
              <SignInButton mode="modal">
                <button className="text-sm font-bold bg-brand-yellow text-black px-4 py-2 rounded-full">
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
