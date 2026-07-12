import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { getDbUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getDbUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4">
        <h1 className="font-display font-bold text-2xl mb-6">Alerts</h1>
        
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          <button className="px-4 py-1.5 rounded-full bg-brand-yellow text-black font-bold text-sm">All</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 text-elite-white text-sm">Promotions</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 text-elite-white text-sm">Utilities</button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mb-4 border border-white/5">
            <span className="text-2xl">🔔</span>
          </div>
          <h3 className="font-bold text-lg mb-1">No alerts yet</h3>
          <p className="text-text-lo text-sm">When you get new subscribers or messages, they will show up here.</p>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
