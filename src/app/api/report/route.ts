import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, reason } = await req.json();

    if (!postId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        postId,
        reason,
        status: "open"
      }
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
