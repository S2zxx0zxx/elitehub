import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { BottomNav } from "@/components/BottomNav";

interface ProfilePageProps {
  params: {
    handle: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const creator = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!creator || creator.role !== "Creator") {
    notFound();
  }

  // Mock gamified tick for demo (blue/gold)
  const isGold = creator.tickTier === "gold";
  const isBlue = creator.tickTier === "blue";

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      {/* Cover Banner */}
      <div className="h-48 w-full bg-surface-dark relative">
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white">
            ←
          </button>
          <button className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white">
            ↑
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-12 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-bg-dark bg-surface-dark overflow-hidden">
              {creator.photo ? (
                <img src={creator.photo} alt={creator.name || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-yellow/20 flex items-center justify-center text-3xl">
                  {(creator.name || creator.handle || "C")[0].toUpperCase()}
                </div>
              )}
            </div>
            {(isGold || isBlue) && (
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-bg-dark flex items-center justify-center ${isGold ? 'bg-gold' : 'bg-blue-500'}`}>
                ✓
              </div>
            )}
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="font-bold text-lg">12K</p>
              <p className="text-xs text-text-lo">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{creator.posts.length}</p>
              <p className="text-xs text-text-lo">Posts</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-elite-white">{creator.name || creator.handle}</h1>
          <p className="text-text-lo mb-2">@{creator.handle} • {creator.categories[0] || "Creator"}</p>
          <p className="text-sm">{creator.bio || "Welcome to my official EliteHub page! Subscribe for exclusive content."}</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Button className="flex-1">
            Subscribe {creator.subscriptionPrice ? `₹${creator.subscriptionPrice}/mo` : 'Free'}
          </Button>
          <Button variant="secondary" className="px-6">Follow</Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
          <button className="flex-1 py-3 text-center border-b-2 border-brand-yellow font-bold text-brand-yellow">
            Posts
          </button>
          <button className="flex-1 py-3 text-center text-text-lo hover:text-white transition-colors">
            Shop
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1">
          {creator.posts.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-text-lo">
              No posts yet.
            </div>
          ) : (
            creator.posts.map(post => (
              <div key={post.id} className="aspect-square bg-surface-dark relative group overflow-hidden cursor-pointer">
                {/* Normally we'd use the R2 CDN URL, but mediaKey is raw for now */}
                {post.visibility === "private" && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                    <span className="text-2xl mb-1">🔒</span>
                    {post.price && <span className="text-xs font-bold text-brand-yellow bg-black/50 px-2 py-1 rounded">₹{post.price}</span>}
                  </div>
                )}
                {/* Mock Image Placeholder */}
                <div className="w-full h-full bg-text-lo/10 flex items-center justify-center">
                   {post.type === "video" ? "▶️" : "🖼️"}
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
