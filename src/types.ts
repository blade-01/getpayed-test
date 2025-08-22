export type ISODate = string; // e.g. "2025-07-01" or "2025-07-01T10:24:00Z"

export interface KPI {
  date: ISODate;
  revenue: number;
  orders: number;
  activeCustomers: number;
}

export interface Order {
  id: string;
  date: ISODate;
  customerId: string;
  amount: number;
  currency: string;
  status: "paid" | "refunded" | "pending" | string;
  productCategory: string;
  channel: "web" | "mobile" | "store" | string;
}

export type OrdersParams = {
  page: number;
  pageSize: number;
  sortBy?:
    | "date"
    | "amount"
    | "status"
    | "productCategory"
    | "channel"
    | "id"
    | "customerId";
  sortDir?: "asc" | "desc";
  productCategory?: string;
  dateFrom?: string;
  dateTo?: string;
};

export interface KpiParams {
  dateFrom?: string;
  dateTo?: string;
}
