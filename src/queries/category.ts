"use server";

// Function: upsetCategory
//Description: Upsets category into database, updating if it exits or creating a new on if it doesn't
//Permission Level: Admin only
//parameter:
//  -category Category object contianing details of the categoy to be upserted.
// returns: updated or newly created category details.

import { currentUser } from "@clerk/nextjs/server";
import { Category } from "@/generated/client";
import { db } from "@/lib/db";

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