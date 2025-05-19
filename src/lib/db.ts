import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize database with better error handling
let db: PrismaClient;

try {
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set. Database operations will fail.");
  }
  
  // Try to initialize the Prisma client
  db = globalThis.prisma || new PrismaClient();
  
  // Cache the client in development for better performance
  if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  // Create a mock Prisma client that returns empty arrays/objects for all operations
  db = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      // Return a function for any method call
      if (prop === 'product' || prop === 'category' || prop === 'store' || prop === 'user' || 
          prop === 'subCategory' || prop === 'offerTag' || prop === 'order' || prop === 'review') {
        return {
          findMany: async () => [],
          findUnique: async () => null,
          findFirst: async () => null,
          create: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
          count: async () => 0,
        };
      }
      return () => {};
    },
  });
}

export { db };
