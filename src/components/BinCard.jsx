import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryBadge, StatusBadge } from "./Badges";
import FillLevelBar from "./FillLevelBar";
import { formatDate } from "../utils/helpers";

const BIN_ICON_MAP = {
  normal: Clock,
  almost_full: Clock,
  collection_required: Clock,
};

/**
 * BinCard — compact summary of a medical waste bin.
 */
export const BinCard = ({ bin, showLink = false, linkPath = null }) => {
  const Icon = BIN_ICON_MAP[bin.status] || Clock;

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <Icon size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {bin.id}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {bin.location || bin.department}
            </p>
          </div>
        </div>
        <CategoryBadge category={bin.category} size="sm" />
      </div>

      <div className="mt-1">
        <FillLevelBar
          value={bin.fillLevel}
          capacity={bin.capacity}
          showLabel
          size="sm"
        />
      </div>

      {showLink && linkPath && (
        <Link
          to={linkPath}
          className="mt-auto text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View details →
        </Link>
      )}
    </div>
  );
};

/**
 * RequestCard — summary of a collection request.
 */
export const RequestCard = ({ request, onClickAction = null }) => {
  return (
    <div
      onClick={onClickAction}
      className={`relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${
        onClickAction ? "cursor-pointer" : ""
      } ${request.priority === "emergency" ? "border-l-4 border-rose-500" : ""}`}
    >
      {request.priority === "emergency" && (
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
            EMERGENCY
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Clock size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {request.id}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {request.department} · Bin {request.binId}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={request.category} size="sm" />
        <StatusBadge status={request.status} size="sm" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300">
        Fill: {request.fillLevel}% · Qty: {request.quantity}
      </p>

      {request.notes && (
        <p className="text-xs italic text-slate-500 dark:text-slate-400">
          &ldquo;{request.notes}&rdquo;
        </p>
      )}

      <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Created {formatDate(request.createdAt)}</span>
      </div>
    </div>
  );
};

export default BinCard;
