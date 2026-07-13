import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!user) {
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
          fanId: user.id,
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

    if (type === "subscription") {
      const creator = await prisma.user.findUnique({
        where: { id: targetId }
      });

      if (!creator || !creator.subscriptionPrice) {
        return NextResponse.json({ error: "Invalid creator or price not set" }, { status: 400 });
      }

      let planId = creator.razorpayPlanId;

      if (!planId) {
        const plan = await razorpay.plans.create({
          period: "monthly",
          interval: 1,
          item: {
            name: `Subscription to ${creator.name || creator.handle}`,
            amount: Math.round(creator.subscriptionPrice * 100),
            currency: "INR",
          }
        });
        planId = plan.id;
        await prisma.user.update({
          where: { id: creator.id },
          data: { razorpayPlanId: planId }
        });
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 0,
        total_count: 120 // e.g. 10 years
      });

      await prisma.subscription.create({
        data: {
          fanId: user.id,
          creatorId: creator.id,
          razorpaySubId: subscription.id,
          status: "pending"
        }
      });

      return NextResponse.json({ subscriptionId: subscription.id, amount: creator.subscriptionPrice * 100 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
