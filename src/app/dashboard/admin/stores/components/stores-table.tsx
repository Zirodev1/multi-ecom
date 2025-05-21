"use client";

import DataTable from "@/components/ui/data-table";
import { AdminStoreType } from "@/lib/types";
import { columns } from "../columns";

interface StoresTableProps {
  data: AdminStoreType[];
}

export default function StoresTable({ data }: StoresTableProps) {
  return (
    <DataTable
      filterValue="name"
      data={data}
      searchPlaceholder="Search store name..."
      columns={columns}
    />
  );
} 