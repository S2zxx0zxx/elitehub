import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";

export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-bg-dark pb-24 h-screen overflow-hidden">
      <TopBar />
      <div className="max-w-md mx-auto h-[calc(100vh-120px)] relative bg-black">
        <Skeleton className="absolute inset-0 rounded-none bg-surface-dark" />
        <div className="absolute top-4 right-4 space-y-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="absolute bottom-20 left-4 right-16 space-y-2">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
