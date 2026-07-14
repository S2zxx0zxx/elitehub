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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe flex justify-center pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-md px-6 py-3 bg-[#0B0B0D]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]' : 'text-text-lo hover:text-text-hi'}`}>
          <Home size={22} className={pathname === '/' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link href="/explore" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/explore' ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]' : 'text-text-lo hover:text-text-hi'}`}>
          <Compass size={22} className={pathname === '/explore' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">Explore</span>
        </Link>

        <div className="relative -top-5">
          <Link href="/create" className="flex items-center justify-center w-14 h-14 bg-brand-yellow text-black rounded-full shadow-[0_8px_24px_rgba(245,197,24,0.3)] hover:scale-105 hover:shadow-[0_8px_32px_rgba(245,197,24,0.5)] active:scale-95 transition-all">
            <Plus size={28} className="stroke-[2.5px]" />
          </Link>
        </div>

        <Link href="/notifications" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/notifications' ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]' : 'text-text-lo hover:text-text-hi'}`}>
          <Bell size={22} className={pathname === '/notifications' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">Alerts</span>
        </Link>

        <Link href={isSignedIn ? "/dashboard" : "/sign-in"} className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/dashboard' || pathname.includes('/profile') ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]' : 'text-text-lo hover:text-text-hi'}`}>
          <User size={22} className={pathname === '/dashboard' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </div>
  );
}
