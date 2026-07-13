import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const postId = params.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId
        }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
