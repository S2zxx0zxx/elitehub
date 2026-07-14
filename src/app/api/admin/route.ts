import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_IDS = process.env.ADMIN_CLERK_IDS ? process.env.ADMIN_CLERK_IDS.split(",") : [];

export async function GET(req: Request) {
  const user = await getDbUser();
  if (!user || (user.role !== "Admin" && !ADMIN_IDS.includes(user.clerkId || ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalCreators = await prisma.user.count({ where: { role: "Creator" } });
    
    const purchases = await prisma.purchase.findMany({ where: { status: "completed" } });
    const totalSalesVolume = purchases.reduce((acc: number, p) => acc + p.amount, 0);
    const totalCommission = purchases.reduce((acc: number, p) => acc + p.commission, 0);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const todaysSignups = await prisma.user.count({ where: { createdAt: { gte: today } } });

    const pendingKyc = await prisma.user.findMany({ where: { kycStatus: "pending" } });
    const pendingPayouts = await prisma.payout.findMany({ where: { status: "requested" }, include: { creator: true } });
    const openReports = await prisma.report.findMany({ where: { status: "open" }, include: { post: true } });

    return NextResponse.json({
      stats: { totalUsers, totalCreators, totalSalesVolume, totalCommission, todaysSignups },
      pendingKyc,
      pendingPayouts,
      openReports
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getDbUser();
  if (!user || (user.role !== "Admin" && !ADMIN_IDS.includes(user.clerkId || ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, payload } = await req.json();

    if (action === "approveKyc") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { kycStatus: "verified", tickTier: payload.tier }
      });
    } else if (action === "rejectKyc") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { kycStatus: "rejected" }
      });
    } else if (action === "approvePayout") {
      await prisma.payout.update({
        where: { id: payload.payoutId },
        data: { status: "paid", paidAt: new Date() }
      });
    } else if (action === "createBroadcast") {
      await prisma.broadcast.create({
        data: { title: payload.title, body: payload.body }
      });
    } else if (action === "resolveReport") {
      await prisma.report.update({
        where: { id: payload.reportId },
        data: { status: "resolved" }
      });
    } else if (action === "deletePostAndResolveReport") {
      await prisma.post.delete({ where: { id: payload.postId } });
      await prisma.report.update({
        where: { id: payload.reportId },
        data: { status: "resolved" }
      });
    } else if (action === "banUser") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { status: "banned" }
      });
    } else if (action === "searchUser") {
      const searchedUser = await prisma.user.findFirst({
        where: { handle: payload.handle }
      });
      return NextResponse.json({ success: true, user: searchedUser });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Admin action failed" }, { status: 500 });
  }
}
