import ShopDetails from "@/components/dashboard/forms/store-details"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function SellerShopSettingsPage({params,} : {params: { shopUrl: string }} ) {
  const shopDetails = await db.shop.findUnique({
    where: {
      url: params.shopUrl,
    },
  })

  if(!shopDetails) redirect("/dashboard/seller/shops");

  return (
    <div>
      <ShopDetails data={shopDetails}/>
    </div>
  )
}
