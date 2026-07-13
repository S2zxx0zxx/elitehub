import React from "react";
import { TopBar } from "@/components/TopBar";
import { ExploreClient } from "@/components/ExploreClient";
import { getTrendingCreators, getTrendingContent, getNewCreators } from "@/lib/ranking";
import { BottomNav } from "@/components/BottomNav";

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const trendingCreators = await getTrendingCreators();
  const trendingContent = await getTrendingContent();
  const newCreators = await getNewCreators();

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      
      <ExploreClient trendingContent={trendingContent} newCreators={newCreators} />
      <BottomNav />
    </main>
  );
}
