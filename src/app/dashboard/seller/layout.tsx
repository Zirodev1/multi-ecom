import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";

// Components
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Header from "@/components/dashboard/header/header";

// Import DB to fetch stores
import { db } from "@/lib/db";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check for demo user first
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  console.log("Seller Dashboard Layout - Is Demo Mode:", isDemoMode);
  console.log("Seller Dashboard Layout - Demo Role:", demoRole);
  
  // If demo user with seller role, allow access
  if (isDemoMode && demoRole === "SELLER") {
    console.log("Using demo mode for seller dashboard");
    return (
      <div className="w-full h-full">
        {/* Sidebar */}
        <Sidebar isDemo demoRole="SELLER" />
        <div className="ml-[300px]">
          {/* Header */}
          <Header isDemo />
          <div className="w-full mt-[75px] p-4">{children}</div>
        </div>
      </div>
    );
  }
  
  // Get current user and verify role
  const user = await currentUser();
  
  console.log("Seller Dashboard Layout - User:", user ? user.id : "Not authenticated");
  console.log("Seller Dashboard Layout - User Role:", user?.privateMetadata?.role || "No role");
  
  // This may allow all users to access seller dashboard if role check is failing
  // Block non sellers from accessing the seller dashboard
  // if (user?.privateMetadata.role !== "SELLER") redirect("/");
  
  // Fetch the user's stores for the sidebar
  const stores = await db.store.findMany({
    where: {
      userId: user?.id
    },
    select: {
      id: true,
      name: true,
      url: true,
      logo: true,
      status: true
    }
  });
  
  console.log("Seller Dashboard Layout - Stores found:", stores.length);
  console.log("Seller Dashboard Layout - Store details:", JSON.stringify(stores.map(s => ({name: s.name, url: s.url}))));
  
  return (
    <div className="w-full h-full">
      {/* Sidebar with stores data for the store switcher */}
      <Sidebar stores={stores} />
      <div className="ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">
          {!user && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-red-700 font-medium">Authentication Error</p>
              <p className="text-red-600 text-sm">You are not properly authenticated. Please sign in again.</p>
            </div>
          )}
          {user && stores.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <p className="text-yellow-700 font-medium">Store Setup Required</p>
              <p className="text-yellow-600 text-sm">You need to create a store before you can use all seller dashboard features.</p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
