import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-bg pb-24">
      <div className="h-48 w-full bg-surface relative">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      
      <div className="max-w-md mx-auto px-4 -mt-12 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <Skeleton className="w-24 h-24 rounded-full border-4 border-bg" />
          <div className="flex gap-4">
            <Skeleton className="w-12 h-10" />
            <Skeleton className="w-12 h-10" />
          </div>
        </div>
        
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex gap-3 mb-8">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-24 rounded-xl" />
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="aspect-square rounded-none" />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
