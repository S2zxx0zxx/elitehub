import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Soft delete the user by anonymizing and changing status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: "Deleted User",
        handle: null,
        clerkId: null,
        email: null,
        status: "deleted",
        bio: "",
        photo: null,
        image: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
