import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PageHeader — consistent page header with optional back button and action slot.
 * @param {string} title
 * @param {string} subtitle
 * @param {string} backTo   — if provided, renders a back link
 * @param {node}   actions  — right-side action buttons
 */
const PageHeader = ({ title, subtitle, backTo, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {backTo && (
          <Link
            to={backTo}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
          >
            <ChevronLeft size={18} />
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
