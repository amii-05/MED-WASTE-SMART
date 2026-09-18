import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { CategoryBadge, StatusBadge, PriorityBadge } from "./Badges";
import { formatDateTime } from "../utils/helpers";
import { STATUSES } from "../utils/constants";

/**
 * ScannedBinView — shows a scanned bin's details + its requests with
 * collector action buttons (accept / start / complete).
 */
const ScannedBinView = ({ binId, bin, onReset }) => {
  const { user } = useAuth();
  const {
    requests,
    assignCollector,
    startCollection,
    completeCollection,
  } = useAppData();
  const [loading, setLoading] = useState(null);

  const binRequests = requests.filter((r) => r.binId === binId);

  const actionLabel = (r) => {
    const isMine = r.collectorId === user?.id;
    if (r.status === STATUSES.PENDING) return "Accept";
    if (r.status === STATUSES.ASSIGNED && isMine) return "Start";
    if (
      (r.status === STATUSES.IN_PROGRESS || r.status === STATUSES.ASSIGNED) &&
      isMine
    )
      return "Complete";
    return null;
  };

  const handleAction = async (r) => {
    setLoading(r.id);
    const isMine = r.collectorId === user?.id;
    try {
      if (r.status === STATUSES.PENDING) {
        await assignCollector(r.id, user.id);
      } else if (r.status === STATUSES.ASSIGNED && isMine) {
        await startCollection(r.id, user.id);
      } else if (
        (r.status === STATUSES.IN_PROGRESS ||
          r.status === STATUSES.ASSIGNED) &&
        isMine
      ) {
        await completeCollection(r.id, r.binId, user.name);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const fillColor = (f) =>
    f >= 90 ? "#ef4444" : f >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Scanned: {binId}
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
        >
          Scan another
        </button>
      </div>

      {bin ? (
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {bin.id}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {bin.department} · {bin.location}
              </p>
            </div>
            <CategoryBadge category={bin.category} />
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Fill: {bin.fillLevel}%</span>
              <span>Cap: {bin.capacity}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded"
                style={{ width: `${bin.fillLevel}%`, backgroundColor: fillColor(bin.fillLevel) }}
              />
            </div>
          </div>
        </div>
      ) : (
                  <p className="text-sm text-rose-600">Bin &ldquo;{binId}&rdquo; not found.</p>
      )}

      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Requests ({binRequests.length})
        </h4>
        {binRequests.length === 0 ? (
          <p className="text-sm text-slate-500">No requests for this bin.</p>
        ) : (
          <div className="space-y-3">
            {binRequests.map((r) => {
              const label = actionLabel(r);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {r.id}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <PriorityBadge priority={r.priority} />
                      <CategoryBadge category={r.category} size="sm" />
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(r.createdAt)} · {r.department}
                    </p>
                  </div>
                  {label && (
                    <button
                      onClick={() => handleAction(r)}
                      disabled={loading === r.id}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                    >
                      {loading === r.id ? "…" : label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannedBinView;
