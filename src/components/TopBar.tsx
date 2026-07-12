import React from 'react';
import Link from 'next/link';
import { Search, BarChart2 } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export function TopBar() {
  return (
    <div className="sticky top-0 z-40 w-full bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <Link href="/" className="font-display text-2xl font-bold text-brand-yellow tracking-tight">
          EliteHub
        </Link>
        <div className="flex items-center gap-4 text-elite-white">
          <Link href="/dashboard" className="hover:text-brand-yellow transition-colors">
            <BarChart2 size={24} />
          </Link>
          <Link href="/explore" className="hover:text-brand-yellow transition-colors">
            <Search size={24} />
          </Link>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}
