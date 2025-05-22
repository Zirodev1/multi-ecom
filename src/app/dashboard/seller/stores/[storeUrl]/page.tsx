import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL, createDemoStore, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple card component for dashboard stats
function StoreCard({
  title,
  value,
  description,
  icon
}: {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-gray-500 mt-1 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface ParamsType {
  storeUrl: string;
}

export default async function SellerStorePage({ params }: { params: ParamsType }) {
  // We need to await the params object to avoid the Next.js error
  const { storeUrl } = await Promise.resolve(params);
  
  // Check for authenticated user first
  const user = await currentUser();
  
  // AUTHENTICATED USER FLOW
  if (user) {
    // Fetch the store belonging to this user
    const store = await db.store.findFirst({
      where: {
        url: storeUrl,
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        url: true,
        logo: true,
        status: true,
        userId: true
      }
    });
    
    // If no store found, redirect to seller dashboard
    if (!store) {
      return redirect("/dashboard/seller");
    }
    
    // Return the real user dashboard
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{store.name} Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StoreCard 
            title="Store Information"
            value={store.name}
            description="Manage your store details"
            icon={<Store className="h-8 w-8 text-blue-500" />}
          />
          <StoreCard 
            title="Products"
            value="0"
            description="Add products to your store"
            icon={<Package className="h-8 w-8 text-green-500" />}
          />
          <StoreCard 
            title="Orders"
            value="0"
            description="View and manage orders"
            icon={<ShoppingBag className="h-8 w-8 text-purple-500" />}
          />
        </div>
      </div>
    );
  }
  
  // DEMO MODE FLOW - only runs if no authenticated user
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoSessionId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  
  if (isDemoMode && demoSessionId && storeUrl === DEMO_STORE_URL) {
    const demoStore = createDemoStore(demoSessionId);
    
    // Demo data
    const demoProductCount = 12;
    const demoOrderCount = 8;
    const demoRevenue = "₹45,320";
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Demo Store Dashboard</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            This is a demo store. Any changes you make will not be permanent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StoreCard 
            title="Store Information"
            value={demoStore.name}
            description="Active since Jan 2023"
            icon={<Store className="h-8 w-8 text-blue-500" />}
          />
          <StoreCard 
            title="Products"
            value={demoProductCount.toString()}
            description="12 active listings"
            icon={<Package className="h-8 w-8 text-green-500" />}
          />
          <StoreCard 
            title="Orders"
            value={demoOrderCount.toString()}
            description="2 pending shipment"
            icon={<ShoppingBag className="h-8 w-8 text-purple-500" />}
          />
          <StoreCard 
            title="Revenue (30 days)"
            value={demoRevenue}
            description="↑ 12% from last month"
            icon={<div className="h-8 w-8 flex items-center justify-center text-2xl text-emerald-500">₹</div>}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Button variant="ghost" size="sm" className="text-sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { id: "ORD-1234", date: "2023-09-15", status: "Delivered", amount: "₹2,499" },
                { id: "ORD-1235", date: "2023-09-14", status: "Shipped", amount: "₹1,850" },
                { id: "ORD-1236", date: "2023-09-13", status: "Processing", amount: "₹3,200" }
              ].map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Products</h3>
              <Button variant="ghost" size="sm" className="text-sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Premium Leather Wallet", sold: 24, revenue: "₹12,000" },
                { name: "Vintage Watch Collection", sold: 18, revenue: "₹9,000" },
                { name: "Handcrafted Wooden Bowl", sold: 15, revenue: "₹4,500" }
              ].map((product, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} units sold</p>
                  </div>
                  <p className="font-medium">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add New Product
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              View Orders
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Edit Store Details
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Not authenticated and not in demo mode - redirect to home
  return redirect("/");
}
