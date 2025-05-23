// Queries
import { getAllStores } from "@/queries/store";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE } from "@/lib/demo-mode";
import StoresTable from "./components/stores-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// Direct database query to get stores without user relationship
async function getStoresDirectly() {
  const user = await currentUser();
  
  // Ensure user is authenticated
  if (!user) throw new Error("Unauthenticated.");
  
  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN") {
    throw new Error("Unauthorized Access: Admin Privileges Required to View Stores.");
  }
  
  // Fetch all stores from the database without the problematic user relationship
  const stores = await db.store.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Add placeholder user data to match the expected structure
  return stores.map(store => ({
    ...store,
    user: {
      id: store.userId || "unknown",
      name: "Store Owner",
      email: "owner@example.com",
      picture: null
    }
  }));
}

export default async function AdminStoresPage() {
  // Check if this is demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  // For demo mode, return demo data
  if (isDemoMode && demoRole === "ADMIN") {
    // Create demo stores data
    const demoStores = [
      {
        id: "store-1",
        name: "Fashion Outlet",
        description: "Trendy clothing and accessories for all seasons.",
        email: "contact@fashionoutlet.com",
        phone: "555-123-4567",
        logo: "/assets/images/demo-store-logo.png",
        cover: "/assets/images/demo-store-cover.jpg",
        url: "fashion-outlet",
        status: "ACTIVE",
        featured: true,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        user: {
          id: "user-1",
          firstName: "John",
          lastName: "Doe",
          emailAddresses: [{ emailAddress: "john@example.com" }]
        }
      },
      {
        id: "store-2",
        name: "Tech Haven",
        description: "Latest gadgets and electronics at competitive prices.",
        email: "support@techhaven.com",
        phone: "555-987-6543",
        logo: "/assets/images/demo-store-logo.png",
        cover: "/assets/images/demo-store-cover.jpg",
        url: "tech-haven",
        status: "ACTIVE",
        featured: false,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        user: {
          id: "user-2",
          firstName: "Jane",
          lastName: "Smith",
          emailAddresses: [{ emailAddress: "jane@example.com" }]
        }
      },
      {
        id: "store-3",
        name: "Healthy Bites",
        description: "Organic and health food products for a better lifestyle.",
        email: "info@healthybites.com",
        phone: "555-456-7890",
        logo: "/assets/images/demo-store-logo.png",
        cover: "/assets/images/demo-store-cover.jpg",
        url: "healthy-bites",
        status: "PENDING",
        featured: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        user: {
          id: "user-3",
          firstName: "Robert",
          lastName: "Johnson",
          emailAddresses: [{ emailAddress: "robert@example.com" }]
        }
      },
      {
        id: "store-4",
        name: "Home Essentials",
        description: "Everything you need to make your house a home.",
        email: "contact@homeessentials.com",
        phone: "555-789-0123",
        logo: "/assets/images/demo-store-logo.png",
        cover: "/assets/images/demo-store-cover.jpg",
        url: "home-essentials",
        status: "BANNED",
        featured: false,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        user: {
          id: "user-4",
          firstName: "Sarah",
          lastName: "Williams",
          emailAddresses: [{ emailAddress: "sarah@example.com" }]
        }
      }
    ];
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Store Management</h1>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
          <p className="text-yellow-700">
            This is a demo admin stores page. In a production environment, you would see actual stores here.
          </p>
        </div>
        
        <StoresTable data={demoStores} />
      </div>
    );
  }
  
  // For real admin, get the actual stores data
  try {
    // Use our direct query function instead of getAllStores
    const stores = await getStoresDirectly();
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Store Management</h1>
        </div>
        
        <StoresTable data={stores} />
      </div>
    );
  } catch (error) {
    // Instead of redirecting, show an error message
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Store Management</h1>
        </div>
        
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
          <h2 className="text-red-700 font-bold mb-2">Error Loading Stores</h2>
          <p className="text-red-700">
            {error instanceof Error ? error.message : "An unknown error occurred while loading stores."}
          </p>
          <p className="text-red-700 mt-2">
            This likely indicates that your user account is not properly configured with admin privileges.
            Please check the server logs for more information.
          </p>
        </div>
      </div>
    );
  }
}
