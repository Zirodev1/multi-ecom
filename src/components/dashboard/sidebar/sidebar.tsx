// React, Next.js
import { FC } from "react";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Custom Ui Components
import Logo from "@/components/shared/logo";
import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";
import SidebarNavSeller from "./nav-seller";
import DemoRoleSwitcher from "./demo-role-switcher";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Menu links
import {
  SellerDashboardSidebarOptions,
  adminDashboardSidebarOptions,
} from "@/constants/data";

// Prisma models
import { Store } from "@prisma/client";
import StoreSwitcher from "./store-switcher";

// Define a simplified store type
type SimplifiedStore = {
  id: string;
  name: string;
  url: string;
  logo: string;
  status: "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";
};

interface SidebarProps {
  isAdmin?: boolean;
  isDemo?: boolean;
  demoRole?: "ADMIN" | "SELLER";
  stores?: SimplifiedStore[] | Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, isDemo, demoRole, stores }) => {
  const user = await currentUser();
  
  // Debug: Log received stores
  console.log("Sidebar received stores:", stores ? JSON.stringify(stores) : "No stores");
  
  return (
    <div className="w-[300px] border-r h-screen fixed top-0 left-0 z-20 bg-background flex flex-col">
      <div className="flex-none mx-auto p-2">
        <Logo width="90%" height="140px" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <span className="block" />
        
        {/* If demo user, show demo info, otherwise show real user info */}
        {isDemo ? (
          <div className="flex flex-col gap-y-2">
            <div className="text-lg font-bold text-center">
              Demo Account
            </div>
            {demoRole && <DemoRoleSwitcher currentRole={demoRole} />}
          </div>
        ) : (
          user && <UserInfo user={user} />
        )}
        
        {!isAdmin && stores && stores.length > 0 ? (
          <>
            <div className="my-2 text-sm text-gray-500">Stores ({stores.length})</div>
            <StoreSwitcher stores={stores} />
          </>
        ) : !isAdmin ? (
          <div className="my-2 p-3 bg-gray-100 rounded-md text-sm">
            No stores found. Create one to get started.
          </div>
        ) : null}
        
        {isAdmin ? (
          <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
        ) : (
          <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
        )}
      </div>
      
      {isDemo && (
        <div className="flex-none px-4 pb-4">
          <div className="p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm text-red-600 font-medium">Demo Mode</p>
            <p className="text-xs text-red-500">Changes will not be permanent and will reset after your session ends.</p>
          </div>
          
          <form action="/api/demo/logout" method="POST" className="mt-3">
            <Button type="submit" variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Exit Demo Mode
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
