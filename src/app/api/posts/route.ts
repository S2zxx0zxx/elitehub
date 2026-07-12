import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, mediaKey, caption, category, hashtags, visibility, price } = await req.json();

    if (!mediaKey || !type || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        creatorId: session.user.id,
        type,
        mediaKey,
        caption,
        category,
        hashtags,
        visibility,
        price: price ? parseFloat(price) : null,
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
