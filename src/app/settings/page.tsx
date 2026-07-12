import { redirect } from "next/navigation";
import { getDbUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getDbUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <SettingsClient user={user} />;
}
