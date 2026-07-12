import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!user) {
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
      if (existing && existing.id !== user.id) {
        return NextResponse.json({ error: "Handle already taken" }, { status: 400 });
      }
    }

    // Update the user record
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role,
        category: categories?.[0] || null, // taking first item since onboarding might send array
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
