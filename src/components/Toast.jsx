import { useState, useEffect } from "react";
import {
  X,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const TYPE_ICONS = {
  info: Info,
  request: AlertCircle,
  urgent: AlertTriangle,
  warning: AlertTriangle,
  update: CheckCircle,
  success: CheckCircle,
  error: AlertCircle,
};

const TYPE_COLORS = {
  info: "border-blue-500 bg-blue-50 dark:bg-blue-900/30",
  request: "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30",
  urgent: "border-rose-500 bg-rose-50 dark:bg-rose-900/30",
  warning: "border-amber-500 bg-amber-50 dark:bg-amber-900/30",
  update: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
  success: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
  error: "border-rose-500 bg-rose-50 dark:bg-rose-900/30",
};

const TYPE_ICON_BG = {
  info: "bg-blue-100 dark:bg-blue-900/50",
  request: "bg-indigo-100 dark:bg-indigo-900/50",
  urgent: "bg-rose-100 dark:bg-rose-900/50",
  warning: "bg-amber-100 dark:bg-amber-900/50",
  update: "bg-emerald-100 dark:bg-emerald-900/50",
  success: "bg-emerald-100 dark:bg-emerald-900/50",
  error: "bg-rose-100 dark:bg-rose-900/50",
};

const IconFor = (type) => TYPE_ICONS[type] || Info;

/**
 * A single dismissible toast. Clicking navigates to the notification link
 * (if any) and marks it read.
 */
const ToastItem = ({ notif, onRemove, onClick }) => {
  const Icon = IconFor(notif.type);
  const colorClass = TYPE_COLORS[notif.type] || TYPE_COLORS.info;
  const iconBg = TYPE_ICON_BG[notif.type] || TYPE_ICON_BG.info;

  return (
    <div
      role="status"
      className={`pointer-events-auto w-full max-w-sm rounded-lg border-l-4 p-3.5 shadow-lg text-slate-900 dark:text-slate-100 ${colorClass}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon size={18} className="text-slate-700 dark:text-slate-200" />
        </div>
        <div className="flex-1 truncate">
          <p className="font-semibold">{notif.title || "Notification"}</p>
          <p className="text-sm opacity-85">{notif.message}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notif);
          }}
          className="ml-2 rounded p-1 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

/**
 * ToastContainer — renders the latest unread notifications as floating toasts.
 * Each auto-dismisses after 10s and can be manually dismissed. Clicking
 * navigates to the link (if any) and marks it read.
 */
export const ToastContainer = () => {
  const { notifications, markRead } = useNotifications();
  const [visible, setVisible] = useState([]);
  const navigate = useNavigate();

  // Surface the latest unread notifications (max 4) as toasts.
  useEffect(() => {
    const unread = notifications
      .filter((n) => !n.read)
      .slice(0, 4)
      .map((n) => n.id);

    setVisible((prev) => {
      const merged = [...prev];
      unread.forEach((id) => {
        if (!merged.find((t) => t.id === id)) {
          const notif = notifications.find((n) => n.id === id);
          if (notif) merged.push({ ...notif, ts: Date.now() });
        }
      });
      // Drop ones that are now read
      return merged.filter((t) => unread.includes(t.id));
    });
  }, [notifications]);

  useEffect(() => {
    if (visible.length === 0) return;
    const timer = setTimeout(() => {
      setVisible((prev) => {
        const [first, ...rest] = prev;
        markRead(first.id);
        return rest;
      });
    }, 10000);
    return () => clearTimeout(timer);
  }, [visible, markRead]);

  const handleRemove = (notif) => {
    markRead(notif.id);
    setVisible((prev) => prev.filter((t) => t.id !== notif.id));
  };

  const handleClick = (notif) => {
    markRead(notif.id);
    setVisible((prev) => prev.filter((t) => t.id !== notif.id));
    if (notif.link) {
      navigate(notif.link);
    }
  };

  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col-reverse gap-2 pointer-events-none">
      {visible.map((notif) => (
        <div key={notif.id} className="pointer-events-auto">
          <ToastItem
            notif={notif}
            onRemove={handleRemove}
            onClick={() => handleClick(notif)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
