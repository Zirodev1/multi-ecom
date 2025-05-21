// Queries
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { getStoreOrders } from "@/queries/store";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_STORE_URL } from "@/lib/demo-mode";

type PageParams = {
  storeUrl: string;
};

export default async function SellerOrdersPage({
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
  
  // For demo mode, return a demo message instead of trying to use the DataTable
  if (isDemoMode && storeUrlStr === DEMO_STORE_URL) {
    return (
      <div className="">
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
          <p className="text-yellow-700">
            This is a demo orders page. In a real store, this would display your actual orders.
          </p>
        </div>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample order card 1 */}
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Order ID:</span>
                <span className="text-sm font-bold">order-1</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Payment:</span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Total:</span>
                <span className="text-sm font-bold">$55.98</span>
              </div>
              <div className="text-center mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">View Details</button>
              </div>
            </div>
            
            {/* Sample order card 2 */}
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Order ID:</span>
                <span className="text-sm font-bold">order-2</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Shipped</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Payment:</span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Total:</span>
                <span className="text-sm font-bold">$140.98</span>
              </div>
              <div className="text-center mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For real users, get actual store orders
  const orders = await getStoreOrders(storeUrlStr);
  
  return (
    <div>
      <DataTable
        filterValue="id"
        data={orders}
        columns={columns}
        searchPlaceholder="Search order by id..."
      />
    </div>
  );
}
