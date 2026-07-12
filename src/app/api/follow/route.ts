import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { creatorId } = await req.json();

    const existingFollow = await prisma.follow.findFirst({
      where: { followerId: user.id, creatorId }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_creatorId: { followerId: user.id, creatorId }
        }
      });
      return NextResponse.json({ status: "unfollowed" });
    } else {
      await prisma.follow.create({
        data: { followerId: user.id, creatorId }
      });
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId: creatorId,
          type: "promotion",
          title: "New Follower!",
          body: `${user.name || user.handle || "Someone"} started following you.`
        }
      });

      return NextResponse.json({ status: "followed" });
    }
  } catch (error) {
    console.error("Follow Error:", error);
    return NextResponse.json({ error: "Failed to process follow" }, { status: 500 });
  }
}
