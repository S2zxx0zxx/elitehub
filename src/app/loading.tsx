import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-6 mt-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-4 overflow-x-hidden">
          <Skeleton className="h-32 w-24 shrink-0 rounded-2xl" />
          <Skeleton className="h-32 w-24 shrink-0 rounded-2xl" />
          <Skeleton className="h-32 w-24 shrink-0 rounded-2xl" />
          <Skeleton className="h-32 w-24 shrink-0 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <BottomNav />
    </main>
  );
}
