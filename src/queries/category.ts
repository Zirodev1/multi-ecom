"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Category } from "@/generated/client";
import { db } from "@/lib/db";



// Function: upsetCategory
//Description: Upsets category into database, updating if it exits or creating a new on if it doesn't
//Permission Level: Admin only
//parameter:
//  -category Category object contianing details of the categoy to be upserted.
// returns: updated or newly created category details.
export const upsertCategory = async (category: Category) => {
  try {
    const user = await currentUser();

    if(!user) throw new Error("Unauthenticated");

    if(user.privateMetadata.role !== "ADMIN"){
      throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");
    }

    if(!category) throw new Error("Please provide category data.");
    if(!category.name) throw new Error("Category name is required.");

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

    if(existingCategory){
      let errorMessage = "";
      if(existingCategory.name === category.name){
        errorMessage = "A category with this name already exists.";
      }else if (existingCategory.url === category.url){
        errorMessage = "A category with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    const categoryDetails = await db.category.upsert({
      where:{
        id: category.id
      },
      update: {
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        updatedAt: category.updatedAt
      },
      create: {
        id: category.id,
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      },
    });
    
    return categoryDetails;
  } catch (error) {
    throw error;
  }
}

// Function: getAllCategories
// Description: Retrieves all categories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order. 
export const getAllCategories = async () => {
  // retrieve all categories from the database
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc"
    },
  });

  return categories;
}

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
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
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
};