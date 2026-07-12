import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, targetId } = await req.json(); // type: "post" or "subscription"

    if (type === "post") {
      const post = await prisma.post.findUnique({
        where: { id: targetId },
        include: { creator: true }
      });

      if (!post || !post.price) {
        return NextResponse.json({ error: "Invalid post" }, { status: 400 });
      }

      // Calculate commission: 5% standard, 1% if gold tier
      const commissionRate = post.creator.tickTier === "gold" ? 0.01 : 0.05;
      const commission = post.price * commissionRate;
      const creatorEarning = post.price - commission;

      // Create Razorpay Order
      const order = await razorpay.orders.create({
        amount: Math.round(post.price * 100), // convert to paise
        currency: "INR",
        receipt: `receipt_${targetId}_${Date.now()}`
      });

      // Save pending purchase
      await prisma.purchase.create({
        data: {
          fanId: session.user.id,
          postId: post.id,
          amount: post.price,
          commission,
          creatorEarning,
          status: "pending",
          razorpayPaymentId: order.id, // Using order ID to track until webhook fires
        }
      });

      return NextResponse.json({ orderId: order.id, amount: post.price * 100 });
    }

    // Subscription logic can go here (similar flow, creating a subscription plan or recurring order)
    return NextResponse.json({ error: "Subscription flow not fully implemented in demo" }, { status: 400 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
