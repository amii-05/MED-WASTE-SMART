import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/**
 * StatCard — a metric card with an icon and optional trend indicator.
 */
const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const isPositive = trend && trend > 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
      {trend !== undefined && (
        <div
          className={`mt-1 flex items-center gap-1 text-xs ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}% vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
