"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function NotificationsClient({ notifications, broadcasts }: { notifications: any[], broadcasts: any[] }) {
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Mark all notifications as read when the page is opened
    fetch("/api/notifications/mark-read", { method: "POST" }).catch(console.error);
  }, []);

  const allAlerts = [
    ...notifications,
    ...broadcasts.map(b => ({ ...b, type: "utilities", isBroadcast: true }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredAlerts = filter === "All" 
    ? allAlerts 
    : allAlerts.filter(a => a.type.toLowerCase() === filter.toLowerCase());

  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4">
        <h1 className="font-display font-bold text-2xl mb-6 text-text-hi">Alerts</h1>
        
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {["All", "Promotions", "Utilities"].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                filter === f 
                  ? "bg-brand-yellow text-black" 
                  : "bg-surface border border-white/10 text-text-hi"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-white/5">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="font-bold text-lg mb-1 text-text-hi">No alerts yet</h3>
              <p className="text-text-lo text-sm">When you get new subscribers or messages, they will show up here.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-3xl border ${alert.isBroadcast ? 'bg-brand-yellow/10 border-brand-yellow/30' : 'bg-surface border-white/5'}`}>
                <div className="flex gap-3">
                  <div className="mt-1 text-2xl relative">
                    {alert.isBroadcast ? "📢" : (alert.type === "promotion" ? "🎉" : "⚙️")}
                    {!alert.isBroadcast && !alert.read && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-yellow rounded-full border-2 border-surface" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-hi mb-1">{alert.title}</h4>
                    <p className="text-xs text-text-lo">{alert.body}</p>
                    <p className="text-[10px] text-white/30 mt-2">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
