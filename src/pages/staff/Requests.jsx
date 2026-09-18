import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { RequestCard } from "../../components/BinCard";
import { STATUSES } from "../../utils/constants";

const STATUS_TABS = [
  { key: "all", label: "All Requests" },
  { key: STATUSES.PENDING, label: "Pending" },
  { key: STATUSES.ASSIGNED, label: "Assigned" },
  { key: STATUSES.IN_PROGRESS, label: "In Progress" },
  { key: STATUSES.COLLECTED, label: "Collected" },
  { key: STATUSES.COMPLETED, label: "Completed" },
];

const StaffRequests = () => {
  const { userId } = useAuth();
    const { requests } = useAppData();
  const [activeTab, setActiveTab] = useState("all");

  const mine = requests.filter((r) => r.staffId === userId);
  const filtered =
    activeTab === "all"
      ? mine
      : mine.filter((r) => r.status === activeTab);

  return (
    <div>
      <PageHeader title="My Requests" subtitle="Collection requests you have submitted" />

      {/* Status tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
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

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p>No requests match this filter.</p>
          <Link
            to="/staff/collection-request"
            className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
          >
            + Create a new collection request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} to={`/staff/requests/${r.id}`} className="block">
              <RequestCard request={r} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffRequests;
