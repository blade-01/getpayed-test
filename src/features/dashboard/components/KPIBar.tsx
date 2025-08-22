import type { KPI } from "../../../types";

export default function KPIBar({ data }: { data: KPI[] }) {
  const safeData = Array.isArray(data) ? data : [];

  const totals = safeData.reduce(
    (acc, k) => {
      const revenue = Number(k?.revenue) || 0;
      const orders = Number(k?.orders) || 0;
      const activeCustomers = Number(k?.activeCustomers) || 0;

      return {
        revenue: acc.revenue + revenue,
        orders: acc.orders + orders,
        activeCustomers: Math.max(acc.activeCustomers, activeCustomers)
      };
    },
    { revenue: 0, orders: 0, activeCustomers: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="text-sm text-gray-500">Revenue</div>
        <div className="text-2xl font-semibold">
          ${totals.revenue.toLocaleString()}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="text-sm text-gray-500">Orders</div>
        <div className="text-2xl font-semibold">
          {totals.orders.toLocaleString()}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="text-sm text-gray-500">Active Customers</div>
        <div className="text-2xl font-semibold">
          {totals.activeCustomers.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
