import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner — used both inline and as a full-page overlay.
 * App.jsx renders <LoadingSpinner full /> while waiting for auth + lazy chunks.
 */
const LoadingSpinner = ({ full = false, size = 32, text = "Loading…" }) => {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2.5 text-slate-500 dark:text-slate-400">
      <Loader2
        className="animate-spin text-primary-500"
        size={size}
        strokeWidth={1.5}
      />
      {text ? (
        <span className="text-sm font-medium">{text}</span>
      ) : null}
    </div>
  );

  if (full) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-sm dark:bg-slate-900/75">
        {inner}
      </div>
    );
  }
  return inner;
};

export default LoadingSpinner;
