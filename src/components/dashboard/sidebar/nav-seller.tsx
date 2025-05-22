"use client";

// React, Next.js
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

export default function SidebarNavSeller({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if we're already on a specific store page
  const isOnSpecificStore = pathname.match(/\/dashboard\/seller\/stores\/([^\/]+)$/);
  
  // Extract storeUrl directly from pathname
  const storeUrlMatch = pathname.match(/\/dashboard\/seller\/stores\/([^\/]+)/);
  const activeStore = storeUrlMatch ? storeUrlMatch[1] : "";
  
  console.log("Current pathname:", pathname);
  console.log("Extracted store URL:", activeStore);
  console.log("Is on specific store page:", !!isOnSpecificStore);
  
  // Function to handle navigation
  const handleNavigation = (e: React.MouseEvent, linkPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If we're on the stores listing page and no store is selected yet
    if (pathname === "/dashboard/seller/stores" && !activeStore) {
      console.log("On stores listing page - cannot navigate to a specific tab without selecting a store first");
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
      
      console.log("Navigating to:", targetPath);
      router.push(targetPath);
    } else {
      console.log("No active store found, cannot navigate");
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
              
              // Check if this link is active
              const isActive = activeStore && (
                link.link === ""
                  ? pathname === `/dashboard/seller/stores/${activeStore}`
                  : pathname.startsWith(`/dashboard/seller/stores/${activeStore}/${link.link}`)
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
