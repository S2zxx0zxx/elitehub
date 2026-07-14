import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Scoring Formula: 
// Trending = (Followers * 2) + (Purchases * 5) + (Recency Bonus up to 30 points)
// New = Created in last 30 days, sorted by post count activity

export async function getTrendingCreators() {
  const creators = await prisma.user.findMany({
    where: { role: "Creator" },
    include: {
      _count: {
        select: { followers: true }
      }
    }
  });

  const creatorIds = creators.map(c => c.id);
  const postPurchases = await prisma.post.findMany({
    where: { creatorId: { in: creatorIds } },
    select: { creatorId: true, _count: { select: { purchases: true } } }
  });

  const purchasesByCreator: Record<string, number> = {};
  for (const p of postPurchases) {
    purchasesByCreator[p.creatorId] = (purchasesByCreator[p.creatorId] || 0) + p._count.purchases;
  }

  const scored = creators.map(creator => {
    const daysSinceCreation = (new Date().getTime() - new Date(creator.createdAt).getTime()) / (1000 * 3600 * 24);
    const recencyBonus = Math.max(0, 30 - daysSinceCreation); 
    
    const totalContentPurchases = purchasesByCreator[creator.id] || 0;

    const score = (creator._count.followers * 2) + (totalContentPurchases * 5) + recencyBonus;
    return { ...creator, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

export async function getTrendingContent() {
  const posts = await prisma.post.findMany({
    where: { visibility: "public" },
    take: 50,
    include: {
      _count: { select: { likes: true, comments: true, saves: true } },
      creator: {
        include: {
          _count: { select: { followers: true } }
        }
      }
    }
  });

  const creatorIds = Array.from(new Set(posts.map(p => p.creatorId)));
  const allCreatorPosts = await prisma.post.findMany({
    where: { creatorId: { in: creatorIds } },
    select: { creatorId: true, _count: { select: { purchases: true } } }
  });

  const purchasesByCreator: Record<string, number> = {};
  for (const p of allCreatorPosts) {
    purchasesByCreator[p.creatorId] = (purchasesByCreator[p.creatorId] || 0) + p._count.purchases;
  }

  const scored = posts.map(post => {
    const totalCreatorPurchases = purchasesByCreator[post.creatorId] || 0;
    const creatorScore = (post.creator._count.followers * 2) + (totalCreatorPurchases * 5);
    
    const engagementScore = (post._count?.likes || 0) * 2 + (post._count?.comments || 0) * 3 + (post._count?.saves || 0) * 4 + (post.viewCount || 0) * 1;

    const hoursSinceCreation = (new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 3600);
    const recencyBonus = Math.max(0, 100 - hoursSinceCreation); 

    const score = creatorScore + engagementScore + (recencyBonus * 2); 
    return { ...post, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 15);
}

export async function getNewCreators() {
  const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return await prisma.user.findMany({
    where: { 
      role: "Creator",
      createdAt: { gte: thirtyDaysAgo }
    },
    orderBy: {
      posts: {
        _count: 'desc'
      }
    },
    take: 5,
  });
}

export async function getTopTags(limit: number = 10) {
  const posts = await prisma.post.findMany({ select: { tags: true } });
  const tagCounts: Record<string, number> = {};
  posts.forEach(p => {
    p.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}
