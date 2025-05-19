// Queries
import { getAllStores } from "@/queries/store";

// Data table
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminStoresPage() {
  // Create empty array for stores
  let stores = [];
  
  try {
    // Fetching stores data from the database
    const storesData = await getAllStores();
    
    // If we got data, use it
    if (storesData) {
      stores = storesData;
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
    // Continue with empty array
  }

  return (
    <DataTable
      filterValue="name"
      data={stores}
      searchPlaceholder="Search store name..."
      columns={columns}
    />
  );
}
