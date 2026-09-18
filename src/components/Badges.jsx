import {
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  ShieldAlert,
  Package,
} from "lucide-react";
import {
  STATUSES,
  STATUS_LABELS,
  PRIORITY_LEVELS,
  PRIORITY_LABELS,
  WASTE_CATEGORY_LABELS,
  WASTE_CATEGORY_COLORS,
  BIN_STATUSES,
} from "../utils/constants";
import { getBinStatusLabel, getBinStatusColor } from "../utils/statusUtils";




const STATUS_ICONS = {
  [STATUSES.PENDING]: Clock,
  [STATUSES.ASSIGNED]: Clock,
  [STATUSES.IN_PROGRESS]: TrendingUp,
  [STATUSES.COLLECTED]: CheckCircle,
  [STATUSES.COMPLETED]: CheckCircle,
  [BIN_STATUSES.NORMAL]: CheckCircle,
  [BIN_STATUSES.ALMOST_FULL]: AlertTriangle,
  [BIN_STATUSES.COLLECTION_REQUIRED]: AlertOctagon,
};

const STATUS_COLORS = {
  [STATUSES.PENDING]: "bg-amber-100 text-amber-800 border-amber-200",
  [STATUSES.ASSIGNED]: "bg-blue-100 text-blue-800 border-blue-200",
  [STATUSES.IN_PROGRESS]: "bg-indigo-100 text-indigo-800 border-indigo-200",
  [STATUSES.COLLECTED]: "bg-cyan-100 text-cyan-800 border-cyan-200",
  [STATUSES.COMPLETED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.NORMAL]: "bg-slate-100 text-slate-700 border-slate-200",
  [PRIORITY_LEVELS.HIGH]: "bg-orange-100 text-orange-800 border-orange-200",
  [PRIORITY_LEVELS.EMERGENCY]: "bg-rose-100 text-rose-800 border-rose-200",
};

/** StatusBadge — workflow status (pending/assigned/in_progress/collected/completed)
 *  or bin status (normal/almost_full/collection_required). */
export const StatusBadge = ({ status, label, icon: IconProp }) => {
  const isBin = Object.values(BIN_STATUSES).includes(status);
  const colorClass = isBin
    ? getBinStatusColor(status)
    : STATUS_COLORS[status] || "bg-slate-100 text-slate-700 border-slate-200";
  const text = label || (isBin ? getBinStatusLabel(status) : STATUS_LABELS[status] || status);
  const Icon = IconProp || STATUS_ICONS[status] || ShieldAlert;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClass}`}
    >
      <Icon size={12} />
      {text}
    </span>
  );
};

/** PriorityBadge — normal / high / emergency */
export const PriorityBadge = ({ priority }) => {
  const colorClass =
    PRIORITY_COLORS[priority] ||
    "bg-slate-100 text-slate-700 border-slate-200";
  const text = PRIORITY_LABELS[priority] || priority;
  const Icon = priority === PRIORITY_LEVELS.EMERGENCY ? ShieldAlert : Package;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClass}`}
    >
      <Icon size={12} />
      {text}
    </span>
  );
};

/** CategoryBadge — waste category with color coding */
export const CategoryBadge = ({ category, label, size = "md" }) => {
  const colorClass = WASTE_CATEGORY_COLORS[category] || "bg-slate-200 text-slate-800";
  const text = label || WASTE_CATEGORY_LABELS[category] || category;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-medium ${colorClass} ${textSize}`}
    >
      {text}
    </span>
  );
};
