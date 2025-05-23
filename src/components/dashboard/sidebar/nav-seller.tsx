"use client";

// React, Next.js
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// UI Components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Icons
import { icons } from "@/constants/icons";

// types
import { DashboardSidebarMenuInterface } from "@/lib/types";

// Utils
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { DEMO_STORE_URL, getClientDemoMode } from "@/lib/demo-mode-client";

export default function SidebarNavSeller({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  
  // Check for demo mode
  useEffect(() => {
    setIsDemoMode(getClientDemoMode());
  }, []);
  
  // Check if we're already on a specific store page
  const isOnSpecificStore = pathname.match(/\/dashboard\/seller\/stores\/([^\/]+)$/);
  
  // Extract storeUrl directly from pathname
  const storeUrlMatch = pathname.match(/\/dashboard\/seller\/stores\/([^\/]+)/);
  const activeStore = storeUrlMatch ? storeUrlMatch[1] : "";
  
  console.log("Current pathname:", pathname);
  console.log("Extracted store URL:", activeStore);
  console.log("Is on specific store page:", !!isOnSpecificStore);
  console.log("Is demo mode:", isDemoMode);
  
  // Function to handle navigation
  const handleNavigation = (e: React.MouseEvent, linkPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Special case for demo mode
    if (isDemoMode) {
      // In demo mode, always navigate to the demo store pages
      const targetPath = linkPath === "" 
        ? `/dashboard/seller/stores/${DEMO_STORE_URL}`
        : `/dashboard/seller/stores/${DEMO_STORE_URL}/${linkPath}`;
      
      console.log("Demo mode - navigating to:", targetPath);
      router.push(targetPath);
      return;
    }
    
    // If we're on the stores listing page and no store is selected yet
    if (pathname === "/dashboard/seller/stores" && !activeStore) {
      toast({
        variant: "destructive",
        title: "No store selected",
        description: "Please select a store first before accessing this section"
      });
      return;
    }
    
    // If we have an active store, navigate to the appropriate tab
    if (activeStore) {
      const targetPath = linkPath === "" 
        ? `/dashboard/seller/stores/${activeStore}`
        : `/dashboard/seller/stores/${activeStore}/${linkPath}`;
      
      router.push(targetPath);
    } else {
      toast({
        variant: "destructive",
        title: "Navigation error",
        description: "Please select a store first before accessing this section"
      });
    }
  };

  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links Found.</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) icon = <iconSearch.path />;
              
              // Check if this link is active - handling both demo and regular modes
              const targetStoreUrl = isDemoMode ? DEMO_STORE_URL : activeStore;
              const isActive = targetStoreUrl && (
                link.link === ""
                  ? pathname === `/dashboard/seller/stores/${targetStoreUrl}`
                  : pathname.startsWith(`/dashboard/seller/stores/${targetStoreUrl}/${link.link}`)
              );
                
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground": isActive,
                  })}
                >
                  <a
                    href="#"
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                    onClick={(e) => handleNavigation(e, link.link)}
                  >
                    {icon}
                    <span>{link.label}</span>
                  </a>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
