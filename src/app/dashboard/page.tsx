"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

export const dynamic = "force-dynamic";

interface DashboardData {
  totalEarnings: number;
  availableBalance: number;
  subscribersCount: number;
  followersCount: number;
  weeklyGrowth: number;
  chartData: { date: string; earnings: number }[];
  recentTransactions: any[];
  payouts: any[];
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
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
    if (!upiId || !payoutAmount) return toast.error("Enter UPI ID and Amount");
    if (data && Number.parseFloat(payoutAmount) > data.availableBalance) return toast.error("Insufficient balance");
    setPayoutLoading(true);
    
    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payoutAmount, upiId })
      });
      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.error);
      } else {
        toast.success("Payout requested successfully!");
        setShowPayout(false);
        setPayoutAmount("");
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to request payout");
    }
    setPayoutLoading(false);
  };

  if (isLoaded && !isSignedIn) return <div className="p-8 text-center">Please login...</div>;

  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-8 mt-4">
        <h1 className="font-serif text-3xl font-bold text-text-hi mb-2">Analytics</h1>
        
        {loading || !data ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-surface border border-border rounded-3xl" />
            <div className="flex gap-4">
              <div className="flex-1 h-24 bg-surface border border-border rounded-3xl" />
              <div className="flex-1 h-24 bg-surface border border-border rounded-3xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Main KPI */}
            <Card className="bg-gradient-to-br from-brand-yellow/10 to-surface border-brand-yellow/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-yellow">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <CardContent className="p-6">
                <p className="text-brand-yellow font-bold text-sm mb-1">Available Balance</p>
                <h2 className="font-serif text-4xl font-bold text-text-hi">₹{data.availableBalance.toLocaleString('en-IN')}</h2>
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
                className="bg-surface p-6 rounded-3xl border border-border shadow-glossy"
              >
                <h3 className="font-bold text-text-hi mb-4">Request Payout</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="upiId" className="text-xs font-bold text-text-lo mb-1 block">UPI ID</label>
                    <input 
                      id="upiId"
                      type="text" 
                      placeholder="e.g. 9876543210@ybl"
                      className="w-full bg-bg border border-border rounded-xl p-3 text-text-hi focus:border-brand-yellow focus:outline-none"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="payoutAmount" className="text-xs font-bold text-text-lo mb-1 block">Amount (₹)</label>
                    <input 
                      id="payoutAmount"
                      type="number" 
                      placeholder={`Max ₹${data.availableBalance}`}
                      className="w-full bg-bg border border-border rounded-xl p-3 text-brand-yellow font-bold text-lg focus:border-brand-yellow focus:outline-none"
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
                  <h3 className="font-serif text-2xl font-bold text-text-hi">{data.subscribersCount}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <p className="text-text-lo text-sm font-bold mb-1">Weekly Growth</p>
                  <h3 className={`font-serif text-2xl font-bold ${data.weeklyGrowth > 0 ? 'text-green-600' : 'text-text-hi'}`}>
                    {data.weeklyGrowth > 0 ? '+' : ''}{data.weeklyGrowth}%
                  </h3>
                </CardContent>
              </Card>
            </div>

            {/* Achievement / Tick Progress */}
            <Card className="mt-4 bg-surface border border-border">
              <CardContent className="p-5">
                <h3 className="font-bold text-text-hi mb-3">Tick Progress</h3>
                <div className="mb-2 flex justify-between items-end">
                  <span className="text-sm font-bold text-blue-500">Blue Tick</span>
                  <span className="text-xs text-text-lo">{data.followersCount} / 100 followers</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mb-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (data.followersCount / 100) * 100)}%` }} />
                </div>
                
                <div className="mb-2 flex justify-between items-end">
                  <span className="text-sm font-bold text-gold">Gold Tick</span>
                  <span className="text-xs text-text-lo">{data.followersCount} / 100,000 followers</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-gold h-2 rounded-full" style={{ width: `${Math.min(100, (data.followersCount / 100000) * 100)}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <div className="mt-8">
              <h3 className="font-serif font-bold text-xl text-text-hi mb-4">30-Day Earnings</h3>
              <div className="bg-surface p-4 rounded-3xl border border-border shadow-glossy h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F5C518" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #EBEBEB', borderRadius: '12px' }}
                      itemStyle={{ color: '#E0A800', fontWeight: 'bold' }}
                      labelStyle={{ color: '#6B6B6B', marginBottom: '4px' }}
                      formatter={(value: any) => [`₹${value}`, 'Earnings']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#F5C518" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorEarnings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ledger */}
            <div className="mt-8">
              <h3 className="font-serif font-bold text-xl text-text-hi mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {data.recentTransactions.length === 0 ? (
                  <div className="bg-surface p-6 rounded-2xl border border-border text-center text-text-lo text-sm">
                    No transactions yet. Keep creating!
                  </div>
                ) : (
                  data.recentTransactions.map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center bg-surface p-4 rounded-2xl border border-border shadow-glossy">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-yellow/15 flex items-center justify-center font-bold text-brand-yellow">
                          {tx.fan?.name?.[0] || tx.fan?.handle?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-text-hi">{tx.type || "Post Unlock"}</p>
                          <p className="text-xs text-text-lo">by {tx.fan?.name || tx.fan?.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+₹{tx.creatorEarning}</p>
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
