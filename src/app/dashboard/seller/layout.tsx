import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

export default async function SellerDashboardLayout({children}:{children: ReactNode}) {
  // Block non-sellers
  const user = await currentUser();

  // redirect if not a seller
  if(user?.privateMetadata.role !== "SELLER") redirect("/")
  return (
    <div>{children}</div>
  )
}
