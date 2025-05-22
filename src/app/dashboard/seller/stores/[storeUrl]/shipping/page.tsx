import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import ShippingTable from "./components/shipping-table";
import { getStoreDefaultShippingDetails, getStoreShippingRates } from "@/queries/store";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL } from "@/lib/demo-mode";

export default async function SellerStoreShippingPage({
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
    // Create demo shipping details
    const demoShippingDetails = {
      defaultShippingService: "Standard International Shipping",
      defaultShippingFeePerItem: 5.99,
      defaultShippingFeeForAdditionalItem: 2.99,
      defaultShippingFeePerKg: 3.50,
      defaultShippingFeeFixed: 9.99,
      defaultDeliveryTimeMin: 3,
      defaultDeliveryTimeMax: 14,
      returnPolicy: "Items can be returned within 30 days of delivery. Return shipping costs are the responsibility of the buyer unless the item is defective.",
    };
    
    // Create demo shipping rates for countries
    const demoShippingRates = [
      {
        countryId: "us",
        countryName: "United States",
        shippingRate: {
          id: "rate-1",
          shippingService: "USPS Express",
          shippingFeePerItem: 4.99,
          shippingFeeForAdditionalItem: 1.99,
          shippingFeePerKg: 2.50,
          shippingFeeFixed: 8.99,
          deliveryTimeMin: 2,
          deliveryTimeMax: 7,
          returnPolicy: "30-day returns",
          storeId: "demo-store-id",
          countryId: "us",
        }
      },
      {
        countryId: "ca",
        countryName: "Canada",
        shippingRate: {
          id: "rate-2",
          shippingService: "Canada Post",
          shippingFeePerItem: 6.99,
          shippingFeeForAdditionalItem: 2.99,
          shippingFeePerKg: 3.75,
          shippingFeeFixed: 10.99,
          deliveryTimeMin: 3,
          deliveryTimeMax: 10,
          returnPolicy: "30-day returns",
          storeId: "demo-store-id",
          countryId: "ca",
        }
      },
      {
        countryId: "uk",
        countryName: "United Kingdom",
        shippingRate: {
          id: "rate-3",
          shippingService: "Royal Mail",
          shippingFeePerItem: 7.99,
          shippingFeeForAdditionalItem: 3.50,
          shippingFeePerKg: 4.25,
          shippingFeeFixed: 12.99,
          deliveryTimeMin: 4,
          deliveryTimeMax: 14,
          returnPolicy: "30-day returns",
          storeId: "demo-store-id",
          countryId: "uk",
        }
      },
      {
        countryId: "au",
        countryName: "Australia",
        shippingRate: null
      },
      {
        countryId: "fr",
        countryName: "France",
        shippingRate: null
      },
    ];
    
    return (
      <div>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo shipping page. In a real store, you would see your actual shipping settings.
          </p>
        </div>
        
        <StoreDefaultShippingDetails
          data={demoShippingDetails}
          storeUrl={storeUrlStr}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Country-Specific Shipping Rates</h2>
          <ShippingTable data={demoShippingRates} />
        </div>
      </div>
    );
  }
  
  // Special case for "new" store URL - show empty shipping settings
  if (storeUrlStr === "new") {
    const emptyShippingDetails = {
      defaultShippingService: "",
      defaultShippingFeePerItem: 0,
      defaultShippingFeeForAdditionalItem: 0,
      defaultShippingFeePerKg: 0,
      defaultShippingFeeFixed: 0,
      defaultDeliveryTimeMin: 0,
      defaultDeliveryTimeMax: 0,
      returnPolicy: "",
    };
    
    return (
      <div>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <p className="text-blue-700">
            You need to create a store first to manage shipping settings.
          </p>
        </div>
        
        <StoreDefaultShippingDetails
          data={emptyShippingDetails}
          storeUrl={storeUrlStr}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Country-Specific Shipping Rates</h2>
          <ShippingTable data={[]} />
        </div>
      </div>
    );
  }
  
  // For real stores, get the actual shipping data
  try {
    const shippingDetails = await getStoreDefaultShippingDetails(storeUrlStr);
    const shippingRates = await getStoreShippingRates(storeUrlStr);
    
    if (!shippingDetails || !shippingRates) {
      return redirect("/dashboard/seller");
    }
    
    return (
      <div>
        <StoreDefaultShippingDetails
          data={shippingDetails}
          storeUrl={storeUrlStr}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Country-Specific Shipping Rates</h2>
          <ShippingTable data={shippingRates} />
        </div>
      </div>
    );
  } catch (error) {
    // If there's an error fetching data, redirect to the seller dashboard
    return redirect("/dashboard/seller");
  }
}
