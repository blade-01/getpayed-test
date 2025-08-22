import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "./api";
import type { KPI, KpiParams, Order, OrdersParams } from "../types";

function toQuery(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "")
      usp.set(k, String(v));
  });
  return usp.toString();
}

/** /kpis with optional date range using json-server gte/lte syntax */
export function useKpis(params: KpiParams) {
  const { dateFrom, dateTo } = params;
  const qs = toQuery({
    ...(dateFrom ? { date_gte: dateFrom } : {}),
    ...(dateTo ? { date_lte: dateTo } : {}),
    _sort: "date",
    _order: "asc"
  });

  return useQuery({
    queryKey: ["kpis", qs],
    queryFn: async (): Promise<KPI[]> => {
      const { data } = await api.get(`/kpis?${qs}`);
      return data;
    },
    placeholderData: keepPreviousData
  });
}

/** /orders with pagination, sorting, filters */
export function useOrders(params: OrdersParams) {
  const { page, pageSize, sortBy, sortDir, productCategory, dateFrom, dateTo } =
    params;

  // json-server meta total via `X-Total-Count` (needs --cors; it’s there by default)
  const qs = toQuery({
    ...(productCategory ? { productCategory } : {}),
    ...(dateFrom ? { date_gte: dateFrom } : {}),
    ...(dateTo ? { date_lte: dateTo } : {}),
    _page: page,
    _limit: pageSize,
    ...(sortBy ? { _sort: sortBy } : {}),
    ...(sortDir ? { _order: sortDir } : {})
  });

  return useQuery({
    queryKey: ["orders", qs],
    queryFn: async (): Promise<{ rows: Order[]; total: number }> => {
      const res = await api.get(`/orders?${qs}`);
      const total = Number(
        res.headers["x-total-count"] ?? res.data?.length ?? 0
      );
      return { rows: res.data as Order[], total };
    },
    placeholderData: keepPreviousData
  });
}
