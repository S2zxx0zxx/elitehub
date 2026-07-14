import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = params.id;
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View Error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
