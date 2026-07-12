import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, upiId, category, theme } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        bio,
        upiId,
        category,
        theme
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Settings Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
