"use client";

import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import UpdateStockButton from "./update-stock-button";

// Define inventory item type
type InventoryItem = {
  id: string;
  productName: string;
  variant: string;
  size: string;
  inStock: number;
  lowStock: boolean;
  productId: string;
  variantId: string;
  sizeId: string;
  isDemo: boolean;
};

// Props for the inventory table
interface InventoryTableProps {
  data: InventoryItem[];
}

export default function InventoryTable({ data }: InventoryTableProps) {
  // Define columns for inventory display
  const columns = [
    {
      accessorKey: "productName",
      header: "Product",
    },
    {
      accessorKey: "variant",
      header: "Variant",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "inStock",
      header: "In Stock",
    },
    {
      accessorKey: "lowStock",
      header: "Status",
      cell: ({ row }) => {
        const stock = row.original.inStock;
        if (stock <= 0) {
          return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Out of stock</span>;
        } else if (stock < 10) {
          return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Low stock</span>;
        } else {
          return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In stock</span>;
        }
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <UpdateStockButton
            productName={row.original.productName}
            variant={row.original.variant}
            size={row.original.size}
            currentStock={row.original.inStock}
            productId={row.original.productId}
            variantId={row.original.variantId}
            sizeId={row.original.sizeId}
            isDemo={row.original.isDemo}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Bulk Update
        </>
      }
      filterValue="productName"
      data={data}
      columns={columns}
      searchPlaceholder="Search products..."
    />
  );
} 