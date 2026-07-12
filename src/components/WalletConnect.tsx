"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button";

export function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if Phantom is already connected on load
    const checkWallet = async () => {
      const provider = (window as any).solana;
      if (provider?.isPhantom && provider.isConnected) {
        setWalletAddress(provider.publicKey.toString());
      }
    };
    checkWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const provider = (window as any).solana;
      
      if (!provider?.isPhantom) {
        alert("Phantom wallet not found! Please install the browser extension.");
        return window.open("https://phantom.app/", "_blank");
      }

      const response = await provider.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = (window as any).solana;
      if (provider) {
        await provider.disconnect();
        setWalletAddress(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (walletAddress) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        className="font-mono text-xs flex items-center gap-2 bg-surface-dark border-brand-yellow/50 text-brand-yellow"
        onClick={disconnectWallet}
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {formatAddress(walletAddress)}
      </Button>
    );
  }

  return (
    <Button variant="secondary" size="sm" className="text-xs" onClick={connectWallet}>
      Connect Web3
    </Button>
  );
}
