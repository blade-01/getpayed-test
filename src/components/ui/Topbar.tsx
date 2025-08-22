import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "Orders"
};

export default function Topbar() {
  const location = useLocation();
  const title = titles[location.pathname] ?? "App";

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm hidden md:block">
      <div className="px-4 py-[13.5px]">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
    </header>
  );
}
