import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys missing");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscriptionId } = await req.json();

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription || subscription.fanId !== user.id) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.razorpaySubId) {
      await razorpay.subscriptions.cancel(subscription.razorpaySubId);
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "cancelled" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
