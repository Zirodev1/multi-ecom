"use client";

import React, { useState, useEffect } from "react";

/**
 * HydrationBoundary
 * 
 * Prevents hydration mismatches by not rendering any content until
 * after hydration is complete. This prevents flickering, jumps, and errors.
 */
export default function HydrationBoundary({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  // Track if we're hydrated
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Set hydrated state after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Show fallback until hydrated, then show children
  if (!isHydrated) {
    return fallback ? (
      <div className="min-h-screen flex items-center justify-center">
        {fallback}
      </div>
    ) : null;
  }

  // After hydration, render the children
  return <>{children}</>;
} 