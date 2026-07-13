import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";
import { ProfileClient } from "@/components/ProfileClient";

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const creator = await prisma.user.findUnique({
    where: { handle: params.handle }
  });

  if (!creator || creator.role !== "Creator") {
    return {
      title: "Not Found",
      description: "Creator not found on EliteHub"
    };
  }

  const name = creator.name || creator.handle;
  const description = creator.bio || `Check out ${name}'s exclusive content on EliteHub.`;

  return {
    title: `${name} | EliteHub`,
    description: description,
    openGraph: {
      title: `${name} on EliteHub`,
      description: description,
      images: creator.photo ? [creator.photo] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} on EliteHub`,
      description: description,
      images: creator.photo ? [creator.photo] : [],
    }
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const creator = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { likes: true, comments: true } }
        }
      }
    }
  });

  if (!creator || creator.role !== "Creator") {
    notFound();
  }

  const viewer = await getDbUser();
  let isSubscribed = false;
  let purchasedPostIds: string[] = [];

  if (viewer) {
    const sub = await prisma.subscription.findFirst({
      where: { fanId: viewer.id, creatorId: creator.id, status: "active" }
    });
    if (sub) isSubscribed = true;

    const purchases = await prisma.purchase.findMany({
      where: { fanId: viewer.id, status: "completed" },
      select: { postId: true }
    });
    purchasedPostIds = purchases.map(p => p.postId);
  }

  const isFollowing = viewer ? (await prisma.follow.findFirst({
    where: { followerId: viewer.id, creatorId: creator.id }
  })) !== null : false;

  const sanitizedPosts = creator.posts.map(post => {
    // Strip mediaKey for all viewers - client will use /api/media/[postId]
    return { ...post, mediaKey: null as any };
  });

  const followersCount = await prisma.follow.count({
    where: { creatorId: creator.id }
  });

  const isBlue = creator.kycStatus === "verified" && followersCount >= 100;
  const isGold = creator.tickTier === "gold" && followersCount >= 100000;

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
              <p className="font-bold text-lg">{followersCount}</p>
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
          <p className="text-text-lo mb-2">@{creator.handle} • {creator.tags && creator.tags.length > 0 ? creator.tags.join(", ") : "Creator"}</p>
          <p className="text-sm">{creator.bio || "Welcome to my official EliteHub page! Subscribe for exclusive content."}</p>
        </div>

        {/* Tabs and Posts Grid handled by Client Component */}
        <ProfileClient 
          posts={sanitizedPosts} 
          creatorName={creator.name || creator.handle || "Creator"} 
          handle={creator.handle || ""}
          creatorId={creator.id}
          subscriptionPrice={creator.subscriptionPrice || 0}
          isSubscribed={isSubscribed}
          initialIsFollowing={isFollowing}
          purchasedPostIds={purchasedPostIds}
          fullCreator={creator}
        />
      </div>
      
      <BottomNav />
    </main>
  );
}
