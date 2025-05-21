import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import { OrderStatus, PaymentStatus } from "@/lib/types";

export default async function AdminOrdersPage() {
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // For demo mode, return demo data
  if (isDemoMode && demoRole === "ADMIN") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo admin orders page. In a marketplace model, admins typically have limited 
            direct involvement with orders, as sellers manage their own orders. 
          </p>
          <p className="text-yellow-700 mt-2">
            Admin order management usually focuses on dispute resolution and overall monitoring 
            rather than detailed order handling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OrderStatCard 
            title="Total Orders" 
            value="1,248" 
            trend="+12% from last month" 
            color="bg-blue-500"
          />
          <OrderStatCard 
            title="Pending" 
            value="56" 
            trend="+3% from last month" 
            color="bg-yellow-500"
          />
          <OrderStatCard 
            title="Completed" 
            value="952" 
            trend="+15% from last month" 
            color="bg-green-500"
          />
          <OrderStatCard 
            title="Disputed" 
            value="12" 
            trend="-5% from last month" 
            color="bg-red-500"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Disputes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-7829</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Michael Brown</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tech Haven</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Item not as described</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      In Review
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-6543</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Emily Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fashion Outlet</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Damaged during shipping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Resolved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-9102</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">David Wilson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Healthy Bites</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Missing items in order</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Escalated
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  // For real admin, we would implement actual order summary/stats functionality
  // For now, we'll just redirect to the admin dashboard
  return redirect("/dashboard/admin");
}

// Simple stat card component
function OrderStatCard({ title, value, trend, color }: { title: string, value: string, trend: string, color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white mb-4`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="text-gray-400 text-xs mt-1">{trend}</div>
    </div>
  );
} 