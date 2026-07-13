"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/Card";
import { AdSlot } from "@/components/AdSlot";
import { Chip } from "@/components/Chip";
import { PostEngagement } from "@/components/PostEngagement";

export function ExploreClient({ trendingContent, newCreators, topTags }: { trendingContent: any[], newCreators: any[], topTags: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...topTags];

  const filteredContent = trendingContent.filter(post => {
    const matchesSearch = 
      post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creator.handle?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === "All" || (post.tags && post.tags.includes(activeCategory));
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-md mx-auto p-4 sm:p-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-lo">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search creators, posts, or tags..." 
          className="w-full bg-surface-dark border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-elite-white focus:outline-none focus:border-brand-yellow transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <section className="mb-8 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <div key={cat} onClick={() => setActiveCategory(cat)}>
            <Chip active={activeCategory === cat}>{cat}</Chip>
          </div>
        ))}
      </section>

      {/* Naye Creators (New) */}
      <section className="mb-10">
        <h3 className="font-display font-bold text-xl mb-4">Discover Naye Creators ✨</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {newCreators.map(creator => (
            <Link href={`/${creator.handle}`} key={creator.id} className="min-w-[120px]">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-surface-dark border-2 border-brand-yellow/50 p-1 mb-2">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-light text-black flex items-center justify-center font-bold text-xl">
                    {creator.photo ? (
                      <img src={creator.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (creator.name || creator.handle || "C")[0].toUpperCase()
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-elite-white line-clamp-1 text-center w-full">{creator.name || creator.handle}</h4>
                <p className="text-xs text-text-lo text-center w-full">New</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feed - Reels/Posts */}
      <section className="space-y-6">
        <h3 className="font-display font-bold text-xl mb-2">Explore Feed</h3>
        
        {filteredContent.length === 0 ? (
          <p className="text-text-lo text-sm">No content found matching your criteria.</p>
        ) : (
          filteredContent.map((post, i) => (
            <React.Fragment key={post.id}>
              <Card className="overflow-hidden bg-black border-none rounded-3xl">
                <div className="w-full aspect-[9/16] relative">
                  <div className="absolute inset-0 bg-surface-dark animate-pulse" />
                  
                  {post.type === "video" && (
                    <video 
                      className="absolute inset-0 w-full h-full object-cover" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      <source src={`/api/media/${post.id}`} type="video/mp4" />
                    </video>
                  )}
                  {post.type === "photo" && (
                    <img 
                      src={`/api/media/${post.id}`} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 z-10">
                    <div className="flex justify-between items-end">
                      <div className="flex-1">
                        <Link href={`/${post.creator.handle}`} className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-brand-yellow/20 overflow-hidden flex items-center justify-center font-bold text-brand-yellow">
                            {(post.creator.name || "C")[0]}
                          </div>
                          <span className="font-bold text-white text-shadow">{post.creator.name || post.creator.handle}</span>
                        </Link>
                        {post.caption && <p className="text-sm text-white text-shadow line-clamp-2">{post.caption}</p>}
                        <PostEngagement 
                          postId={post.id} 
                          initialLikes={post._count?.likes || 0} 
                          initialComments={post._count?.comments || 0} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Inject Ad slot every 2 posts */}
              {i === 1 && (
                <AdSlot 
                  title="Unlock Gold Tier" 
                  description="Creators with 10k+ followers qualify for 1% commission."
                  ctaText="Apply Now"
                  imageColor="bg-gradient-to-br from-yellow-400 to-yellow-600"
                />
              )}
            </React.Fragment>
          ))
        )}
      </section>
    </div>
  );
}
