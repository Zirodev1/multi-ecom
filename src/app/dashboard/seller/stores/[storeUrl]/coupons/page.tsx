// Queries
import { getStoreCoupons } from "@/queries/coupon";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import CouponsTable from "./components/coupons-table";

export default async function SellerCouponsPage({
  params,
}: {
  params: PageParams;
}) {
  // We need to await the params object to avoid the Next.js error
  const { storeUrl } = await Promise.resolve(params);
  
  // Get the storeUrl from params directly (without using await)
  const storeUrlStr = storeUrl;
  
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  
  // For demo mode, return demo data
  if (isDemoMode && storeUrlStr === DEMO_STORE_URL) {
    // Create demo coupons
    const demoCoupons = [
      {
        id: "coupon-1",
        code: "WELCOME20",
        discount: 20,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        active: true,
        storeId: "demo-store-id",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "coupon-2",
        code: "SUMMER25",
        discount: 25,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        active: true,
        storeId: "demo-store-id",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "coupon-3",
        code: "FLASH50",
        discount: 50,
        startDate: new Date(), // Today
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        active: true,
        storeId: "demo-store-id",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "coupon-4",
        code: "EXPIRED10",
        discount: 10,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (expired)
        active: false,
        storeId: "demo-store-id",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coupons Management</h1>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo coupons page. In a real store, you would see your actual coupons here.
          </p>
        </div>
        
        <CouponsTable data={demoCoupons} storeUrl={storeUrlStr} />
      </div>
    );
  }
  
  // Special case for "new" store URL - show empty coupons
  if (storeUrlStr === "new") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coupons Management</h1>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <p className="text-blue-700">
            You need to create a store first to manage coupons.
          </p>
        </div>
        
        <CouponsTable data={[]} storeUrl={storeUrlStr} />
      </div>
    );
  }
  
  // For real stores, get the actual coupons data
  try {
    // Get all store coupons
    const coupons = await getStoreCoupons(storeUrlStr);
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coupons Management</h1>
        </div>
        
        <CouponsTable data={coupons} storeUrl={storeUrlStr} />
      </div>
    );
  } catch (error) {
    // If there's an error fetching data, redirect to the seller dashboard
    return redirect("/dashboard/seller");
  }
}
