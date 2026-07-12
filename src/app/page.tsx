import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { AdSlot } from "@/components/AdSlot";
import { getTrendingCreators, getTrendingContent } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trendingCreators = await getTrendingCreators();
  const trendingContent = await getTrendingContent();

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      
      <div className="max-w-md mx-auto p-4 sm:p-8">
        
        {/* Hero Section */}
        <section className="mb-8 pt-4">
          <h1 className="text-4xl font-display font-bold leading-[1.1] mb-5">
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

        {/* Category Strip */}
        <section className="mb-8 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <Chip active>Trending</Chip>
          <Chip>VFX & Edits</Chip>
          <Chip>Music</Chip>
          <Chip>Design</Chip>
          <Chip>Education</Chip>
          <Chip>Art</Chip>
        </section>

        <AdSlot 
          title="Supercharge your edits" 
          description="Get 50% off on Premiere Pro masterclass bundles today." 
          ctaText="View Offer"
          imageColor="bg-gradient-to-r from-purple-600 to-blue-600"
        />

        {/* Featured Creators */}
        <section className="mb-10">
          <h3 className="font-display font-bold text-xl mb-4">Featured Creators</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {trendingCreators.length === 0 ? (
              <p className="text-text-lo text-sm">No creators found yet. Be the first!</p>
            ) : (
              trendingCreators.map(creator => (
                <Link href={`/${creator.handle}`} key={creator.id} className="min-w-[140px]">
                  <Card className="h-full hover:border-brand-yellow/50 transition-colors border border-transparent">
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-surface-dark border-2 border-brand-yellow mb-3 mx-auto overflow-hidden">
                        {creator.photo ? (
                          <img src={creator.photo} alt={creator.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-yellow/20 flex items-center justify-center text-xl font-bold">
                            {(creator.name || creator.handle || "C")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-elite-white line-clamp-1">{creator.name || creator.handle}</h4>
                      <p className="text-xs text-text-lo mt-1 line-clamp-1">{creator.category || "Creator"}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Trending Content Feed */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-display font-bold text-xl">Trending Content</h3>
            <Link href="/explore" className="text-sm font-bold text-brand-yellow">View all</Link>
          </div>
          
          <div className="space-y-6">
            {trendingContent.length === 0 ? (
              <p className="text-text-lo text-sm">No content found yet.</p>
            ) : (
              trendingContent.slice(0,3).map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="w-full aspect-[4/5] bg-surface-dark relative">
                    {/* Public content plays automatically in real app */}
                    {post.type === "video" ? (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-4xl bg-black/20 backdrop-blur-sm">▶️</div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-4xl bg-black/20 backdrop-blur-sm">🖼️</div>
                    )}
                  </div>
                  <CardContent>
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/${post.creator.handle}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-dark overflow-hidden">
                          {post.creator.photo && <img src={post.creator.photo} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-elite-white">{post.creator.name || post.creator.handle}</h4>
                          <p className="text-xs text-text-lo">2 hours ago</p>
                        </div>
                      </Link>
                      {post.price && (
                        <span className="text-brand-yellow font-bold text-sm bg-brand-yellow/10 px-2 py-1 rounded">₹{post.price}</span>
                      )}
                    </div>
                    {post.caption && <p className="text-sm text-elite-white line-clamp-2">{post.caption}</p>}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10 bg-surface-dark rounded-3xl p-6 border border-white/5">
          <h3 className="font-display font-bold text-xl mb-6 text-center">How it works</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-yellow text-black font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <h4 className="font-bold text-elite-white">Create a profile</h4>
                <p className="text-sm text-text-lo">Setup your creator page in 2 minutes.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-yellow text-black font-bold flex items-center justify-center shrink-0">2</div>
              <div>
                <h4 className="font-bold text-elite-white">Upload content</h4>
                <p className="text-sm text-text-lo">Share free reels to grow, or lock premium posts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-yellow text-black font-bold flex items-center justify-center shrink-0">3</div>
              <div>
                <h4 className="font-bold text-elite-white">Get paid directly</h4>
                <p className="text-sm text-text-lo">Fans pay via UPI. Earnings hit your bank account.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      <BottomNav />
    </main>
  );
}
