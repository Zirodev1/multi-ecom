// React, Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Custom UI Components
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Header from "@/components/dashboard/header/header";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // First check for real user authentication
  const user = await currentUser();
  
  // If user is authenticated and has ADMIN role, show admin dashboard
  if (user && user.privateMetadata.role === "ADMIN") {
    console.log("Real admin user authenticated:", user.id);
    
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar isAdmin />
        <div className="w-full pl-[300px]">
          {/* Header */}
          <Header />
          <main className="container mx-auto px-4 pt-[75px] pb-10">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // Only proceed with demo mode if no real admin user is authenticated
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // If demo user with admin role, allow access
  if (isDemoMode && demoRole === "ADMIN") {
    console.log("Using demo mode for admin dashboard - no real admin authenticated");
    
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar isAdmin isDemo demoRole="ADMIN" />
        <div className="w-full pl-[300px]">
          {/* Header */}
          <Header isDemo />
          <main className="w-full mx-auto mt-[75px] sm:px-4 md:px-6 py-4">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // If we reach here, user is not authenticated as admin - redirect to home
  redirect("/");
  return null;
}
