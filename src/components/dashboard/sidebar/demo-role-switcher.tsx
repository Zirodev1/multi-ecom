"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DemoRoleSwitcher({ currentRole }: { currentRole: "ADMIN" | "SELLER" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const switchRole = async () => {
    try {
      setIsLoading(true);
      const newRole = currentRole === "ADMIN" ? "SELLER" : "ADMIN";
      
      const formData = new FormData();
      formData.append("role", newRole);
      
      await fetch("/api/demo/login", {
        method: "POST",
        body: formData,
      });
      
      // Redirect to the appropriate dashboard
      if (newRole === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/seller");
      }
    } catch (error) {
      console.error("Error switching role:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 mt-4 bg-orange-50 rounded-md border border-orange-200">
      <div className="text-sm text-orange-700 mb-2">
        <p className="font-semibold">Demo Account</p>
        <p>Current role: {currentRole}</p>
      </div>
      
      <Button 
        onClick={switchRole}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Switching...
          </>
        ) : (
          `Switch to ${currentRole === "ADMIN" ? "Seller" : "Admin"} Dashboard`
        )}
      </Button>
    </div>
  );
} 