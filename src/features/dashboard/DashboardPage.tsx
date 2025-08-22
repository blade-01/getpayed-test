import { useMemo, useRef } from "react";
import KPIBar from "./components/KPIBar";
import RevenueChart from "./components/RevenueChart";
import { useKpis } from "../../lib/query";
import { presetToRange, type RangePreset } from "../../lib/date";
import { downloadCsv } from "../../lib/csv";
import { downloadPdfFromNode } from "../../lib/pdf";
import { useUrlQuery } from "../../lib/query-sync";
import SelectDropdown from "../../components/ui/SelectDropdown";

type Period = RangePreset | "";

export default function DashboardPage() {
  const captureRef = useRef<HTMLDivElement>(null);
  const { query, setQuery } = useUrlQuery({
    period: "" as Period,
    from: "",
    to: "",
    productCategory: ""
  });

  // Only compute a range when period is set.
  const { from, to } = useMemo(() => {
    if (!query.period) return { from: undefined, to: undefined };
    return presetToRange(query.period, {
      from: query.from || undefined,
      to: query.to || undefined
    });
  }, [query.period, query.from, query.to]);

  const { data, isLoading, isFetching, isError } = useKpis({
    dateFrom: from,
    dateTo: to
  });

  const isInitialLoading = isLoading && !data;
  const isRefreshing = isFetching && !!data;

  const onExport = () => {
    if (!data?.length) return;
    downloadCsv(data, `kpis_${from ?? "all"}_${to ?? "all"}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
        {/* Preset */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Date Range</label>
          <SelectDropdown
            value={query.period}
            onChange={(v) => {
              const next = (
                typeof v === "string" ? v : (v as any)?.value ?? ""
              ) as Period;
              setQuery({
                period: next,
                from: next === "custom" ? query.from : "",
                to: next === "custom" ? query.to : ""
              });
            }}
            options={[
              { label: "All", value: "" },
              { label: "Last 7 days", value: "7d" },
              { label: "Last 30 days", value: "30d" },
              { label: "Last 90 days", value: "90d" },
              { label: "Custom", value: "custom" }
            ]}
            className="!w-full md:!w-44"
          />
        </div>

        {/* Custom Range */}
        {query.period === "custom" && (
          <>
            <div className="flex flex-col w-full md:w-auto">
              <label className="text-sm font-medium mb-1">From</label>
              <input
                type="date"
                className="input-style w-full md:w-44"
                value={query.from}
                onChange={(e) => setQuery({ from: e.target.value })}
              />
            </div>
            <div className="flex flex-col w-full md:w-auto">
              <label className="text-sm font-medium mb-1">To</label>
              <input
                type="date"
                className="input-style w-full md:w-44"
                value={query.to}
                onChange={(e) => setQuery({ to: e.target.value })}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3.5">
        <button
          onClick={onExport}
          className="ml-auto rounded bg-indigo-600 px-3 py-2 text-white"
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

      {/* Content */}
      {isInitialLoading && (
        <div className="rounded bg-white p-4 shadow">Loading KPIs…</div>
      )}
      {isError && (
        <div className="rounded bg-white p-4 shadow text-red-600">
          Failed to load KPIs.
        </div>
      )}
      {data && (
        <div ref={captureRef} className="flex flex-col gap-4">
          <KPIBar data={data} />
          <RevenueChart data={data} />
        </div>
      )}
    </div>
  );
}
