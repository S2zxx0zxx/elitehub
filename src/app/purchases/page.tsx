import { redirect } from "next/navigation";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PurchasesClient } from "./PurchasesClient";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const user = await getDbUser();
  if (!user) redirect("/sign-in");

  const purchases = await prisma.purchase.findMany({
    where: { fanId: user.id, status: "completed" },
    include: {
      post: {
        include: { creator: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <PurchasesClient purchases={purchases} />;
}
