import { BarChart3, ClipboardList, Package, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { BinCard } from "../../components/BinCard";
import { RequestCard } from "../../components/BinCard";
import { Link } from "react-router-dom";

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

const StaffDashboard = () => {
  const { user } = useAuth();
    const { bins, requests, wasteRecords, binsNeedingCollection } = useAppData();

  const myRequests = requests.filter((r) => r.staffId === user?.id);
  const myPending = myRequests.filter((r) => r.status !== "collected" && r.status !== "completed");
  const myWasteRecords = wasteRecords.filter((r) => r.staffId === user?.id);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] || "Staff"}!`}
        subtitle="Medical Waste Collection & Segregation Dashboard"
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Bins needing collection"
          value={binsNeedingCollection.filter((b) => b.department === user?.department).length}
          color="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" />
        <StatCard icon={ClipboardList} label="My pending requests"
          value={myPending.length}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" />
        <StatCard icon={Package} label="My waste records"
          value={myWasteRecords.length}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" />
        <StatCard icon={BarChart3} label="Total bins"
          value={bins.length}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" />
      </div>

      {/* Bins needing collection */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bins Needing Collection
          </h2>
          <Link to="/staff/identify-waste" className="text-xs text-slate-500">or identify waste →</Link>
        </div>
        {binsNeedingCollection.length === 0 ? (
          <p className="text-sm text-slate-500">All bins are at safe levels. 🎉</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {binsNeedingCollection.slice(0, 6).map((b) => (
              <BinCard key={b.id} bin={b} />
            ))}
          </div>
        )}
      </div>

      {/* Recent requests */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            My Recent Requests
          </h2>
          <Link to="/staff/requests" className="text-xs text-primary-600 hover:text-primary-700">
            View all →
          </Link>
        </div>
        {myRequests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
            <p className="text-sm text-slate-500">No requests yet.</p>
            <Link to="/staff/collection-request" className="mt-2 inline-block text-sm text-primary-600">
              Create your first collection request →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myRequests.slice(0, 6).map((r) => (
              <Link key={r.id} to={`/staff/requests/${r.id}`} className="block">
                <RequestCard request={r} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
