import Header from '@/components/dashboard/header/header';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Block access to this page if the user is not an admin
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");
  return (
    <div className='w-full h-full'>
      {/* Sidebar */}
      <Sidebar />
      <div className="w-full ml-[300px]">
        {/* Header */}
        <Header />
        <div className='w-full mt-[75px] p-4'>{children}</div>
      </div>
    </div>
  )
}
