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
    <div className="min-h-screen bg-bg text-text-hi flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
        
        <h1 className="font-serif text-4xl font-extrabold text-text-hi mb-3 text-center tracking-tight">
          {title}
        </h1>
        
        <p className="text-text-lo text-center mb-10 text-sm leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-text-hi placeholder-text-lo/60 focus:outline-none focus:border-brand-yellow transition-colors shadow-glossy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-text-hi placeholder-text-lo/60 focus:outline-none focus:border-brand-yellow transition-colors shadow-glossy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="py-4 flex justify-between items-end border-b border-border mb-6">
            <span className="text-text-lo text-sm">Total due today</span>
            <span className="text-2xl font-bold text-text-hi">₹{price}</span>
          </div>

          <Button 
            type="submit"
            className="w-full py-4 text-lg rounded-xl"
            disabled={!name || !email || isLoading}
          >
            {isLoading ? "Processing..." : "Continue to payment"}
          </Button>

          <p className="text-[10px] text-text-lo text-center mt-4 px-4 leading-relaxed">
            By joining, you agree to our Terms of Service and Privacy Policy. 
            Secure payment processed via Razorpay.
          </p>
        </form>
      </div>
    </div>
  );
}
