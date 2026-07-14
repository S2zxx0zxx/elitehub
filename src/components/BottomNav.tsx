"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe flex justify-center">
      <div className="flex items-center justify-between w-full max-w-md px-6 py-3 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-brand-yellow">
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link href="/explore" className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <Compass size={24} />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>

        <div className="relative -top-5">
          <Link href="/create" className="flex items-center justify-center w-14 h-14 bg-brand-yellow text-black rounded-full shadow-[0_4px_16px_rgba(245,197,24,0.4)] hover:scale-105 active:scale-95 transition-transform">
            <Plus size={28} />
          </Link>
        </div>

        <Link href="/notifications" className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <Bell size={24} />
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>

        <Link href={isSignedIn ? "/dashboard" : "/sign-in"} className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>

      </div>
    </div>
  );
}
