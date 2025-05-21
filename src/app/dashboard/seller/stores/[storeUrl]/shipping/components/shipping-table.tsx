"use client";

import DataTable from "@/components/ui/data-table";
import { CountryWithShippingRatesType } from "@/lib/types";
import { columns } from "../columns";

interface ShippingTableProps {
  data: CountryWithShippingRatesType[];
}

export default function ShippingTable({ data }: ShippingTableProps) {
  return (
    <DataTable
      filterValue="countryName"
      data={data}
      columns={columns}
      searchPlaceholder="Search by country name..."
    />
  );
} 