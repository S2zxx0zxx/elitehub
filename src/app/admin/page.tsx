import { redirect } from "next/navigation";
import { getDbUser } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

// Allow-list from ENV
const ADMIN_IDS = process.env.ADMIN_CLERK_IDS ? process.env.ADMIN_CLERK_IDS.split(",") : [];

export default async function AdminPage() {
  const user = await getDbUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Allow-list check
  const isAdmin = user.role === "Admin" || ADMIN_IDS.includes(user.clerkId || "");
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-3xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-text-lo">You do not have permission to view the admin panel.</p>
          <a href="/" className="mt-6 inline-block bg-brand-yellow text-black px-6 py-2 rounded-full font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}
