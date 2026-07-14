import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized. Must be a creator." }, { status: 401 });
    }

    const { filename, contentType, type } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    const fileExtension = filename.split(".").pop();
    const folder = type === "product" ? "products" : "media";
    const uniqueKey = `${user.id}/${folder}/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "elitehub-bucket",
      Key: uniqueKey,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ signedUrl, key: uniqueKey });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
