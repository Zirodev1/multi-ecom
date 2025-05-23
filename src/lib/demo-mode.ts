import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Re-export client-safe constants
export {
  DEMO_SESSION_COOKIE,
  DEMO_MODE_COOKIE,
  DEMO_ROLE_COOKIE,
  DEMO_STORE_URL,
} from "./demo-mode-client";

// Define server-side DemoRole type
export type DemoRole = "ADMIN" | "SELLER" | null;

// Export server-specific constants
export const DEMO_STORE_ID = "demo-store-123456";
export const DEMO_USER_ID = "demo-user-123456";

/**
 * Check if the current request is from a demo user (server-side)
 */
export async function isDemoUser() {
  const cookieStore = await cookies();
  return cookieStore.has("demo_mode") && cookieStore.get("demo_mode")?.value === "true";
}

/**
 * Get the demo session ID or create a new one (server-side)
 */
export async function getDemoSessionId() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("demo_session_id")?.value;
  
  if (sessionId) {
    return sessionId;
  }
  
  return uuidv4();
}

/**
 * Get the current demo role (ADMIN or SELLER) - server-side
 */
export async function getDemoRole(): Promise<DemoRole> {
  const cookieStore = await cookies();
  const roleValue = cookieStore.get("demo_role")?.value;
  
  if (roleValue === "ADMIN" || roleValue === "SELLER") {
    return roleValue;
  }
  
  return null;
}

/**
 * Creates a mock store object for demo mode
 */
export function createDemoStore(sessionId: string) {
  return {
    id: DEMO_STORE_ID,
    name: "Demo Store",
    description: "This is a demo store for testing purposes.",
    email: `demo-${sessionId.substring(0, 8)}@example.com`,
    phone: "555-123-4567",
    url: "demo-store",
    logo: "/assets/images/demo-store-logo.png",
    cover: "/assets/images/demo-store-cover.jpg",
    status: "ACTIVE",
    featured: false,
    returnPolicy: "Return in 30 days.",
    defaultShippingService: "International Delivery",
    defaultShippingFeePerItem: 5,
    defaultShippingFeeForAdditionalItem: 2,
    defaultShippingFeePerKg: 10,
    defaultShippingFeeFixed: 15,
    defaultDeliveryTimeMin: 7,
    defaultDeliveryTimeMax: 31,
    averageRating: 4.5,
    numReviews: 42,
    userId: DEMO_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Cleanup function to remove expired demo data
 * This could be run via a cron job or when server starts
 */
export async function cleanupDemoData(db: any, maxAgeHours = 24) {

} 