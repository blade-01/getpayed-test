import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type QVal = string | number | boolean | undefined | null;
type Dict = Record<string, QVal>;

function toStr(v: any) {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "object" && "value" in v) return String(v.value); // ✅ coerce option objects
  return String(v);
}
function num(v: string | null, def?: number) {
  if (v == null) return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
function bool(v: string | null, def?: boolean) {
  if (v == null) return def;
  return v === "true" ? true : v === "false" ? false : def;
}

/** Read/write filters in URL query params */
export function useUrlQuery<T extends Dict>(defaults: T) {
  const [sp, setSp] = useSearchParams();

  const query = useMemo(() => {
    const out: Record<string, any> = { ...defaults };
    for (const k of Object.keys(defaults)) {
      const d = defaults[k];
      const raw = sp.get(k);
      if (typeof d === "number") out[k] = num(raw, d);
      else if (typeof d === "boolean") out[k] = bool(raw, d);
      else out[k] = raw ?? d;
    }
    return out as T;
  }, [sp, defaults]);

  function setQuery(patch: Partial<T>, replace = true) {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(patch)) {
      const s = toStr(v);
      if (s === undefined) next.delete(k);
      else next.set(k, s);
    }
    setSp(next, { replace });
  }

  return { query, setQuery };
}
