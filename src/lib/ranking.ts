import { prisma } from "@/lib/db";

// Scoring Formula: 
// Trending = (Followers * 2) + (Purchases * 5) + (Recency Bonus up to 30 points)
// New = Created in last 30 days, sorted by post count activity

export async function getTrendingCreators() {
  const creators = await prisma.user.findMany({
    where: { role: "Creator" },
    include: {
      _count: {
        select: { followers: true } // Removed purchases since User.purchases is fan purchases
      },
      posts: { 
        include: { _count: { select: { purchases: true } } }
      }
    }
  });

  const scored = creators.map(creator => {
    const daysSinceCreation = (new Date().getTime() - new Date(creator.createdAt).getTime()) / (1000 * 3600 * 24);
    const recencyBonus = Math.max(0, 30 - daysSinceCreation); // Max 30 points for being brand new
    
    // Sum purchases from all posts
    const totalContentPurchases = creator.posts.reduce((sum, post) => sum + post._count.purchases, 0);

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
      creator: {
        include: {
          _count: { select: { followers: true } },
          posts: { include: { _count: { select: { purchases: true } } } }
        }
      }
    }
  });

  const scored = posts.map(post => {
    // Creator base score based on followers and overall purchases
    const totalCreatorPurchases = post.creator.posts.reduce((sum, p) => sum + p._count.purchases, 0);
    const creatorScore = (post.creator._count.followers * 2) + (totalCreatorPurchases * 5);
    
    // Post recency bonus
    const hoursSinceCreation = (new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 3600);
    const recencyBonus = Math.max(0, 100 - hoursSinceCreation); // decays by 1 pt per hour

    const score = creatorScore + (recencyBonus * 2); // favor recency in feed
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
