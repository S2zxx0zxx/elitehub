import { prisma } from "@/lib/db";

// Scoring Formula: 
// Trending = (Followers * 2) + (Purchases * 5) + (Recency Bonus up to 30 points)
// New = Created in last 30 days, sorted by post count activity

export async function getTrendingCreators() {
  const creators = await prisma.user.findMany({
    where: { role: "Creator" },
    include: {
      _count: {
        select: { followers: true, purchases: true }
      },
      posts: { take: 1, orderBy: { createdAt: 'desc' } }
    }
  });

  const scored = creators.map(creator => {
    const daysSinceCreation = (new Date().getTime() - new Date(creator.createdAt).getTime()) / (1000 * 3600 * 24);
    const recencyBonus = Math.max(0, 30 - daysSinceCreation); // Max 30 points for being brand new
    const score = (creator._count.followers * 2) + (creator._count.purchases * 5) + recencyBonus;
    return { ...creator, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

export async function getTrendingContent() {
  return await prisma.post.findMany({
    where: { visibility: "public" },
    orderBy: { createdAt: 'desc' },
    take: 15,
    include: {
      creator: true
    }
  });
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
