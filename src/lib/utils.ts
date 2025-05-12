import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { PrismaClient } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Helper function to genarae a unique slug
export const generateUniqueSlug = async (
  baseSlug: string,
  modelName: string,
  field: string = "slug",
  separator: string = "-"
) => {
  let slug = baseSlug;
  let suffix = 1;
  
  // Import db here to avoid circular dependencies
  const { db } = await import("@/lib/db");

  while (true) {
    // Use dynamic access for the model
    const model = (db as any)[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} not found in Prisma client`);
    }
    
    const exisitngRecord = await model.findFirst({
      where: {
        [field]: slug,
      },
    });
    if (!exisitngRecord) {
      break;
    }
    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }
  return slug;
};

export const getGridClassName = (length: number) => {
  switch (length){
    case 2:
      return "grid-cols-2"
    case 3:
      return "grid-cols-2 grid-rows-2"
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 gird-rows-5"
    case 6:
      return "grid-cols-2"
    default:
      return ""
  }
}

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};