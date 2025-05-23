// React,Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Custom UI Components
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Header from "@/components/dashboard/header/header";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_STORE_URL, DEMO_STORE_ID } from "@/lib/demo-mode";

// Define a type for the simplified store objects
type SimplifiedStore = {
  id: string;
  name: string;
  url: string;
  logo: string;
  status: "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";
};

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // First, check if user is authenticated
  const user = await currentUser();
  
  // If we have a real authenticated user, proceed with normal flow
  if (user) {
    
    try {
      // Retrieve the list of stores associated with the authenticated user.
      const stores = await db.store.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          name: true,
          url: true,
          logo: true,
          status: true
        }
      });

      // Create simplified store objects with only the necessary properties
      const simplifiedStores: SimplifiedStore[] = stores.map(store => ({
        id: store.id,
        name: store.name,
        url: store.url,
        logo: store.logo,
        status: store.status
      }));

      return (
        <div className="h-full w-full flex">
          <Sidebar stores={simplifiedStores} />
          <div className="w-full pr-4 md:pr-6 lg:pr-8">
            <Header />
            <div className="w-full mx-auto mt-[75px] px-2 sm:px-4 md:px-6 py-4">
              {children}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error fetching stores:", error);
      
      // Return a basic layout without stores if there's an error
      return (
        <div className="h-full w-full flex">
          <Sidebar />
          <div className="w-full pr-4 md:pr-6 lg:pr-8">
            <Header />
            <div className="w-full mx-auto mt-[75px] px-2 sm:px-4 md:px-6 py-4">
              {children}
            </div>
          </div>
        </div>
      );
    }
  }
  
  // Only proceed with demo mode if no real user is authenticated
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // If demo user with seller role, allow access without real authentication
  if (isDemoMode && demoRole === "SELLER") {
    
    // Create a simplified store object for the sidebar
    const demoStores: SimplifiedStore[] = [{
      id: DEMO_STORE_ID,
      name: "Demo Store",
      url: DEMO_STORE_URL,
      logo: "/assets/images/demo-store-logo.png",
      status: "ACTIVE"
    }];
    
    return (
      <div className="h-full w-full flex">
        <Sidebar isDemo demoRole="SELLER" stores={demoStores} />
        <div className="w-full pr-4 md:pr-6 lg:pr-8">
          <Header isDemo />
          <div className="w-full mx-auto mt-[75px] px-2 sm:px-4 md:px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    );
  }
  
  // If we reach here, there's no auth - redirect to home
  redirect("/");
  return null;
}
