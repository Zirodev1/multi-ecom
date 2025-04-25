import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function SellerDashboardPage() {
  //Fetch current user
  const user = await currentUser();
  if(!user) {
    redirect("/");
    return;
  }

  const shops = await db.shop.findMany({
    where: {
      userId: user.id,
    }
  })

  // if no shops by user, redirect to store creating page
  if(shops.length === 0){
    redirect("/dashboard/seller/shops/new");
    return;
  }

  // if has store, redirect to most recent active store
  redirect(`/dashboard/seller/shops/${shops[0].url}`)

  return (
    <div>Seller Dashboard</div>
  )
}
