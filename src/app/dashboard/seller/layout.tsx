import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Demo Mode
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";

// Components
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Header from "@/components/dashboard/header/header";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check for demo user first
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // If demo user with seller role, allow access
  if (isDemoMode && demoRole === "SELLER") {
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
  
  // Block non sellers from accessing the seller dashboard
  const user = await currentUser();
  if (user?.privateMetadata.role !== "SELLER") redirect("/");
  
  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar />
      <div className="ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
