import { getFillLevelColor } from "../utils/statusUtils";

/**
 * FillLevelBar — a responsive bar showing how full a bin is.
 * `value` 0-100, shows label + percentage.
 */
const FillLevelBar = ({ value = 0, capacity = 120, showLabel = true, size = "md" }) => {
  const fill = Math.max(0, Math.min(100, Number(value) || 0));
  const colorClass = getFillLevelColor(fill);
  const heightClass =
    size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Fill: {Math.round(fill)}% ({Math.round((fill / 100) * capacity)} /{" "}
            {capacity} units)
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${heightClass}`}
      >
        <div
          className={`h-full w-${Math.round(fill)} ${colorClass} transition-all duration-500`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
};

export default FillLevelBar;
