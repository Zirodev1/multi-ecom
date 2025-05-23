"use client";

import React, { useEffect, useState } from "react";

/**
 * A client component that helps stabilize layout rendering and prevent
 * flickering or repeated re-renders.
 * 
 * This works by:
 * 1. Starting with a minimal opacity
 * 2. Waiting a short time for all components to mount and hydrate
 * 3. Then fading in the fully stable layout
 */
export default function LayoutStabilizer({ 
  children,
  delay = 100
}: { 
  children: React.ReactNode;
  delay?: number;
}) {
  const [isStable, setIsStable] = useState(false);
  
  useEffect(() => {
    // Small delay to allow client components to fully hydrate
    const timer = setTimeout(() => {
      setIsStable(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div
      className={`transition-opacity duration-300 ${
        isStable ? "opacity-100" : "opacity-90"
      }`}
    >
      {children}
    </div>
  );
} 