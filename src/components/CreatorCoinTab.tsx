"use client";

import { useState } from "react";
import { Button } from "./Button";

interface CreatorCoinTabProps {
  creatorName: string;
  handle: string;
}

export function CreatorCoinTab({ creatorName, handle }: CreatorCoinTabProps) {
  const [loading, setLoading] = useState(false);
  const coinSymbol = `$${handle.substring(0, 4).toUpperCase()}`;

  const handleTransaction = (type: "buy" | "sell") => {
    const provider = (window as any).solana;
    if (!provider?.isConnected) {
      alert("Please connect your Phantom Wallet first using the button in the top bar!");
      return;
    }

    setLoading(true);
    // Mocking a transaction delay
    setTimeout(() => {
      setLoading(false);
      alert(`Success! You just ${type === "buy" ? "bought" : "sold"} 100 ${coinSymbol} on the Solana devnet!`);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-surface-dark border border-brand-yellow/20 rounded-3xl p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-yellow to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-black shadow-[0_0_30px_rgba(245,197,24,0.3)]">
          <span className="text-2xl font-bold text-black">{coinSymbol.replace('$', '')}</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-elite-white mb-1">{coinSymbol}</h2>
        <p className="text-text-lo text-sm mb-4">The official token of {creatorName}</p>
        
        <div className="flex justify-center items-end gap-1 mb-6">
          <span className="text-3xl font-bold text-brand-yellow">1.45</span>
          <span className="text-text-lo mb-1">SOL</span>
          <span className="text-green-500 text-sm font-bold ml-2 mb-1">+12.5%</span>
        </div>

        {/* Mock Chart Area */}
        <div className="w-full h-24 mb-6 relative flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,40 L0,25 C10,20 20,35 30,25 C40,15 50,20 60,10 C70,0 80,15 100,5 L100,40 Z" fill="rgba(245, 197, 24, 0.1)" />
            <path d="M0,25 C10,20 20,35 30,25 C40,15 50,20 60,10 C70,0 80,15 100,5" fill="none" stroke="#F5C518" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 bg-green-500 hover:bg-green-600 text-black border-none"
            onClick={() => handleTransaction("buy")}
            disabled={loading}
          >
            {loading ? "Confirming..." : "Buy"}
          </Button>
          <Button 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
            onClick={() => handleTransaction("sell")}
            disabled={loading}
          >
            {loading ? "Confirming..." : "Sell"}
          </Button>
        </div>
      </div>
      
      <div className="bg-surface-dark p-4 rounded-xl text-sm text-text-lo">
        <h4 className="font-bold text-elite-white mb-2">Utility</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Hold 100+ tokens for VIP Discord access</li>
          <li>Hold 500+ tokens for 1-on-1 monthly call</li>
          <li>Tradeable on Solana decentralized exchanges</li>
        </ul>
      </div>
    </div>
  );
}
