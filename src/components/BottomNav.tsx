import React from 'react';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { cn } from './Button';

// Mock routing or use next/link in the actual app
export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe flex justify-center">
      <div className="flex items-center justify-between w-full max-w-md px-6 py-3 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
        
        <button className="flex flex-col items-center gap-1 text-brand-yellow">
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <Compass size={24} />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        <div className="relative -top-5">
          <button className="flex items-center justify-center w-14 h-14 bg-brand-yellow text-black rounded-full shadow-[0_4px_16px_rgba(245,197,24,0.4)] hover:scale-105 active:scale-95 transition-transform">
            <Plus size={28} />
          </button>
        </div>

        <button className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <Bell size={24} />
          <span className="text-[10px] font-medium">Alerts</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-text-lo hover:text-text-hi transition-colors">
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>

      </div>
    </div>
  );
}
