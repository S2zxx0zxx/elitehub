import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatorId = session.user.id;

    // 1. Calculate Total Earnings from Purchases
    const purchases = await prisma.purchase.findMany({
      where: { 
        post: { creatorId: creatorId },
        status: "completed"
      }
    });

    const totalEarnings = purchases.reduce((sum, p) => sum + p.creatorEarning, 0);

    // 2. Calculate requested/paid payouts
    const payouts = await prisma.payout.findMany({
      where: { creatorId: creatorId }
    });

    const totalPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);

    // 3. Available Balance
    const availableBalance = totalEarnings - totalPayouts;

    // 4. Subscriber Count (Mocked for now since Subscriptions aren't fully implemented in mock checkout)
    const subscribersCount = await prisma.subscription.count({
      where: { creatorId: creatorId, status: "active" }
    });

    // 5. Recent Ledger (Recent purchases)
    const recentTransactions = await prisma.purchase.findMany({
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

    return NextResponse.json({
      totalEarnings,
      availableBalance,
      subscribersCount,
      recentTransactions,
      payouts
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
