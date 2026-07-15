import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized. Must be a Creator." }, { status: 401 });
    }

    const creatorId = user.id;
    const { amount, upiId } = await req.json();

    if (!amount || amount <= 0 || !upiId) {
      return NextResponse.json({ error: "Invalid amount or UPI ID" }, { status: 400 });
    }

    // Double check available balance
    const purchases = await prisma.purchase.findMany({
      where: { post: { creatorId: creatorId }, status: "completed" }
    });
    const totalEarnings = purchases.reduce((sum: number, p: any) => sum + p.creatorEarning, 0);

    const payouts = await prisma.payout.findMany({
      where: { creatorId: creatorId }
    });
    const totalPayouts = payouts.reduce((sum: number, p: any) => sum + p.amount, 0);

    const availableBalance = totalEarnings - totalPayouts;

    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create the Payout record
    const payout = await prisma.payout.create({
      data: {
        creatorId,
        amount: parseFloat(amount),
        upiId,
        status: "requested"
      }
    });

    return NextResponse.json({ success: true, payout });

  } catch (error) {
    console.error("Payout API Error:", error);
    return NextResponse.json({ error: "Failed to request payout" }, { status: 500 });
  }
}
