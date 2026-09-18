import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

/**
 * NotificationBell — bell icon with a dropdown of recent notifications.
 * Reads directly from NotificationContext so the NavBar stays small.
 */
const NotificationBell = () => {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const recent = notifications.slice(0, 8);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!notifications) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Notifications ({unreadCount} unread)
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
                No notifications.
              </p>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                  className="block w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                        n.read ? "bg-slate-300" : "bg-primary-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                notifications.forEach((n) => !n.read && markRead(n.id));
                setOpen(false);
              }}
              className="block w-full border-t border-slate-200 px-3 py-2 text-center text-xs font-medium text-primary-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
