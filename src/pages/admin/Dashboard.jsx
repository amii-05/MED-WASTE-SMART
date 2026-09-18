import {
  AlertTriangle,
  ClipboardList,
  PackageCheck,
  Recycle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { BinCard } from "../../components/BinCard";
import { CollectionTable } from "../../components/Tables";
import { formatDate } from "../../utils/helpers";

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    bins,
    requests,
    collections,
    wasteRecords,
    binsNeedingCollection,
  } = useAppData();

  // Completed collections this week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const completedThisWeek = collections.filter(
    (c) => new Date(c.collectedAt) >= weekAgo
  ).length;

  const recentRequests = requests.slice(0, 4);
  const recentCollections = collections.slice(0, 4);

  // Simple trend (placeholder demo values)
  const trend = { bins: 12, requests: -4, collections: 18 };

  return (
    <div>
      <PageHeader
        title={`Admin Dashboard`}
        subtitle={`Managing ${bins.length} bins across ${user?.department || "the hospital"}`}
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={AlertTriangle}
          label="Bins Needing Collection"
          value={binsNeedingCollection.length}
          color="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
          trend={trend.bins}
        />
        <StatCard
          icon={ClipboardList}
          label="Total Requests"
          value={requests.length}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
          trend={trend.requests}
        />
        <StatCard
          icon={PackageCheck}
          label="Collections (7d)"
          value={completedThisWeek}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          trend={trend.collections}
        />
        <StatCard
          icon={Recycle}
          label="Waste Records"
          value={wasteRecords.length}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        />
      </div>

      {/* Bins needing collection */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bins Needing Collection
          </h2>
          <Link
            to="/admin/bins"
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Manage bins →
          </Link>
        </div>
        {binsNeedingCollection.length === 0 ? (
          <p className="text-sm text-slate-500">All bins are at safe levels.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {binsNeedingCollection.slice(0, 6).map((b) => (
              <BinCard key={b.id} bin={b} />
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recent Requests
            </h2>
            <Link
              to="/admin/tracking"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500">No requests yet.</p>
            ) : (
              recentRequests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.id}</span>
                    <span className="text-xs">{formatDate(r.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {r.department} · {r.priority} priority · {r.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recent Collections
            </h2>
            <Link
              to="/admin/tracking"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              View all →
            </Link>
          </div>
          {recentCollections.length === 0 ? (
            <p className="text-sm text-slate-500">No collections yet.</p>
          ) : (
            <CollectionTable collections={recentCollections} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
