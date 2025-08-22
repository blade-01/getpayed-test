import { useMemo, useRef } from "react";
import { useOrders } from "../../lib/query";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import { downloadCsv } from "../../lib/csv";
import { downloadPdfFromNode } from "../../lib/pdf";
import { useUrlQuery } from "../../lib/query-sync";
import { presetToRange, type RangePreset, type Period } from "../../lib/date";

const PAGE_SIZE = 10;

export default function OrderPage() {
  const captureRef = useRef<HTMLDivElement>(null);

  const { query, setQuery } = useUrlQuery({
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: "date" as
      | "date"
      | "amount"
      | "status"
      | "productCategory"
      | "channel"
      | "id"
      | "customerId",
    sortDir: "desc" as "asc" | "desc",
    productCategory: "",
    period: "" as Period,
    from: "",
    to: ""
  });

  // Only compute a range when period is set
  const { from, to } = useMemo(() => {
    if (!query.period) return { from: undefined, to: undefined };
    return presetToRange(query.period as RangePreset, {
      from: query.from || undefined,
      to: query.to || undefined
    });
  }, [query.period, query.from, query.to]);

  const { data, isLoading, isError } = useOrders({
    page: query.page,
    pageSize: query.pageSize,
    sortBy: query.sortBy,
    sortDir: query.sortDir,
    productCategory: query.productCategory || undefined,
    dateFrom: from,
    dateTo: to
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <OrderFilters
        productCategory={query.productCategory || undefined}
        period={query.period as Period}
        dateFrom={query.from || undefined}
        dateTo={query.to || undefined}
        onChange={(f) => {
          setQuery({
            productCategory: f.productCategory ?? "",
            period: (f.period ?? "") as Period,
            from: f.period === "custom" ? f.dateFrom ?? "" : "",
            to: f.period === "custom" ? f.dateTo ?? "" : "",
            page: 1
          });
        }}
      />

      <div className="flex justify-end gap-3.5">
        <button
          className="rounded bg-indigo-600 px-3 py-2 text-white"
          onClick={() => downloadCsv(rows, "orders")}
        >
          Export CSV
        </button>
        <button
          onClick={() =>
            captureRef.current &&
            downloadPdfFromNode(captureRef.current, "dashboard.pdf")
          }
          className="rounded bg-slate-700 px-3 py-2 text-white"
        >
          Export PDF
        </button>
      </div>
      <div ref={captureRef}>
        <OrderTable
          data={rows}
          total={total}
          page={query.page}
          pageSize={query.pageSize}
          sortBy={query.sortBy}
          sortDir={query.sortDir}
          onPageChange={(p) => setQuery({ page: p })}
          onSortChange={(col, dir) =>
            setQuery({ sortBy: col, sortDir: dir, page: 1 })
          }
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
