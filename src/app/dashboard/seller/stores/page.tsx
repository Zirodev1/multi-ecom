import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, Package, ShoppingBag } from "lucide-react";

export default async function SellerStoresPage() {
  // Get the current user
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  // Fetch the user's stores
  const stores = await db.store.findMany({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      url: true,
      logo: true,
      description: true,
      status: true
    }
  });
  
  console.log("Stores page - user ID:", user.id);
  console.log("Stores page - found stores:", stores.length);

  // If no stores, redirect to create store
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="max-w-md text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">No Stores Found</h1>
          <p className="mb-6">You haven't created any stores yet. Create your first store to start selling.</p>
          <Link href="/dashboard/seller/stores/new">
            <Button>Create Store</Button>
          </Link>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md text-xs max-w-md">
          <p>Debug info:</p>
          <p>User ID: {user.id}</p>
          <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
          <p>Stores count: {stores.length}</p>
        </div>
      </div>
    );
  }

  // Display the user's stores
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Stores ({stores.length})</h1>
        <Link href="/dashboard/seller/stores/new">
          <Button>Create New Store</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link key={store.id} href={`/dashboard/seller/stores/${store.url}`} className="block">
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                {store.logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      className="object-cover w-24 h-24 rounded-full"
                    />
                  </div>
                )}
                {!store.logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    store.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                    store.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {store.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md text-xs">
        <p>Debug info:</p>
        <p>User ID: {user.id}</p>
        <p>Stores count: {stores.length}</p>
      </div>
    </div>
  );
}
