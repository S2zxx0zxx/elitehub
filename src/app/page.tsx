import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { AdSlot } from "@/components/AdSlot";
import { HomeCategoryGrid } from "@/components/HomeCategoryGrid";
import { TrendingCategoryGrid } from "@/components/TrendingCategoryGrid";
import { TrendingCreatorGrid } from "@/components/TrendingCreatorGrid";
import { FeatureGrid } from "@/components/FeatureGrid";
import { MarketStats } from "@/components/MarketStats";
import { AppDownload } from "@/components/AppDownload";
import { getTrendingCreators, getTrendingContent } from "@/lib/ranking";
import { timeAgo } from "@/lib/time";
import { PostEngagement } from "@/components/PostEngagement";
import { Play, Image as ImageIcon } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds instead of blocking every request

export const metadata: Metadata = {
  title: "EliteHub | The premium creator platform",
  description: "Monetize your exclusive content directly with your fans. No middlemen. Fast payouts.",
  openGraph: {
    title: "EliteHub",
    description: "Monetize your exclusive content directly with your fans.",
    type: "website",
  }
};

export default async function Home() {
  const trendingCreators = await getTrendingCreators();
  const trendingContent = await getTrendingContent();

  return (
    <main className="min-h-screen bg-bg pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4 sm:p-8">
        
        {/* Hero Section */}
        <section className="mb-8 pt-4">
          <h1 className="text-4xl font-serif font-bold leading-[1.1] mb-5 text-text-hi">
            India ke creators,<br />
            <span className="text-text-lo text-3xl">seedha apne fans se kamayein</span>
          </h1>
          <div className="flex gap-4">
            <Link href="/onboarding" className="flex-1">
              <Button variant="primary" className="w-full">Creator bano</Button>
            </Link>
            <Link href="/explore" className="flex-1">
              <Button variant="secondary" className="w-full">Explore</Button>
            </Link>
          </div>
        </section>

        {/* Visual Category Grid */}
        <section className="mb-8">
          <HomeCategoryGrid />
        </section>

        {/* Trending Categories */}
        <section className="mb-8">
          <h3 className="font-serif font-bold text-xl mb-4 text-text-hi">🔥 Trending Categories</h3>
          <TrendingCategoryGrid />
        </section>

        <AdSlot 
          title="Supercharge your edits" 
          description="Get 50% off on Premiere Pro masterclass bundles today." 
          ctaText="View Offer"
          imageColor="bg-gradient-to-r from-purple-600 to-blue-600"
        />

        {/* Featured Creators */}
        <section className="mb-10">
          <h3 className="font-serif font-bold text-xl mb-4 text-text-hi">Featured Creators</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {trendingCreators.length === 0 ? (
              <p className="text-text-lo text-sm">No creators found yet. Be the first!</p>
            ) : (
              trendingCreators.map((creator: (typeof trendingCreators)[number]) => (
                <Link href={`/${creator.handle}`} key={creator.id} className="min-w-[140px]">
                  <Card className="h-full hover:border-brand-yellow/50 transition-colors border border-transparent">
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-surface border-2 border-brand-yellow mb-3 mx-auto overflow-hidden">
                        {creator.photo ? (
                          <img src={creator.photo} alt={creator.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-yellow/20 flex items-center justify-center text-xl font-bold">
                            {(creator.name || creator.handle || "C")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-text-hi line-clamp-1">{creator.name || creator.handle}</h4>
                      <p className="text-xs text-text-lo mt-1 line-clamp-1">{creator.tags && creator.tags.length > 0 ? creator.tags.join(", ") : "Creator"}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Trending Creators Grid */}
        <section className="mb-10">
          <h3 className="font-serif font-bold text-xl mb-4 text-text-hi">Trending Creators</h3>
          <TrendingCreatorGrid creators={trendingCreators} />
        </section>

        {/* Trending Content Feed */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-serif font-bold text-xl text-text-hi">Trending Content</h3>
            <Link href="/explore" className="text-sm font-bold text-brand-yellow">View all</Link>
          </div>
          
          <div className="space-y-6">
            {trendingContent.length === 0 ? (
              <p className="text-text-lo text-sm">No content found yet.</p>
            ) : (
              trendingContent.slice(0,3).map((post: (typeof trendingContent)[number]) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="w-full aspect-[4/5] bg-surface relative">
                    {/* Public content plays automatically in real app */}
                    {post.type === "video" ? (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 bg-black/20 backdrop-blur-sm"><Play size={48} /></div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 bg-black/20 backdrop-blur-sm"><ImageIcon size={48} /></div>
                    )}
                  </div>
                  <CardContent>
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/${post.creator.handle}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface overflow-hidden">
                          {post.creator.photo && <img src={post.creator.photo} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-text-hi">{post.creator.name || post.creator.handle}</h4>
                          <p className="text-xs text-text-lo">{timeAgo(post.createdAt)}</p>
                        </div>
                      </Link>
                      {post.price && (
                        <span className="text-brand-yellow font-bold text-sm bg-brand-yellow/10 px-2 py-1 rounded">₹{post.price}</span>
                      )}
                    </div>
                    {post.caption && <p className="text-sm text-text-hi line-clamp-2">{post.caption}</p>}
                    <PostEngagement 
                      postId={post.id} 
                      initialLikes={post._count?.likes || 0} 
                      initialComments={post._count?.comments || 0}
                      initialSaves={post._count?.saves || 0}
                      initialViews={post.viewCount || 0}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Why EliteHub */}
        <section className="mb-10">
          <h3 className="font-serif font-bold text-xl mb-6 text-center text-text-hi">Why EliteHub</h3>
          <FeatureGrid />
        </section>

        {/* Market Opportunity */}
        <section className="mb-10">
          <h3 className="font-serif font-bold text-xl mb-4 text-text-hi">📈 Market Opportunity</h3>
          <MarketStats />
        </section>

        {/* How it works */}
        <section className="mb-10 bg-surface rounded-3xl p-6 border border-border shadow-glossy">
          <h3 className="font-serif font-bold text-2xl mb-8 text-center text-text-hi">How EliteHub Works</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-navy flex items-center justify-center mx-auto mb-3 font-serif font-bold text-xl text-navy">1</div>
              <h4 className="font-bold text-text-hi mb-1">Create Profile</h4>
              <p className="text-sm text-text-lo leading-relaxed">Sign up, verify KYC, set up your creator page</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-navy flex items-center justify-center mx-auto mb-3 font-serif font-bold text-xl text-navy">2</div>
              <h4 className="font-bold text-text-hi mb-1">Upload Content</h4>
              <p className="text-sm text-text-lo leading-relaxed">Free posts to grow, lock premium ones to earn</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-navy flex items-center justify-center mx-auto mb-3 font-serif font-bold text-xl text-navy">3</div>
              <h4 className="font-bold text-text-hi mb-1">Fans Subscribe</h4>
              <p className="text-sm text-text-lo leading-relaxed">Fans unlock content or subscribe monthly via UPI</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-navy flex items-center justify-center mx-auto mb-3 font-serif font-bold text-xl text-navy">4</div>
              <h4 className="font-bold text-text-hi mb-1">Get Paid Directly</h4>
              <p className="text-sm text-text-lo leading-relaxed">Earnings hit your bank account, no middlemen</p>
            </div>
          </div>
        </section>

        {/* App Download */}
        <section className="mb-10">
          <AppDownload />
        </section>

      </div>
      
      <BottomNav />
    </main>
  );
}
