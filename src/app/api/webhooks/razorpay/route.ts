import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const signatureBuffer = Buffer.from(signature, "utf-8");

    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Find the pending purchase by tracking the order ID we saved
      const purchase = await prisma.purchase.findFirst({
        where: { razorpayPaymentId: orderId }
      });

      if (purchase) {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { 
            status: "completed",
            razorpayPaymentId: payment.id // Overwrite with actual payment ID
          }
        });
        
        // Find fan details for notification
        const fan = await prisma.user.findUnique({ where: { id: purchase.fanId } });
        const post = await prisma.post.findUnique({ where: { id: purchase.postId } });
        
        if (post && fan) {
          await prisma.notification.create({
            data: {
              userId: post.creatorId,
              type: "promotion",
              title: "Post Unlocked!",
              body: `${fan.name || fan.handle || "Someone"} unlocked your post for ₹${purchase.amount}.`
            }
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
