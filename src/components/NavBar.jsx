import { Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

/**
 * NavBar — fixed top header shared by all role layouts.
 * `roleLabel` ("Staff"|"Collector"|"Admin") controls the profile route.
 */
const NavBar = ({ onMenuToggle = () => {}, roleLabel = "" }) => {
  const { theme, toggleTheme } = useTheme();

  const profilePath =
    roleLabel === "Staff"
      ? "/staff/profile"
      : roleLabel === "Collector"
      ? "/collector/profile"
      : "/admin/profile";

  return (
    <header className="fixed top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-300 dark:hover:bg-slate-700"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"
        >
          <span className="text-xl">🗑️</span>
          <span className="hidden sm:inline">MedWaste Smart</span>
        </Link>
      </div>

      {/* Right: theme + notifications + user */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Toggle theme"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <NotificationBell />
        <UserMenu profilePath={profilePath} />
      </div>
    </header>
  );
};

export default NavBar;
