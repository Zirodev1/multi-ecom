import OrdersTable from "@/components/store/profile/orders/orders-table";
import { OrderTableFilter } from "@/lib/types";
import { getUserOrders } from "@/queries/profile";

export default async function ProfileFilteredOrderPage({
  params,
}: {
  params: Promise<{ filter: string }>;
}) {
  const { filter: filterParam } = await params;
  const filter = filterParam ? (filterParam as OrderTableFilter) : "";
  const orders_data = await getUserOrders(filter);
  const { orders, totalPages } = orders_data;
  return (
    <div>
      <OrdersTable
        orders={orders}
        totalPages={totalPages}
        prev_filter={filter}
      />
    </div>
  );
}
