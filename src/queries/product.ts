"use server";

// DB
import { db } from "@/lib/db";

// Clert
import { currentUser } from "@clerk/nextjs/server";

// Slugify
import slugify from "slugify";
import { generateUniqueSlug } from "@/lib/utils";

// Types
import { ProductWithVariantType } from "@/lib/types";

// Function: upsertProduct
// Description: Upsers a product and its variant into the database, ensuring proper association to the shop
// Access Level: Seller only
// Parameters:
// - product: ProductWithVariant object containing details fo the product and its variants
// - shopUrl: The url of the shop to which the product belongs to
// returns: newly created or updated product with variant details
export const upsertProduct = async(product: ProductWithVariantType, shopUrl: string) => {
  try{
     // Retrieve current user
     const user = await currentUser();

     // Check if user is authenticated
     if (!user) throw new Error("Unauthenticated.");
 
     // Ensure user has seller privileges
     if (user.privateMetadata.role !== "SELLER")
       throw new Error(
         "Unauthorized Access: Seller Privileges Required for Entry."
       );
 
     // Ensure product data is provided
     if (!product) throw new Error("Please provide product data.");
 
     // Find the store by URL
     const store = await db.shop.findUnique({
       where: { url: shopUrl, userId: user.id },
     });
     if (!store) throw new Error("Store not found.");
 
     // Check if the product already exists
     const existingProduct = await db.product.findUnique({
       where: { id: product.productId },
     });
 
     // Check if the variant already exists
     const existingVariant = await db.productVariant.findUnique({
       where: { id: product.variantId },
     });
 
     if (existingProduct) {
       if (existingVariant) {
         // Update existing variant and product
       } else {
         // Create new variant
         await handleCreateVariant(product);
       }
     } else {
       // Create new product and variant
       await handleProductCreate(product, store.id);
     }
  } catch (error) {
    throw error;
  }
}

const handleCreateVariant = async (product: ProductWithVariantType) => {
  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "productVariant"
  );
  // Implementation needed
}

const handleProductCreate = async (
  product: ProductWithVariantType,
  storeId: string
) => {
  // Generate unique slugs for product and variant
  const productSlug = await generateUniqueSlug(
    slugify(product.name, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "product"
  );
  // Implementation needed
}
