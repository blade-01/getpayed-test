export type RangePreset = "7d" | "30d" | "90d" | "custom";
export type Period = "" | RangePreset;

export function todayYYYYMMDD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function daysAgoYYYYMMDD(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function presetToRange(
  preset: RangePreset,
  custom?: { from?: string; to?: string }
) {
  if (preset === "custom") {
    return { from: custom?.from, to: custom?.to };
  }
  switch (preset) {
    case "7d":
      return { from: daysAgoYYYYMMDD(6), to: todayYYYYMMDD() };
    case "30d":
      return { from: daysAgoYYYYMMDD(29), to: todayYYYYMMDD() };
    case "90d":
      return { from: daysAgoYYYYMMDD(89), to: todayYYYYMMDD() };
  }
}
