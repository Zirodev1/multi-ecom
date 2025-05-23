"use client";

import React from "react";
import Header from "./header/header";
import DashboardLoading from "./dashboard-loading";
import HydrationBoundary from "./hydration-boundary";

type FixedDashboardLayoutProps = {
  children: React.ReactNode;
  isDemo?: boolean;
};

/**
 * A client-side component to ensure consistent layout rendering
 * across both demo and regular dashboard modes
 */
export default function FixedDashboardLayout({ 
  children, 
  isDemo = false 
}: FixedDashboardLayoutProps) {
  return (
    <HydrationBoundary fallback={<DashboardLoading />}>
      <div className="w-full pl-[280px] pr-4 md:pr-6 lg:pr-8">
        <Header isDemo={isDemo} />
        <div className="w-full max-w-5xl mx-auto mt-[75px] px-2 sm:px-4 md:px-6 py-4">
          {children}
        </div>
      </div>
    </HydrationBoundary>
  );
} 