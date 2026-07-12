import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

/**
 * Retrieves the current authenticated user from the database.
 * If the user is authenticated with Clerk but doesn't exist in our DB yet,
 * they will be created automatically (Lazy Sync).
 */
export async function getDbUser() {
  const { userId } = auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    const clerkUser = await currentUser();
    
    // Fallback name if available
    let name = "New User";
    if (clerkUser?.firstName) {
      name = `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim();
    }

    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
    const photo = clerkUser?.imageUrl || null;

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        name,
        email,
        photo,
        // Using email username as default handle if available
        handle: email ? email.split('@')[0] + Math.floor(Math.random() * 1000) : `user_${Math.floor(Math.random() * 10000)}`,
        role: "Fan", // default role, will be updated in onboarding
      }
    });
  }

  return user;
}
