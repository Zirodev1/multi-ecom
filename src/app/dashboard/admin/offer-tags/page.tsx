// Queries
import { getAllOfferTags } from "@/queries/offer-tag";

// Data table
import DataTable from "@/components/ui/data-table";

// Plus icon
import { Plus } from "lucide-react";

// Offer tag details
import OfferTagDetails from "@/components/dashboard/forms/offer-tag-details";

// Columns
import { columns } from "./columns";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminOfferTagsPage() {
  // Create empty array for offer tags
  let offerTags = [];
  
  try {
    // Fetching offer tags data from the database
    const data = await getAllOfferTags();
    
    // If we got data, use it
    if (data) {
      offerTags = data;
    }
  } catch (error) {
    console.error("Error fetching offer tags:", error);
    // Continue with empty array
  }

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create offer tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      filterValue="name"
      data={offerTags}
      searchPlaceholder="Search offer tag name..."
      columns={columns}
    />
  );
}
