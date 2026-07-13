import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: {
        user: {
          select: { name: true, handle: true, image: true, photo: true, tickTier: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Comments Error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await req.json();
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        postId: params.id,
        text: text.trim()
      },
      include: {
        user: {
          select: { name: true, handle: true, image: true, photo: true, tickTier: true }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
