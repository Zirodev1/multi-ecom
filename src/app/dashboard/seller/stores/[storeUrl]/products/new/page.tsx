import ProductDetails from "@/components/dashboard/forms/product-details";
import { db } from "@/lib/db";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{ storeUrl: string }>;
}

export default async function SellerNewProductPage({ params }: PageProps) {
  // Properly await params in Next.js 15
  const { storeUrl } = await params;
  
  // Check authentication
  let userId;
  try {
    const user = await currentUser();
    userId = user?.id;
    
    if (!userId) {
      console.error("User not authenticated in page component");
      return (
        <div className="p-6 rounded-md bg-red-50 text-red-800 max-w-3xl mx-auto my-10">
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p>Your session may have expired or there was an error with authentication. Please try signing out and signing back in.</p>
        </div>
      );
    }
    
    const storeExists = await db.store.findUnique({
      where: { url: storeUrl, userId },
      select: { id: true }
    });
    
    if (!storeExists) {
      console.error(`Store with URL ${storeUrl} not found for user ${userId}`);
      notFound();
    }
    
    const categories = await getAllCategories();
    const offerTags = await getAllOfferTags();
    const countries = await db.country.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return (
      <div className="w-full">
        <ProductDetails
          categories={categories}
          storeUrl={storeUrl}
          offerTags={offerTags}
          countries={countries}
        />
      </div>
    );
  } catch (authError) {
    console.error("Authentication error:", authError);
    return (
      <div className="p-6 rounded-md bg-red-50 text-red-800 max-w-3xl mx-auto my-10">
        <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
        <p>There was an error with authentication. Please try signing out and signing back in.</p>
      </div>
    );
  }
}
