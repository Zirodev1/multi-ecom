// Queries
import { getAllStoreProducts } from "@/queries/product";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL } from "@/lib/demo-mode";

interface ParamsType {
  storeUrl: string;
}

export default async function SellerProductsPage({ params }: { params: ParamsType }) {
  // We need to await the params object to avoid the Next.js error
  const { storeUrl } = await Promise.resolve(params);
  
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  
  // Get categories and offer tags (needed for both real and demo mode)
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const countries = await db.country.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // For demo mode, return mock product data
  if (isDemoMode && storeUrl === DEMO_STORE_URL) {
    // Create demo products that match the StoreProductType structure
    const demoProducts = [
      {
        id: "product-1",
        name: "Demo Product 1",
        slug: "demo-product-1",
        description: "This is a demo product for testing",
        rating: 4.5,
        sales: 120,
        numReviews: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: "Demo Brand",
        store: {
          id: "demo-store-id",
          name: "Demo Store",
          url: "demo-store"
        },
        category: {
          id: "category-1",
          name: "Clothing",
          slug: "clothing"
        },
        subCategory: {
          id: "subcategory-1",
          name: "T-Shirts",
          slug: "t-shirts"
        },
        offerTag: {
          id: "offer-1",
          name: "Sale"
        },
        variants: [
          {
            id: "variant-1",
            variantName: "Demo Variant Red",
            variantImage: "/assets/images/demo-product.png",
            slug: "demo-variant-red",
            productId: "product-1",
            colors: [{ name: "Red" }],
            sizes: [
              {
                id: "size-1",
                size: "M",
                price: 49.99,
                discount: 0,
                quantity: 100,
                productVariantId: "variant-1"
              }
            ],
            images: [
              {
                id: "image-1",
                url: "/assets/images/demo-product.png"
              }
            ]
          }
        ]
      },
      {
        id: "product-2",
        name: "Demo Product 2",
        slug: "demo-product-2",
        description: "Another demo product",
        rating: 4.8,
        sales: 85,
        numReviews: 16,
        brand: "Premium Brand",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // 5 days ago
        store: {
          id: "demo-store-id",
          name: "Demo Store",
          url: "demo-store"
        },
        category: {
          id: "category-2",
          name: "Electronics",
          slug: "electronics"
        },
        subCategory: {
          id: "subcategory-2",
          name: "Smartphones",
          slug: "smartphones"
        },
        offerTag: null,
        variants: [
          {
            id: "variant-2",
            variantName: "Demo Variant Blue",
            variantImage: "/assets/images/demo-product.png",
            slug: "demo-variant-blue",
            productId: "product-2",
            colors: [{ name: "Blue" }],
            sizes: [
              {
                id: "size-2",
                size: "L",
                price: 59.99,
                discount: 10,
                quantity: 50,
                productVariantId: "variant-2"
              }
            ],
            images: [
              {
                id: "image-2",
                url: "/assets/images/demo-product.png"
              }
            ]
          }
        ]
      }
    ];
    
    return (
      <div>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
          <p className="text-yellow-700">
            This is a demo products page. In a real store, you would see your actual products here.
          </p>
        </div>
        
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create product
            </>
          }
          modalChildren={
            <ProductDetails
              categories={categories}
              offerTags={offerTags}
              storeUrl={storeUrl}
              countries={countries}
            />
          }
          newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
          filterValue="name"
          data={demoProducts}
          columns={columns}
          searchPlaceholder="Search product name..."
        />
      </div>
    );
  }
  
  // Special case for "new" store URL - show empty product list
  if (storeUrl === "new") {
    return (
      <div>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
          <p className="text-blue-700">
            You need to create a store before adding products.
          </p>
        </div>
        
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create product
            </>
          }
          modalChildren={
            <ProductDetails
              categories={categories}
              offerTags={offerTags}
              storeUrl={storeUrl}
              countries={countries}
            />
          }
          newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
          filterValue="name"
          data={[]}
          columns={columns}
          searchPlaceholder="Search product name..."
        />
      </div>
    );
  }
  
  try {
    // Fetching products data from the database for real stores
    const products = await getAllStoreProducts(storeUrl);
    
    return (
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create product
          </>
        }
        modalChildren={
          <ProductDetails
            categories={categories}
            offerTags={offerTags}
            storeUrl={storeUrl}
            countries={countries}
          />
        }
        newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
        filterValue="name"
        data={products}
        columns={columns}
        searchPlaceholder="Search product name..."
      />
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div>
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
          <p className="text-red-700">
            {error instanceof Error ? error.message : "Error loading products. Please try again later."}
          </p>
        </div>
        
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create product
            </>
          }
          modalChildren={
            <ProductDetails
              categories={categories}
              offerTags={offerTags}
              storeUrl={storeUrl}
              countries={countries}
            />
          }
          newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
          filterValue="name"
          data={[]}
          columns={columns}
          searchPlaceholder="Search product name..."
        />
      </div>
    );
  }
}
