import Header from '@/components/dashboard/header/header'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function SellerShopDashboardLayout({children}:{children: ReactNode}) {
  const user = await currentUser();
  if(!user){
    redirect("/");
    return;
  } 

  const shops = await db.shop.findMany({
    where: {
      userId: user.id,
    }
  })

  return (
    <div className='h-full w-full flex'>
      <Sidebar shops={shops}/>
      <div className='w-full ml-[300px]'>
        <Header />
        <div className='w-full mt-[75px] p-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
