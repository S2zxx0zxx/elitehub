"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AdminClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (action: string, payload: any) => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload })
      });
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-white">Loading Admin...</div>;

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-8 mt-4">
        <h1 className="font-display text-3xl font-bold text-red-500">Admin Panel</h1>
        
        {/* Overview Stats */}
        <section>
          <h2 className="text-xl font-bold text-elite-white mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-surface-dark border-white/5"><CardContent className="p-4 text-center">
              <p className="text-xs text-text-lo mb-1">Total Users</p>
              <p className="text-xl font-bold text-white">{data.stats.totalUsers}</p>
            </CardContent></Card>
            <Card className="bg-surface-dark border-white/5"><CardContent className="p-4 text-center">
              <p className="text-xs text-text-lo mb-1">Creators</p>
              <p className="text-xl font-bold text-white">{data.stats.totalCreators}</p>
            </CardContent></Card>
            <Card className="bg-surface-dark border-white/5"><CardContent className="p-4 text-center">
              <p className="text-xs text-text-lo mb-1">Sales Volume</p>
              <p className="text-xl font-bold text-green-400">₹{data.stats.totalSalesVolume}</p>
            </CardContent></Card>
            <Card className="bg-surface-dark border-white/5"><CardContent className="p-4 text-center">
              <p className="text-xs text-text-lo mb-1">Commission</p>
              <p className="text-xl font-bold text-brand-yellow">₹{data.stats.totalCommission}</p>
            </CardContent></Card>
          </div>
        </section>

        {/* KYC Queue */}
        <section>
          <h2 className="text-xl font-bold text-elite-white mb-4">KYC Approvals ({data.pendingKyc.length})</h2>
          <div className="space-y-3">
            {data.pendingKyc.map((user: any) => (
              <div key={user.id} className="bg-surface-dark p-4 rounded-xl border border-white/5">
                <p className="font-bold text-white mb-1">{user.name || user.handle}</p>
                <div className="flex gap-2 mt-3">
                  <Button className="flex-1 text-xs py-2" onClick={() => handleAction("approveKyc", { userId: user.id, tier: "blue" })}>Approve Blue</Button>
                  <Button className="flex-1 text-xs py-2 !bg-gold" onClick={() => handleAction("approveKyc", { userId: user.id, tier: "gold" })}>Approve Gold</Button>
                  <Button variant="secondary" className="flex-1 text-xs py-2 !text-red-500" onClick={() => handleAction("rejectKyc", { userId: user.id })}>Reject</Button>
                </div>
              </div>
            ))}
            {data.pendingKyc.length === 0 && <p className="text-sm text-text-lo">No pending KYC.</p>}
          </div>
        </section>

        {/* Payouts Queue */}
        <section>
          <h2 className="text-xl font-bold text-elite-white mb-4">Pending Payouts ({data.pendingPayouts.length})</h2>
          <div className="space-y-3">
            {data.pendingPayouts.map((payout: any) => (
              <div key={payout.id} className="bg-surface-dark p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">₹{payout.amount}</p>
                  <p className="text-xs text-text-lo">to {payout.creator.name} ({payout.upiId})</p>
                </div>
                <Button className="text-xs py-2 px-4" onClick={() => handleAction("approvePayout", { payoutId: payout.id })}>Mark Paid</Button>
              </div>
            ))}
            {data.pendingPayouts.length === 0 && <p className="text-sm text-text-lo">No pending payouts.</p>}
          </div>
        </section>

        {/* Broadcast */}
        <section>
          <h2 className="text-xl font-bold text-elite-white mb-4">New Broadcast</h2>
          <div className="bg-surface-dark p-4 rounded-xl border border-white/5 space-y-3">
            <input 
              type="text" 
              placeholder="Title" 
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
              value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)}
            />
            <textarea 
              placeholder="Message body" 
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm h-20 focus:outline-none"
              value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)}
            />
            <Button className="w-full" onClick={() => {
              handleAction("createBroadcast", { title: broadcastTitle, body: broadcastBody });
              setBroadcastTitle(""); setBroadcastBody("");
            }}>Send to all users</Button>
          </div>
        </section>

      </div>
      <BottomNav />
    </main>
  );
}
