import { Link } from "react-router-dom";

/**
 * CollectionSuccess — shown after a collection request is submitted.
 */
const CollectionSuccess = ({ request, onReset }) => {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div className="mb-4 text-5xl">✅</div>
      <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
        {request.id}
      </h2>
      <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
        Notification sent to collectors &amp; admin.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to={`/staff/requests/${request.id}`}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          View request
        </Link>
        <button
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600"
        >
          Create another
        </button>
      </div>
    </div>
  );
};

export default CollectionSuccess;
