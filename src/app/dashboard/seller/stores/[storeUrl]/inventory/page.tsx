// Queries
import { getAllStoreProducts } from "@/queries/product";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL } from "@/lib/demo-mode";
import InventoryTable from "./components/inventory-table";

// TypeScript Types
type PageParams = {
  storeUrl: string;
};

export default async function InventoryPage({
  params,
}: {
  params: PageParams;
}) {
  // Get the storeUrl from params - ensure it's a string
  const { storeUrl = '' } = await params;
  const storeUrlStr = String(storeUrl);
  
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  
  // For demo mode, return demo inventory data
  if (isDemoMode && storeUrlStr === DEMO_STORE_URL) {
    // Create demo inventory data
    const demoInventory = [
      {
        id: "inv-1",
        productName: "Demo Product 1",
        variant: "Red",
        size: "Medium",
        inStock: 25,
        lowStock: false,
        productId: "demo-product-1",
        variantId: "demo-variant-1",
        sizeId: "demo-size-1",
        isDemo: true
      },
      {
        id: "inv-2",
        productName: "Demo Product 1",
        variant: "Blue",
        size: "Large",
        inStock: 8,
        lowStock: true,
        productId: "demo-product-1",
        variantId: "demo-variant-2",
        sizeId: "demo-size-2",
        isDemo: true
      },
      {
        id: "inv-3",
        productName: "Demo Product 2",
        variant: "Green",
        size: "Small",
        inStock: 0,
        lowStock: true,
        productId: "demo-product-2",
        variantId: "demo-variant-3",
        sizeId: "demo-size-3",
        isDemo: true
      },
      {
        id: "inv-4",
        productName: "Demo Product 3",
        variant: "Black",
        size: "Medium",
        inStock: 15,
        lowStock: false,
        productId: "demo-product-3",
        variantId: "demo-variant-4",
        sizeId: "demo-size-4",
        isDemo: true
      },
      {
        id: "inv-5",
        productName: "Demo Product 3",
        variant: "White",
        size: "Large",
        inStock: 3,
        lowStock: true,
        productId: "demo-product-3",
        variantId: "demo-variant-5",
        sizeId: "demo-size-5",
        isDemo: true
      },
    ];
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo inventory page. In a real store, you would see your actual inventory here.
          </p>
        </div>
        
        <InventoryTable data={demoInventory} />
      </div>
    );
  }
  
  // For real users, we would get actual inventory data
  // This would need to be implemented based on your real data structure
  // For now, returning a placeholder
  const products = await getAllStoreProducts(storeUrlStr);
  
  // Convert products to inventory format
  // This transformation will need to be adjusted based on your actual data structure
  const inventory = [];
  
  products.forEach(product => {
    product.variants.forEach(variant => {
      variant.sizes.forEach(size => {
        inventory.push({
          id: `${product.id}-${variant.id}-${size.id}`,
          productName: product.name,
          variant: variant.variantName,
          size: size.size,
          inStock: size.quantity,
          lowStock: size.quantity < 10,
          productId: product.id,
          variantId: variant.id,
          sizeId: size.id,
          isDemo: false
        });
      });
    });
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>
      
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Bulk Update
          </>
        }
        filterValue="productName"
        data={inventory}
        columns={columns}
        searchPlaceholder="Search products..."
      />
    </div>
  );
} 