import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId;
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (post.visibility === "private") {
      const user = await getDbUser();
      
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const isCreator = user.id === post.creatorId;
      let hasAccess = isCreator;

      if (!hasAccess) {
        // Check active subscription
        const subscription = await prisma.subscription.findFirst({
          where: {
            fanId: user.id,
            creatorId: post.creatorId,
            status: "active"
          }
        });

        if (subscription) {
          hasAccess = true;
        }
      }

      if (!hasAccess) {
        // Check completed purchase
        const purchase = await prisma.purchase.findFirst({
          where: {
            fanId: user.id,
            postId: post.id,
            status: "completed"
          }
        });

        if (purchase) {
          hasAccess = true;
        }
      }

      if (!hasAccess) {
        return new NextResponse("Forbidden - Purchase or Subscription Required", { status: 403 });
      }
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: post.mediaKey,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("[MEDIA_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
