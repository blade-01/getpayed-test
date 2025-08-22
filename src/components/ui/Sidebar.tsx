import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

type SidebarLinkItem = { to: string; label: string; icon?: React.ReactNode };

const LINKS: SidebarLinkItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <ChartIcon /> },
  { to: "/orders", label: "Orders", icon: <TableIcon /> }
];

export default function Sidebar() {
  // Persist collapsed state (desktop)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("sidebar:collapsed");
      return v ? JSON.parse(v) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("sidebar:collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside
        className={classNames(
          "hidden md:flex md:flex-col border-r bg-white transition-all duration-200",
          collapsed ? "md:w-16" : "md:w-64",
          "md:sticky md:top-0 md:h-[100dvh] md:overflow-y-auto"
        )}
      >
        <div className="flex h-14 items-center px-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded bg-indigo-600" />
            {!collapsed && (
              <span className="font-semibold text-sm">TaskFlow Analytics</span>
            )}
          </div>

          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto inline-flex items-center justify-center rounded p-2 text-gray-600 hover:bg-gray-100"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronIcon rotated={collapsed} />
          </button>
        </div>

        <nav className="flex-1 p-2">
          {LINKS.map((l) => (
            <SidebarLink
              key={l.to}
              to={l.to}
              icon={l.icon}
              collapsed={collapsed}
            >
              {l.label}
            </SidebarLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t p-3 text-xs text-gray-500">
            © {new Date().getFullYear()} TaskFlow
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed inset-x-0 top-0 z-30 bg-white border-b">
        <div className="h-14 flex items-center gap-3 px-3">
          <button
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100"
          >
            <BurgerIcon />
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded bg-indigo-600" />
            <span className="font-semibold text-sm">TaskFlow Analytics</span>
          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        id="mobile-drawer"
        className={classNames(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-14 items-center px-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded bg-indigo-600" />
            <span className="font-semibold text-sm">TaskFlow Analytics</span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="ml-auto inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="p-2">
          {LINKS.map((l) => (
            <SidebarLink
              key={l.to}
              to={l.to}
              icon={l.icon}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </SidebarLink>
          ))}
        </nav>
      </div>
    </>
  );
}

function SidebarLink({
  to,
  icon,
  children,
  collapsed,
  onClick
}: {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        classNames(
          "flex items-center gap-3 rounded px-3 py-2 text-sm",
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-700 hover:bg-gray-50"
        )
      }
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      {!collapsed && <span>{children}</span>}
    </NavLink>
  );
}

/* Icons */
function ChevronIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames(
        "h-5 w-5 transition-transform",
        rotated && "rotate-180"
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </svg>
  );
}
function TableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16" />
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}
