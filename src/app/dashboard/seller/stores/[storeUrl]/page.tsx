import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL, createDemoStore, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";
import { redirect } from "next/navigation";

type PageParams = {
  storeUrl: string;
};

export default async function SellerStorePage({
  params
}: {
  params: PageParams;
}) {
  // Get the storeUrl from params - ensure it's a string
  const { storeUrl = '' } = await params;
  const storeUrlStr = String(storeUrl);
  
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoSessionId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  
  // For demo mode with the demo store URL
  if (isDemoMode && storeUrlStr === DEMO_STORE_URL && demoSessionId) {
    // Create a demo store object (this is just a mock, not saved to DB)
    const demoStore = createDemoStore(demoSessionId);
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Demo Store Dashboard</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            This is a demo store. Any changes you make will not be permanent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StoreCard 
            title="Store Information"
            value={demoStore.name}
            description="Demo store for testing"
          />
          <StoreCard 
            title="Products"
            value="0"
            description="Add products to your store"
          />
          <StoreCard 
            title="Orders"
            value="0"
            description="View and manage orders"
          />
        </div>
      </div>
    );
  }
  
  // For real users, fetch the actual store
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  
  const store = await db.store.findFirst({
    where: {
      url: storeUrlStr,
      userId: user.id
    }
  });
  
  if (!store) {
    return redirect("/dashboard/seller");
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{store.name} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StoreCard 
          title="Store Information"
          value={store.name}
          description="Manage your store details"
        />
        <StoreCard 
          title="Products"
          value="0"
          description="Add products to your store"
        />
        <StoreCard 
          title="Orders"
          value="0"
          description="View and manage orders"
        />
      </div>
    </div>
  );
}

// Simple card component for dashboard stats
function StoreCard({
  title,
  value,
  description
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
}
