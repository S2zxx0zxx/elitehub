"use client";

import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function PurchasesClient({ purchases }: { purchases: any[] }) {
  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-6 mt-4">
        <h1 className="font-display text-3xl font-bold text-text-hi">My Purchases</h1>
        
        {purchases.length === 0 ? (
          <p className="text-text-lo text-center py-12">You haven&apos;t purchased anything yet.</p>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-surface p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white mb-1">
                    {purchase.post.type === "product" ? "📦 " : "🖼️ "}
                    {purchase.post.caption || "Content"}
                  </h4>
                  <p className="text-xs text-text-lo">from @{purchase.post.creator.handle}</p>
                  <p className="text-sm font-bold text-brand-yellow mt-1">₹{purchase.amount}</p>
                </div>
                <a href={`/api/media/${purchase.post.id}`} download target="_blank" rel="noreferrer" className="inline-block bg-brand-yellow text-black px-4 py-2 rounded-full font-bold text-sm">
                  {purchase.post.type === "product" ? "Download" : "View"}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
