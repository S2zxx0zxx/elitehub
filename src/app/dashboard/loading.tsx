import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-8 mt-4">
        <h1 className="font-display text-3xl font-bold text-text-hi mb-2">Analytics</h1>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-3xl bg-surface" />
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-24 rounded-3xl bg-surface" />
            <Skeleton className="flex-1 h-24 rounded-3xl bg-surface" />
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
