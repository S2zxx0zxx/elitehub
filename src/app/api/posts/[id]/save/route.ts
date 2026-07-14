import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const postId = params.id;

    const existingSave = await prisma.save.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId
        }
      }
    });

    if (existingSave) {
      await prisma.save.delete({ where: { id: existingSave.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.save.create({
        data: {
          userId: user.id,
          postId
        }
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Failed to toggle save" }, { status: 500 });
  }
}
