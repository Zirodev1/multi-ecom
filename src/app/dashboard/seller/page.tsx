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

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    }
  })

  // if no stores by user, redirect to store creating page
  if(stores.length === 0){
    redirect("/dashboard/seller/stores/new");
    return;
  }

  // if has store, redirect to most recent active store
  redirect(`/dashboard/seller/stores/${stores[0].url}`)

  return (
    <div>Seller Dashboard</div>
  )
}
