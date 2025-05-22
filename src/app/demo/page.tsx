import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingBag, Store } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-800 to-indigo-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">ZShop Demo Experience</h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Try out our multi-vendor marketplace platform with a demo account. Explore features as either an admin or a seller without creating an account.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-indigo-900/70 to-indigo-800/70 rounded-lg shadow-lg p-8 border border-indigo-700">
            <div className="h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Admin Experience</h2>
            <p className="text-slate-300 mb-4">
              As a marketplace admin, you'll have control over the entire platform. Manage stores, categories, and monitor overall performance.
            </p>
            <ul className="space-y-2 mb-6 text-slate-300">
              <li className="flex items-center">
                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                View and manage all stores
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                Control product categories
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                Access platform analytics
              </li>
            </ul>
            <form action="/api/demo/login" method="POST">
              <input type="hidden" name="role" value="ADMIN" />
              <Button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Try Admin Dashboard
              </Button>
            </form>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/70 to-purple-800/70 rounded-lg shadow-lg p-8 border border-purple-700">
            <div className="h-14 w-14 bg-purple-600 rounded-full flex items-center justify-center mb-6">
              <Store size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Seller Experience</h2>
            <p className="text-slate-300 mb-4">
              Experience the platform from a seller's perspective. Manage your store, products, and orders through an intuitive dashboard.
            </p>
            <ul className="space-y-2 mb-6 text-slate-300">
              <li className="flex items-center">
                <div className="h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                Manage your store profile
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                Add and edit products
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center mr-2 text-xs">✓</div>
                Track orders and revenue
              </li>
            </ul>
            <form action="/api/demo/login" method="POST">
              <input type="hidden" name="role" value="SELLER" />
              <Button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Store className="mr-2 h-4 w-4" />
                Try Seller Dashboard
              </Button>
            </form>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg p-6 border border-slate-700 mb-8">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded mr-4">
              <ShoppingBag className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Demo Mode Information</h3>
              <p className="text-slate-300 text-sm">
                While in demo mode, any changes you make will only affect your current session and will be reset automatically. This lets you freely explore the platform without impacting real data.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Back to Store Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 