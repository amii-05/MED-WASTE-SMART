import { STATUSES, STATUS_LABELS } from "../utils/constants";
import { getStatusStep } from "../utils/statusUtils";

const ORDERED = [
  STATUSES.PENDING,
  STATUSES.ASSIGNED,
  STATUSES.IN_PROGRESS,
  STATUSES.COLLECTED,
  STATUSES.COMPLETED,
];

/**
 * StatusTimeline — horizontal stepper showing the collection workflow.
 * Highlights steps up to & including the current `status`.
 */
const StatusTimeline = ({ status }) => {
  const step = getStatusStep(status);

  return (
    <div className="flex items-center justify-between">
      {ORDERED.map((s, i) => {
        const done = i < step;
        const active = i === step;
        const isLast = i === ORDERED.length - 1;

        return (
          <div key={s} className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              {!isLast && (
                <div
                  className={`h-0.5 w-10 ${
                    done ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  done || active
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-700"
                }`}
              >
                {i + 1}
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 w-10 ${
                    done ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-1 text-center text-xs ${
                done || active
                  ? "font-medium text-primary-700 dark:text-primary-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {STATUS_LABELS[s] || s}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
