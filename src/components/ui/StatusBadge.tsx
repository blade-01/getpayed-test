type Status =
  | "completed"
  | "pending"
  | "shipped"
  | "cancelled"
  | "refunded"
  | (string & {});

function statusClasses(status: string) {
  const s = status.toLowerCase();
  if (s === "completed") return "bg-green-50 text-green-700 border-green-200";
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "shipped") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "cancelled") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "refunded") return "bg-violet-50 text-violet-700 border-violet-200";
  return "bg-gray-50 text-gray-700 border-gray-200"; // fallback
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium " +
        statusClasses(status)
      }
      title={String(status)}
    >
      {String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}
