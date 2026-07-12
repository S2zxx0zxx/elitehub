import { redirect } from "next/navigation";
import { getDbUser } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

// Hardcoded allow-list of Admin Clerk IDs or DB IDs.
// For now, we'll use a placeholder array. In a real app, populate with actual IDs.
const ADMIN_IDS = ["user_2id_placeholder", "admin_clerk_id_here"];

export default async function AdminPage() {
  const user = await getDbUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Allow-list check or role check. 
  // If we had a role === "Admin", we'd check it here.
  // For safety in this demo, we'll allow access if the user's role is "Admin" or if they are in the allow-list.
  const isAdmin = user.role === "Admin" || ADMIN_IDS.includes(user.clerkId || "");
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <div className="bg-surface-dark p-8 rounded-3xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-text-lo">You do not have permission to view the admin panel.</p>
          <a href="/" className="mt-6 inline-block bg-brand-yellow text-black px-6 py-2 rounded-full font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}
