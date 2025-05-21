import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-300 to-slate-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ZShop Demo</h1>
          <p className="mt-2 text-gray-600">
            Try out the platform with a demo account
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-md border border-orange-200">
            <p className="text-sm text-orange-700">
              This is a demo mode. Any changes you make will only affect your current session and will be reset automatically.
            </p>
          </div>

          <div className="space-y-2">
            <form action="/api/demo/login" method="POST">
              <input type="hidden" name="role" value="ADMIN" />
              <Button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Try as Admin
              </Button>
            </form>
            
            <form action="/api/demo/login" method="POST">
              <input type="hidden" name="role" value="SELLER" />
              <Button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Try as Seller
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 