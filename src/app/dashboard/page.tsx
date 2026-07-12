"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

interface DashboardData {
  totalEarnings: number;
  availableBalance: number;
  subscribersCount: number;
  recentTransactions: any[];
  payouts: any[];
}

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showPayout, setShowPayout] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePayout = async () => {
    if (!upiId || !payoutAmount) return alert("Enter UPI ID and Amount");
    setPayoutLoading(true);
    
    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payoutAmount, upiId })
      });
      const result = await res.json();
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Payout requested successfully!");
        setShowPayout(false);
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to request payout");
    }
    setPayoutLoading(false);
  };

  if (isLoaded && !isSignedIn) return <div className="p-8 text-center">Please login...</div>;

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-8 mt-4">
        <h1 className="font-display text-3xl font-bold text-elite-white mb-2">Analytics</h1>
        
        {loading || !data ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-surface-dark rounded-3xl" />
            <div className="flex gap-4">
              <div className="flex-1 h-24 bg-surface-dark rounded-3xl" />
              <div className="flex-1 h-24 bg-surface-dark rounded-3xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Main KPI */}
            <Card className="bg-gradient-to-br from-brand-yellow/20 to-surface-dark border-brand-yellow/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-yellow">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <CardContent className="p-6">
                <p className="text-brand-yellow font-bold text-sm mb-1">Available Balance</p>
                <h2 className="font-display text-4xl font-bold text-elite-white">₹{data.availableBalance.toLocaleString('en-IN')}</h2>
                <p className="text-text-lo text-xs mt-2">Lifetime Earnings: ₹{data.totalEarnings.toLocaleString('en-IN')}</p>
                
                <Button 
                  className="mt-6 w-full shadow-lg shadow-brand-yellow/20" 
                  onClick={() => setShowPayout(!showPayout)}
                >
                  Withdraw Funds
                </Button>
              </CardContent>
            </Card>

            {/* Payout Widget */}
            {showPayout && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-surface-dark p-6 rounded-3xl border border-white/10"
              >
                <h3 className="font-bold text-elite-white mb-4">Request Payout</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-lo mb-1 block">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9876543210@ybl"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-lo mb-1 block">Amount (₹)</label>
                    <input 
                      type="number" 
                      placeholder={`Max ₹${data.availableBalance}`}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-brand-yellow font-bold text-lg focus:border-brand-yellow focus:outline-none"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handlePayout} disabled={payoutLoading}>
                    {payoutLoading ? "Processing..." : "Confirm Request"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5 text-center">
                  <p className="text-text-lo text-sm font-bold mb-1">Subscribers</p>
                  <h3 className="font-display text-2xl font-bold text-elite-white">{data.subscribersCount}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <p className="text-text-lo text-sm font-bold mb-1">Total Views</p>
                  {/* Mock views for now */}
                  <h3 className="font-display text-2xl font-bold text-elite-white">12.4K</h3>
                </CardContent>
              </Card>
            </div>

            {/* Ledger */}
            <div className="mt-8">
              <h3 className="font-display font-bold text-xl text-elite-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {data.recentTransactions.length === 0 ? (
                  <div className="bg-surface-dark p-6 rounded-2xl text-center text-text-lo text-sm">
                    No transactions yet. Keep creating!
                  </div>
                ) : (
                  data.recentTransactions.map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center bg-surface-dark p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-bold text-brand-yellow">
                          {tx.fan?.name?.[0] || tx.fan?.handle?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-elite-white">Post Unlock</p>
                          <p className="text-xs text-text-lo">by {tx.fan?.name || tx.fan?.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">+₹{tx.creatorEarning}</p>
                        <p className="text-[10px] text-text-lo">Fee: ₹{tx.commission}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </>
        )}
      </div>
      
      <BottomNav />
    </main>
  );
}
