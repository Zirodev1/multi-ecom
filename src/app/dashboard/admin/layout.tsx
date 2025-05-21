// React, Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Header
import Header from "@/components/dashboard/header/header";

// Sidebar
import Sidebar from "@/components/dashboard/sidebar/sidebar";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check for demo user first
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // If demo user with admin role, allow access
  if (isDemoMode && demoRole === "ADMIN") {
    return (
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isAdmin isDemo demoRole="ADMIN" />
        <div className="pl-[300px]">
          {/* Header */}
          <Header isDemo />
          <main className="container mx-auto px-4 pt-[75px] pb-10">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // Block non admins from accessing the admin dashboard
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");
  
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isAdmin />
      <div className="pl-[300px]">
        {/* Header */}
        <Header />
        <main className="container mx-auto px-4 pt-[75px] pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
