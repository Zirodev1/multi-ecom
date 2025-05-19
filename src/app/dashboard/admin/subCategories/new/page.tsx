import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import { getAllCategories } from "@/queries/category";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminNewSubCategoryPage() {
  let categories = [];
  
  try {
    // Fetch categories with error handling
    const categoriesData = await getAllCategories();
    if (categoriesData) {
      categories = categoriesData;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Continue with empty array
  }
  
  return <SubCategoryDetails categories={categories} />;
}
