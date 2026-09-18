import { formatDateTime, formatDate } from "../utils/helpers";

/**
 * CollectionTable — compact table of collection records.
 * Used by AdminDashboard (recent) and AdminTracking (full).
 */
export const CollectionTable = ({ collections, getUserById }) => {
  if (!collections || collections.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No collections found.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Request</th>
            <th className="px-3 py-2 text-left font-medium">Bin</th>
            <th className="px-3 py-2 text-left font-medium">Collector</th>
            <th className="px-3 py-2 text-left font-medium">Scanned</th>
            <th className="px-3 py-2 text-left font-medium">Collected</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr
              key={c.id}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <td className="px-3 py-2 font-medium">{c.requestId}</td>
              <td className="px-3 py-2">{c.binId}</td>
              <td className="px-3 py-2">
                {c.collectorName ||
                  (c.collectorId && getUserById ? getUserById(c.collectorId)?.name : c.collectorId) ||
                  "—"}
              </td>
              <td className="px-3 py-2">{formatDateTime(c.scannedAt)}</td>
              <td className="px-3 py-2">{formatDateTime(c.collectedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const RequestTable = ({ requests, showStatus = true }) => {
  if (!requests || requests.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No requests found.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-3 py-2 text-left font-medium">ID</th>
            <th className="px-3 py-2 text-left font-medium">Department</th>
            <th className="px-3 py-2 text-left font-medium">Bin</th>
            <th className="px-3 py-2 text-left font-medium">Priority</th>
            {showStatus && <th className="px-3 py-2 text-left font-medium">Status</th>}
            <th className="px-3 py-2 text-left font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr
              key={r.id}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <td className="px-3 py-2 font-medium">{r.id}</td>
              <td className="px-3 py-2">{r.department}</td>
              <td className="px-3 py-2">{r.binId}</td>
              <td className="px-3 py-2 capitalize">{r.priority}</td>
              {showStatus && <td className="px-3 py-2">{r.status}</td>}
              <td className="px-3 py-2">{formatDate(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default { CollectionTable, RequestTable };
