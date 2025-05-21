// React,Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Custom UI Components
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if user is in demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // If demo user with seller role, allow access without real authentication
  if (isDemoMode && demoRole === "SELLER") {
    return (
      <div className="h-full w-full flex">
        <Sidebar isDemo demoRole="SELLER" />
        <div className="w-full pr-4 md:pr-6 lg:pr-8">
          <Header isDemo />
          <div className="w-full  mx-auto mt-[75px] sm:px-4 md:px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores} />
      <div className="w-full pl-[280px] pr-4 md:pr-6 lg:pr-8">
        <Header />
        <div className="w-full max-w-5xl mx-auto mt-[75px] px-2 sm:px-4 md:px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
