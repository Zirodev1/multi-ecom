// DB
import StoreDetails from "@/components/dashboard/forms/store-details";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL, createDemoStore, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";

type PageParams = {
  storeUrl: string;
};

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: PageParams;
}) {
  // Get the storeUrl from params
  const storeUrl = params?.storeUrl;
  
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoSessionId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  
  // For demo mode with the demo store URL
  if (isDemoMode && storeUrl === DEMO_STORE_URL && demoSessionId) {
    // Create a demo store object
    const demoStore = createDemoStore(demoSessionId);
    
    return (
      <div>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
          <p className="text-yellow-700">
            This is a demo store settings page. Changes you make here won't be saved permanently.
          </p>
        </div>
        <StoreDetails data={demoStore} />
      </div>
    );
  }
  
  // For real stores, get the store details
  const storeDetails = await db.store.findUnique({
    where: {
      url: storeUrl,
    },
  });
  
  if (!storeDetails) redirect("/dashboard/seller/stores");
  
  return (
    <div>
      <StoreDetails data={storeDetails} />
    </div>
  );
}
