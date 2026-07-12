import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NotificationsClient } from "@/components/NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getDbUser();
  if (!user) {
    redirect("/sign-in");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <NotificationsClient notifications={notifications} broadcasts={broadcasts} />;
}
