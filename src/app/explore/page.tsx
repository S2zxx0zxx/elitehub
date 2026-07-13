import React from "react";
import { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { ExploreClient } from "@/components/ExploreClient";
import { getTrendingCreators, getTrendingContent, getNewCreators, getTopTags } from "@/lib/ranking";
import { BottomNav } from "@/components/BottomNav";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Explore | EliteHub",
  description: "Discover trending creators and exclusive content on EliteHub.",
};

export default async function ExplorePage() {
  const trendingContent = await getTrendingContent();
  const newCreators = await getNewCreators();
  const topTags = await getTopTags();

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      
      <ExploreClient trendingContent={trendingContent} newCreators={newCreators} topTags={topTags} />
      <BottomNav />
    </main>
  );
}
