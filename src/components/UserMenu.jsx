import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * UserMenu — avatar dropdown with a Profile link and Logout button.
 */
const UserMenu = ({ profilePath = "/profile" }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <img
          src={user?.avatar || "https://i.pravatar.com/150?img=72"}
          alt={user?.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden text-sm font-medium md:inline-block">
          {user?.name?.split(" ")[0] || "User"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role} · {user?.department}
            </p>
          </div>
          <Link
            to={profilePath}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            onClick={() => setOpen(false)}
          >
            <User size={16} /> Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex w-full items-center justify-start gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
