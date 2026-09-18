import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

/**
 * Sidebar — role-aware navigation.
 * `items` is an array of { label, path, icon }.
 * Desktop: fixed docked panel. Mobile: slide-over drawer controlled by
 * `mobileOpen` / `onClose`.
 */
const Sidebar = ({
  items = [],
  brand = "MedWaste Smart",
  mobileOpen = false,
  onClose = () => {},
}) => {
  const renderLinks = (isMobile = false) =>
    items.map((it) => {
      const Icon = it.icon || Menu;
      return (
        <NavLink
          key={it.path}
          to={it.path}
          onClick={isMobile ? onClose : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                : "text-slate-700 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-primary-300"
            }`
          }
        >
          <Icon size={18} />
          <span>{it.label}</span>
        </NavLink>
      );
    });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto bg-white p-5 pt-20 shadow border-r border-slate-200 dark:bg-slate-800 dark:border-slate-700 md:flex">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Menu size={18} />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {brand}
          </span>
        </div>
        <nav className="flex flex-col gap-1">{renderLinks()}</nav>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {mobileOpen && (
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <aside className="relative z-40 flex h-full w-64 flex-col gap-6 overflow-y-auto bg-white p-5 pt-20 shadow-xl dark:bg-slate-800">
          <nav className="flex flex-col gap-1">{renderLinks(true)}</nav>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
