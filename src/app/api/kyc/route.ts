import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idNumber, legalName } = await req.json();

    if (!idNumber || !legalName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        kycStatus: "pending"
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("KYC Error:", error);
    return NextResponse.json({ error: "Failed to submit KYC" }, { status: 500 });
  }
}
