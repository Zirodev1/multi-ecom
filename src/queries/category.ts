"use server";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";

// Prisma model
import { Category } from "@prisma/client";

// Function: upsertCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.
export const upsertCategory = async (category: Category) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) {
      console.error("Unauthenticated user attempted to create a category");
      throw new Error("Unauthenticated. Please sign in to continue.");
    }

    // Check for role in privateMetadata
    const userRole = user.privateMetadata?.role as string || "";
    
    // Verify admin permission with more detailed error handling
    if (userRole !== "ADMIN") {
      console.error(`User ${user.id} with role ${userRole} attempted to create a category`);
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry."
      );
    }

    // Ensure category data is provided
    if (!category) throw new Error("Please provide category data.");

    // Ensure name is provided
    if (!category.name) throw new Error("Category name is required");
    
    // Ensure url is provided
    if (!category.url) throw new Error("Category URL is required");
    
    // Ensure image is provided
    if (!category.image) throw new Error("Category image is required");

    // Throw error if category with same name or URL already exists
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    // Throw error if category with same name or URL already exists
    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "A category with the same name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Explicitly prepare data for both update and create operations
    const categoryData = {
      name: category.name,
      url: category.url,
      image: category.image,
      featured: category.featured ?? false,
      updatedAt: new Date(),
    };

    // Upsert category into the database
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: categoryData,
      create: {
        ...categoryData,
        id: category.id,
        createdAt: category.createdAt || new Date(),
      },
    });
    
    return categoryDetails;
  } catch (error: any) {
    // Log detailed error information
    console.error("Error in upsertCategory:", error.message);
    // Re-throw with clear message
    throw new Error(`Failed to save category: ${error.message}`);
  }
};

// Function: getAllCategories
// Description: Retrieves all categories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order.
export const getAllCategories = async (storeUrl?: string) => {
  let storeId: string | undefined;

  if (storeUrl) {
    // Retrieve the storeId based on the storeUrl
    const store = await db.store.findUnique({
      where: { url: storeUrl },
      select: {
        id: true
      }
    });

    // If no store is found, return an empty array or handle as needed
    if (!store) {
      return [];
    }

    storeId = store.id;
  }

  // Retrieve all categories from the database
  const categories = await db.category.findMany({
    where: storeId
      ? {
          products: {
            some: {
              storeId,
            },
          },
        }
      : {},
    select: {
      id: true,
      name: true,
      image: true,
      url: true,
      featured: true,
      createdAt: true,
      updatedAt: true,
      subCategories: {
        select: {
          id: true,
          name: true,
          image: true,
          url: true,
          featured: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

// Function: getAllCategoriesForCategory
// Description: Retrieves all SubCategories fro a category from the database.
// Permission Level: Public
// Returns: Array of subCategories of category sorted by updatedAt date in descending order.
export const getAllCategoriesForCategory = async (categoryId: string) => {
  // Retrieve all subcategories of category from the database
  const subCategories = await db.subCategory.findMany({
    where: {
      categoryId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      url: true,
      featured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getCategory
// Description: Retrieves a specific category from the database.
// Access Level: Public
// Parameters:
//   - categoryId: The ID of the category to be retrieved.
// Returns: Details of the requested category.
export const getCategory = async (categoryId: string) => {
  // Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Retrieve category
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// Function: deleteCategory
// Description: Deletes a category from the database.
// Permission Level: Admin only
// Parameters:
//   - categoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteCategory = async (categoryId: string) => {
  try {
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

    // Check for role in privateMetadata
    const userRole = user.privateMetadata?.role as string || "";

  // Verify admin permission
    if (userRole !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  // Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Delete category from the database
  const response = await db.category.delete({
    where: {
      id: categoryId,
    },
  });
  return response;
  } catch (error: any) {
    console.error("Error in deleteCategory:", error.message);
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};
