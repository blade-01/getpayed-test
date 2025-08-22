import type { Order, OrdersParams } from "../../../types";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ChannelBadge } from "../../../components/ui/ChannelBadge";

type SortableOrderKey = NonNullable<OrdersParams["sortBy"]>;

interface Props {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: SortableOrderKey;
  sortDir: "asc" | "desc";
  onPageChange: (page: number) => void;
  onSortChange: (col: SortableOrderKey, dir: "asc" | "desc") => void;
  isLoading?: boolean;
  isError?: boolean;
}

export default function OrderTable({
  data,
  total,
  page,
  pageSize,
  sortBy,
  sortDir,
  onPageChange,
  onSortChange,
  isLoading,
  isError
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: String(sortBy), desc: sortDir === "desc" }
  ]);

  useEffect(() => {
    setSorting([{ id: String(sortBy), desc: sortDir === "desc" }]);
  }, [sortBy, sortDir]);

  const sortableCols = useMemo(
    () =>
      new Set<SortableOrderKey>([
        "date",
        "amount",
        "status",
        "productCategory",
        "channel",
        "id",
        "customerId"
      ]),
    []
  );

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "id", header: "Order ID" },
      { accessorKey: "customerId", header: "Customer" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => {
          const row = info.row.original as Order;
          const currency = row.currency || "USD"; // fallback to USD
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            currencyDisplay: "symbol"
          }).format(row.amount);
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() as string} />
      },
      { accessorKey: "productCategory", header: "Category" },
      {
        accessorKey: "channel",
        header: "Channel",
        cell: (info) => <ChannelBadge channel={info.getValue() as string} />
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      const s = next[0];
      if (s && sortableCols.has(s.id as SortableOrderKey)) {
        onSortChange(s.id as SortableOrderKey, s.desc ? "desc" : "asc");
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    enableSortingRemoval: false
  });

  return (
    <div className="rounded bg-white p-4 shadow">
      <div className="mb-2 text-lg font-semibold">Orders</div>

      {isLoading && <div>Loading orders…</div>}
      {isError && <div className="text-red-600">Failed to load orders.</div>}
      {!isLoading && !isError && data.length === 0 && (
        <div>No orders found.</div>
      )}

      {data.length > 0 && (
        <>
          <div className="flex gap-2.5 items-center mb-3 flex-wrap">
            <p className="font-medium">Column Visibility:</p>
            <div className="flex flex-wrap gap-2">
              {table.getAllLeafColumns().map((col, idx, arr) => (
                <label
                  key={col.id}
                  className="inline-flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                    className="h-4 w-4 accent-blue-700"
                  />
                  {col.columnDef.header as string}
                  {idx < arr.length - 1 && <span>|</span>}
                </label>
              ))}
            </div>
          </div>
          <div className="-mx-4 md:mx-0 overflow-x-auto">
            <table className="min-w-[800px] md:min-w-full text-sm whitespace-nowrap">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => {
                      const sortable = h.column.getCanSort();
                      const dir = h.column.getIsSorted();
                      return (
                        <th
                          key={h.id}
                          className="cursor-pointer border-b p-2 text-left select-none sticky top-0 bg-white"
                          onClick={
                            sortable
                              ? h.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                          {dir === "asc" && " ▲"}
                          {dir === "desc" && " ▼"}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    {r.getVisibleCells().map((c) => (
                      <td key={c.id} className="p-2">
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
            </div>
            <div className="flex gap-2">
              <button
                className="rounded border px-3 py-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                className="rounded border px-3 py-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
