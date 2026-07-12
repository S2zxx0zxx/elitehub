import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role, categories, handle, subscriptionPrice } = body;

    if (!role || (role !== "Fan" && role !== "Creator")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if handle is unique if provided
    if (handle) {
      const existing = await prisma.user.findUnique({
        where: { handle }
      });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Handle already taken" }, { status: 400 });
      }
    }

    // Update the user record
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role,
        categories: categories || [],
        handle: handle || null,
        subscriptionPrice: subscriptionPrice ? parseFloat(subscriptionPrice) : null,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
