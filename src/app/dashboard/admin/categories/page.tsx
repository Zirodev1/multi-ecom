// Queries
import { getAllCategories } from "@/queries/category";

// Data table
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { columns } from "./columns";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  // Create empty array for categories
  let categories = [];
  
  try {
    // Fetching categories data from the database
    const categoriesData = await getAllCategories();
    
    // If we got data, use it
    if (categoriesData) {
      categories = categoriesData;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Continue with empty array
  }

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
    />
  );
}
