"use client";

import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { columns } from "../columns";
import CouponDetails from "@/components/dashboard/forms/coupon-details";
import { Coupon } from "@prisma/client";

interface CouponsTableProps {
  data: Coupon[];
  storeUrl: string;
}

export default function CouponsTable({ data, storeUrl }: CouponsTableProps) {
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create coupon
        </>
      }
      modalChildren={<CouponDetails storeUrl={storeUrl} />}
      newTabLink={`/dashboard/seller/stores/${storeUrl}/coupons/new`}
      filterValue="code"
      data={data}
      columns={columns}
      searchPlaceholder="Search coupon code..."
    />
  );
} 