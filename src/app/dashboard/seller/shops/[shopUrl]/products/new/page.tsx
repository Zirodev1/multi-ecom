import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category"

export default async function SellerNewProductPage({params,} : {params: {shopUrl: string}}) {
  const categories = await getAllCategories();
  const shopUrl = await Promise.resolve(params.shopUrl);

  return (
    <div className="w-full"><ProductDetails categories={categories} shopUrl={shopUrl} /></div>
  )
}
