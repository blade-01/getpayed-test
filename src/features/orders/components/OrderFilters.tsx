import {
  presetToRange,
  type RangePreset,
  type Period
} from "../../../lib/date";
import { useEffect, useMemo, useRef, useState } from "react";
import SelectDropdown from "../../../components/ui/SelectDropdown";

interface Props {
  productCategory?: string;
  period?: Period;
  dateFrom?: string;
  dateTo?: string;
  onChange: (filters: {
    productCategory?: string;
    period?: Period;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export default function OrderFilters({
  productCategory,
  period = "",
  dateFrom,
  dateTo,
  onChange
}: Props) {
  const [category, setCategory] = useState(productCategory ?? "");
  const [preset, setPreset] = useState<Period>(period);
  const [customFrom, setCustomFrom] = useState<string | undefined>();
  const [customTo, setCustomTo] = useState<string | undefined>();

  // Initialize custom dates once if URL has them
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    if (period === "custom") {
      setCustomFrom(dateFrom);
      setCustomTo(dateTo);
    }
    didInit.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync controlled props -> local
  useEffect(() => setCategory(productCategory ?? ""), [productCategory]);
  useEffect(() => setPreset(period ?? ""), [period]);

  // Effective range
  const { from, to } = useMemo(() => {
    if (preset === "") return { from: undefined, to: undefined }; // All
    if (preset === "custom") {
      if (!customFrom || !customTo) return { from: undefined, to: undefined };
      return { from: customFrom, to: customTo };
    }
    return presetToRange(preset as RangePreset);
  }, [preset, customFrom, customTo]);

  // Emit upwards
  useEffect(() => {
    onChange({
      productCategory: category || undefined,
      period: preset,
      dateFrom: from,
      dateTo: to
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, preset, from, to]);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
      {/* Category */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-sm font-medium mb-1">Category</label>
        <SelectDropdown
          value={category}
          onChange={setCategory}
          options={[
            { label: "All Categories", value: "" },
            { label: "Laptop", value: "Laptop" },
            { label: "Headphones", value: "Headphones" },
            { label: "Smartphone", value: "Smartphone" },
            { label: "Monitor", value: "Monitor" },
            { label: "Keyboard", value: "Keyboard" }
          ]}
          className="!w-full md:!w-56"
        />
      </div>

      {/* Preset */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-sm font-medium mb-1">Date Range</label>
        <SelectDropdown
          value={preset}
          onChange={(v) => {
            const next = v as Period;
            setPreset(next);
            if (next !== "custom") {
              setCustomFrom(undefined);
              setCustomTo(undefined);
            }
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

      {/* Custom range */}
      {preset === "custom" && (
        <>
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">From</label>
            <input
              type="date"
              className="input-style w-full md:w-44"
              value={customFrom ?? ""}
              onChange={(e) => setCustomFrom(e.target.value || undefined)}
            />
          </div>
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">To</label>
            <input
              type="date"
              className="input-style w-full md:w-44"
              value={customTo ?? ""}
              onChange={(e) => setCustomTo(e.target.value || undefined)}
            />
          </div>
        </>
      )}
    </div>
  );
}
