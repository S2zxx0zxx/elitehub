import React, { useState } from "react";
import { Button } from "./Button";

interface JoinClubScreenProps {
  title?: string;
  subtitle?: string;
  price?: number;
  onJoin?: (name: string, email: string) => void;
  isLoading?: boolean;
}

export function JoinClubScreen({ 
  title = "Join the club", 
  subtitle = "Get exclusive access to premium content, private community, and direct messaging.",
  price = 999,
  onJoin,
  isLoading = false
}: JoinClubScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onJoin && name && email) {
      onJoin(name, email);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
        
        <h1 className="font-display text-4xl font-extrabold text-white mb-3 text-center tracking-tight">
          {title}
        </h1>
        
        <p className="text-gray-400 text-center mb-10 text-sm leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="py-4 flex justify-between items-end border-b border-white/10 mb-6">
            <span className="text-gray-400 text-sm">Total due today</span>
            <span className="text-2xl font-bold">₹{price}</span>
          </div>

          <Button 
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 py-4 text-lg rounded-xl"
            disabled={!name || !email || isLoading}
          >
            {isLoading ? "Processing..." : "Continue to payment"}
          </Button>

          <p className="text-[10px] text-gray-500 text-center mt-4 px-4 leading-relaxed">
            By joining, you agree to our Terms of Service and Privacy Policy. 
            Secure payment processed via Razorpay.
          </p>
        </form>
      </div>
    </div>
  );
}
