import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";
import { BarChart3, DollarSign, ShoppingBag, Store, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // For demo mode, return demo data
  if (isDemoMode && demoRole === "ADMIN") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo admin dashboard. In a real marketplace, you would see global platform statistics, reports, and management tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard 
            title="Total Stores"
            value="42"
            description="4 pending approval"
            icon={<Store className="h-8 w-8 text-blue-500" />}
          />
          <DashboardCard 
            title="Platform Products"
            value="1,245"
            description="152 added this month"
            icon={<ShoppingBag className="h-8 w-8 text-green-500" />}
          />
          <DashboardCard 
            title="Total Users"
            value="876"
            description="↑ 12% from last month"
            icon={<User className="h-8 w-8 text-purple-500" />}
          />
          <DashboardCard 
            title="Platform Revenue"
            value="$142,845"
            description="$25,420 this month"
            icon={<DollarSign className="h-8 w-8 text-emerald-500" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Platform Growth</h3>
              <Button variant="ghost" size="sm" className="text-sm">
                View Report <TrendingUp className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center border rounded-md">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-10 w-10 text-gray-400" />
                <span className="text-gray-500 text-sm">Growth chart visualization would appear here</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </div>
            <div className="space-y-4">
              {[
                { action: "New store registered", store: "Tech Gadgets", time: "2 hours ago" },
                { action: "Product reported", item: "Counterfeit Watch", time: "5 hours ago" },
                { action: "Payout processed", store: "Fashion Outlet", amount: "$15,200", time: "Yesterday" },
                { action: "New category added", category: "Home Appliances", time: "Yesterday" },
                { action: "User dispute resolved", case: "Order #12435", time: "2 days ago" }
              ].map((activity, i) => (
                <div key={i} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {activity.action}
                      {activity.store && <span className="text-blue-600"> - {activity.store}</span>}
                      {activity.item && <span className="text-red-600"> - {activity.item}</span>}
                      {activity.amount && <span className="text-green-600"> - {activity.amount}</span>}
                      {activity.category && <span className="text-purple-600"> - {activity.category}</span>}
                      {activity.case && <span className="text-orange-600"> - {activity.case}</span>}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/admin/stores" className="block">
            <div className="bg-blue-50 rounded-lg shadow p-6 hover:bg-blue-100 transition-colors">
              <Store className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="text-lg font-semibold text-blue-800">Manage Stores</h3>
              <p className="text-blue-600 mt-1">Approve, edit, and manage platform stores</p>
            </div>
          </Link>
          
          <Link href="/dashboard/admin/categories" className="block">
            <div className="bg-green-50 rounded-lg shadow p-6 hover:bg-green-100 transition-colors">
              <ShoppingBag className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Manage Categories</h3>
              <p className="text-green-600 mt-1">Create and organize product categories</p>
            </div>
          </Link>
          
          <Link href="/dashboard/admin/orders" className="block">
            <div className="bg-purple-50 rounded-lg shadow p-6 hover:bg-purple-100 transition-colors">
              <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="text-lg font-semibold text-purple-800">Financial Reports</h3>
              <p className="text-purple-600 mt-1">View platform revenue and sales data</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }
  
  // For real admins
  return <div>Admin dashboard</div>;
}

// Dashboard card component
function DashboardCard({
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
