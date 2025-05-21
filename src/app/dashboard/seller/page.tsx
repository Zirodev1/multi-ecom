// Next.js
import { redirect } from "next/navigation";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { 
  DEMO_MODE_COOKIE, 
  DEMO_SESSION_COOKIE, 
  DEMO_STORE_URL
} from "@/lib/demo-mode";

export default async function SellerDashboardPage() {
  // Check if user is in demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoSessionId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  
  if (isDemoMode && demoSessionId) {
    // For demo users, redirect to the demo store directly
    redirect(`/dashboard/seller/stores/${DEMO_STORE_URL}`);
    return;
  }
  
  // For non-demo users: normal flow
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const user = await currentUser();
  if (!user) {
    redirect("/");
    return; // Ensure no further code is executed after redirect
  }

  // Retrieve the list of stores associated with the authenticated user.
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  // If the user has no stores, redirect them to the page for creating a new store.
  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
    return; // Ensure no further code is executed after redirect
  }

  // If the user has stores, redirect them to the dashboard of their first store.
  redirect(`/dashboard/seller/stores/${stores[0].url}`);

  return <div>Seller Dashboard</div>;
}
