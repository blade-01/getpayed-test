type Channel = "web" | "mobile" | "store" | (string & {});

function channelClasses(c: string) {
  const s = c.toLowerCase();
  if (s === "web") return "bg-sky-50 text-sky-700 border-sky-200";
  if (s === "mobile")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "store") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function channelIcon(c: string) {
  const s = c.toLowerCase();
  if (s === "web") return "🌐";
  if (s === "mobile") return "📱";
  if (s === "store") return "🏬";
  return "🔘";
}

export function ChannelBadge({ channel }: { channel: Channel }) {
  const label = String(channel)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium " +
        channelClasses(String(channel))
      }
      title={label}
    >
      <span aria-hidden>{channelIcon(String(channel))}</span>
      <span>{label}</span>
    </span>
  );
}
