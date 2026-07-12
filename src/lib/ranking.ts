import { prisma } from "@/lib/db";

// In a real production app, "engagement" would be calculated based on likes, comments, watch time.
// For EliteHub v1, we mock "fair-reach" by combining recent creation date with a small randomizer
// so that new creators (Naye) get surfaced alongside established (Trending) ones.

export async function getTrendingCreators() {
  return await prisma.user.findMany({
    where: { role: "Creator" },
    orderBy: { createdAt: 'desc' }, // In real app: orderBy engagement score
    take: 10,
    include: {
      posts: { take: 1 } // fetch 1 post for preview thumbnail
    }
  });
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
  return await prisma.user.findMany({
    where: { role: "Creator" },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}
