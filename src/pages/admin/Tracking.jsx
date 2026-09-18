import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { RequestTable, CollectionTable } from "../../components/Tables";
import { StatusBadge } from "../../components/Badges";
import { STATUSES } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";

const STATUS_TABS = [
  { key: "all", label: "All Requests" },
  { key: STATUSES.PENDING, label: "Pending" },
  { key: STATUSES.ASSIGNED, label: "Assigned" },
  { key: STATUSES.IN_PROGRESS, label: "In Progress" },
  { key: STATUSES.COLLECTED, label: "Collected" },
  { key: STATUSES.COMPLETED, label: "Completed" },
];

const AdminTracking = () => {
  const { requests, collections, getUserById, bins } = useAppData();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = requests;
    if (activeTab !== "all") {
      list = list.filter((r) => r.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          (r.binId || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, activeTab, search]);
  
  const recentCollections = collections.slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Tracking Center"
        subtitle="Monitor all collection requests and collection history across the hospital."
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "border-primary-600 bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {STATUS_TABS.map((t) => {
          const count =
            t.key === "all"
              ? requests.length
              : requests.filter((r) => r.status === t.key).length;
          return (
            <div
              key={t.key}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.label}</p>
            </div>
          );
        })}
      </div>

      {/* Requests table */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Collection Requests
        </h2>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No requests match the current filter.
          </p>
        ) : (
          <RequestTable requests={filtered} />
        )}
      </div>

      {/* Recent collections */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Recent Collections
          </h2>
          <Link
            to="/admin/analytics"
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Full analytics &rarr;
          </Link>
        </div>
        {recentCollections.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No collections recorded yet.</p>
        ) : (
          <CollectionTable collections={recentCollections} getUserById={getUserById} />
        )}
      </div>

      {/* Bin activity */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Bin Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Bin ID</th>
                <th className="px-3 py-2 text-left font-medium">Department</th>
                <th className="px-3 py-2 text-left font-medium">Fill</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Last Collection</th>
              </tr>
            </thead>
            <tbody>
              {bins.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <td className="px-3 py-2 font-medium">{b.id}</td>
                  <td className="px-3 py-2">{b.department}</td>
                  <td className="px-3 py-2">{b.fillLevel}%</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {b.lastCollection ? formatDate(b.lastCollection) : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTracking;
