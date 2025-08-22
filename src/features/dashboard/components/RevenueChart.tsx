import type { KPI } from "../../../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function RevenueChart({ data }: { data: KPI[] }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-2 text-lg font-semibold">KPIs Over Time</div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#7c3aed"
            dot={false}
          />
          <Line type="monotone" dataKey="orders" stroke="#16a34a" dot={false} />
          <Line
            type="monotone"
            dataKey="activeCustomers"
            stroke="#f59e0b"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
