// Data table
import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";

// Queries
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminSubCategoriesPage() {
  // Initialize empty arrays
  let subCategories = [];
  let categories = [];
  
  try {
    // Fetching subCategories data from the database
    const subCategoriesData = await getAllSubCategories();
    
    // If we got data, use it
    if (subCategoriesData) {
      subCategories = subCategoriesData;
    }
    
    // Fetching categories data from the database
    const categoriesData = await getAllCategories();
    
    if (categoriesData) {
      categories = categoriesData;
    }
  } catch (error) {
    console.error("Error fetching subcategories data:", error);
    // Continue with empty arrays
  }

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink="/dashboard/admin/subCategories/new"
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name..."
      columns={columns}
    />
  );
}
