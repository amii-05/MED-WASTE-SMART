import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ClipboardList, Users, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { RequestCard } from "../../components/BinCard";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  </div>
);

const CollectorDashboard = () => {
  const { user } = useAuth();
  const { requests, assignCollector, collections } = useAppData();
  const [actionLoading, setActionLoading] = useState(null);

  const pending = requests.filter((r) => r.status === "pending");
  const mine = requests.filter(
    (r) => r.collectorId === user?.id && !["collected", "completed"].includes(r.status)
  );
  const completedToday = collections.filter((c) => {
    const d = new Date(c.collectedAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const handleAccept = async (r) => {
    setActionLoading(r.id);
    try {
      await assignCollector(r.id, user.id);
    } catch (e) { console.error(e); }
    setActionLoading(null);
  };

  return (
    <div>
      <PageHeader title="Collector Dashboard" subtitle={`Hi, ${user?.name?.split(" ")[0] || "Collector"}!`} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Available Requests" value={pending.length}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" />
        <StatCard icon={Users} label="My Active Assignments" value={mine.length}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" />
        <StatCard icon={CheckCircle} label="Collected Today" value={completedToday}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" />
        <StatCard icon={Clock} label="Current Status" value={mine.length > 0 ? "Busy" : "Available"}
          color="bg-slate-100 text-slate-700 dark:bg-slate-700" />
      </div>

      {/* Available requests */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Available Requests
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending collection requests. 🎉</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((r) => (
              <div key={r.id} className="relative">
                <Link to={`/collector/requests/${r.id}`} className="block">
                  <RequestCard request={r} />
                </Link>
                <button
                  onClick={() => handleAccept(r)}
                  disabled={actionLoading === r.id}
                  className="absolute top-3 right-3 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My assignments */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          My Assignments
        </h2>
        {mine.length === 0 ? (
          <p className="text-sm text-slate-500">You have no active assignments.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((r) => (
              <Link key={r.id} to={`/collector/requests/${r.id}`} className="block">
                <RequestCard request={r} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorDashboard;
