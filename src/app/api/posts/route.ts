import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized. Only creators can post." }, { status: 401 });
    }

    const { type, mediaKey, caption, tags, visibility, price } = await req.json();

    if (!mediaKey || !type || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        creatorId: user.id,
        type,
        mediaKey,
        caption,
        tags: tags || [],
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
