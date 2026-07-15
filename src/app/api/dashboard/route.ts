import { NextResponse } from "next/server";

import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatorId = user.id;

    // 1. Calculate Total Earnings from Purchases and Subscriptions
    const purchases = await prisma.purchase.findMany({
      where: { 
        post: { creatorId: creatorId },
        status: "completed"
      }
    });
    const subPayments = await prisma.subscriptionPayment.findMany({
      where: { creatorId: creatorId }
    });

    const totalEarnings = 
      purchases.reduce((sum: number, p: any) => sum + p.creatorEarning, 0) +
      subPayments.reduce((sum: number, p: any) => sum + p.creatorEarning, 0);

    // 2. Calculate requested/paid payouts
    const payouts = await prisma.payout.findMany({
      where: { creatorId: creatorId }
    });

    const totalPayouts = payouts.reduce((sum: number, p: any) => sum + p.amount, 0);

    // 3. Available Balance
    const availableBalance = totalEarnings - totalPayouts;

    // 4. Subscriber Count
    const subscribersCount = await prisma.subscription.count({
      where: { creatorId: creatorId, status: "active" }
    });

    // 5. Followers Count
    const followersCount = await prisma.follow.count({
      where: { creatorId: creatorId }
    });

    // 6. Weekly Growth Calculation (Earnings)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekPurchases = await prisma.purchase.findMany({
      where: { post: { creatorId: creatorId }, status: "completed", createdAt: { gte: sevenDaysAgo } }
    });
    const lastWeekPurchases = await prisma.purchase.findMany({
      where: { post: { creatorId: creatorId }, status: "completed", createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    });
    const thisWeekSubs = await prisma.subscriptionPayment.findMany({
      where: { creatorId: creatorId, createdAt: { gte: sevenDaysAgo } }
    });
    const lastWeekSubs = await prisma.subscriptionPayment.findMany({
      where: { creatorId: creatorId, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    });

    const thisWeekEarnings = 
      thisWeekPurchases.reduce((sum: number, p: any) => sum + p.creatorEarning, 0) +
      thisWeekSubs.reduce((sum: number, p: any) => sum + p.creatorEarning, 0);
      
    const lastWeekEarnings = 
      lastWeekPurchases.reduce((sum: number, p: any) => sum + p.creatorEarning, 0) +
      lastWeekSubs.reduce((sum: number, p: any) => sum + p.creatorEarning, 0);
    
    let weeklyGrowth = 0;
    if (lastWeekEarnings === 0 && thisWeekEarnings > 0) weeklyGrowth = 100;
    else if (lastWeekEarnings > 0) weeklyGrowth = Math.round(((thisWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100);

    // 7. Chart Data (30 days earnings)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPurchases = await prisma.purchase.findMany({
      where: { post: { creatorId: creatorId }, status: "completed", createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, creatorEarning: true }
    });
    const recentSubs = await prisma.subscriptionPayment.findMany({
      where: { creatorId: creatorId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, creatorEarning: true }
    });
    
    const chartDataMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getMonth()+1}/${d.getDate()}`;
      chartDataMap[key] = 0;
    }
    
    const allRecentTransactions = [...recentPurchases, ...recentSubs];
    
    allRecentTransactions.forEach(p => {
      const d = new Date(p.createdAt);
      const key = `${d.getMonth()+1}/${d.getDate()}`;
      if (chartDataMap[key] !== undefined) {
        chartDataMap[key] += p.creatorEarning;
      }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({ date, earnings: chartDataMap[date] }));

    // 8. Recent Ledger (Recent purchases + subscriptions)
    const recentPostPurchases = await prisma.purchase.findMany({
      where: { 
        post: { creatorId: creatorId },
        status: "completed"
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        fan: true,
        post: true
      }
    });

    const recentSubPayments = await prisma.subscriptionPayment.findMany({
      where: { creatorId: creatorId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        fan: true
      }
    });

    const recentTransactions = [...recentPostPurchases, ...recentSubPayments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((tx) => ({
        id: tx.id,
        type: 'post' in tx ? 'Post Unlock' : 'Subscription',
        fan: tx.fan,
        creatorEarning: tx.creatorEarning,
        commission: tx.commission,
        createdAt: tx.createdAt
      }));

    return NextResponse.json({
      totalEarnings,
      availableBalance,
      subscribersCount,
      followersCount,
      weeklyGrowth,
      chartData,
      recentTransactions,
      payouts
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
