import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const DEMO_SESSION_COOKIE = "demo_session_id";
export const DEMO_MODE_COOKIE = "demo_mode";
export const DEMO_ROLE_COOKIE = "demo_role";

export type DemoRole = "ADMIN" | "SELLER" | null;

/**
 * Check if the current request is from a demo user
 */
export async function isDemoUser() {
  const cookieStore = await cookies();
  return cookieStore.has(DEMO_MODE_COOKIE) && cookieStore.get(DEMO_MODE_COOKIE)?.value === "true";
}

/**
 * Get the demo session ID or create a new one
 */
export async function getDemoSessionId() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  
  if (sessionId) {
    return sessionId;
  }
  
  return uuidv4();
}

/**
 * Get the current demo role (ADMIN or SELLER)
 */
export async function getDemoRole(): Promise<DemoRole> {
  const cookieStore = await cookies();
  const roleValue = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  
  if (roleValue === "ADMIN" || roleValue === "SELLER") {
    return roleValue;
  }
  
  return null;
}

// Demo store ID that will be used consistently for seller demo mode
export const DEMO_STORE_ID = "demo-store-123456";
export const DEMO_STORE_URL = "demo-store";
export const DEMO_USER_ID = "demo-user-123456";

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
    url: DEMO_STORE_URL,
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
  // We're not actually implementing this since we're not storing demo data
  // in the database anymore
  console.log("Demo cleanup not needed - demo data is isolated in memory");
} 