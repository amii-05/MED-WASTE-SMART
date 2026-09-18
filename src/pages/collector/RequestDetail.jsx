import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../../components/Badges";
import StatusTimeline from "../../components/StatusTimeline";
import { formatDateTime } from "../../utils/helpers";
import { STATUSES } from "../../utils/constants";

const CollectorRequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    requestById,
    binById,
    getUserById,
    assignCollector,
    startCollection,
    completeCollection,
  } = useAppData();
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = requestById ? requestById(id) : null;

  if (!request) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Request &ldquo;{id}&rdquo; not found.</p>
        <Link to="/collector/dashboard" className="text-primary-600 hover:text-primary-700">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const bin = request.binId ? binById(request.binId) : null;
  const isMine = request.collectorId === user?.id;

  const canAccept = request.status === STATUSES.PENDING;
  const canStart = request.status === STATUSES.ASSIGNED && isMine;
  const canComplete =
    (request.status === STATUSES.IN_PROGRESS ||
      request.status === STATUSES.ASSIGNED) &&
    isMine;

  const handleAction = async () => {
    setLoading(true);
    setActionError("");
    try {
      if (canAccept) {
        await assignCollector(request.id, user.id);
      } else if (canStart) {
        await startCollection(request.id, user.id);
      } else if (canComplete) {
        await completeCollection(request.id, request.binId, user.name);
      }
    } catch (err) {
      setActionError(err.message || "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const actionLabel = canAccept
    ? "Accept Request"
    : canStart
    ? "Start Collection"
    : canComplete
    ? "Complete Collection"
    : null;

  return (
    <div>
      <PageHeader title={request.id} subtitle="Collection request" backTo="/collector/dashboard" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <CategoryBadge category={request.category} />
              <PriorityBadge priority={request.priority} />
              <StatusBadge status={request.status} />
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> Created {formatDateTime(request.createdAt)}</div>
              <div className="flex items-center gap-2"><UserIcon size={16} className="text-slate-400" /> Staff: {request.staffName}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {request.department} · Bin {request.binId}</div>
              {request.collectorId && (
                <div className="flex items-center gap-2"><UserIcon size={16} className="text-slate-400" /> Collector: {getUserById(request.collectorId)?.name}</div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold text-slate-500">Status Timeline</h4>
              <StatusTimeline status={request.status} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Actions</h3>
            {actionLabel ? (
              <>
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Processing…" : actionLabel}
                </button>
                {actionError && <p className="mt-2 text-xs text-rose-600">{actionError}</p>}
              </>
            ) : request.status === STATUSES.COMPLETED ? (
              <p className="text-sm text-emerald-600">✅ Collection completed and recorded.</p>
            ) : request.status === STATUSES.COLLECTED ? (
              <p className="text-sm text-emerald-600">✔ Waste collected. Awaiting confirmation.</p>
            ) : (
              <p className="text-sm text-slate-500">No actions available.</p>
            )}
          </div>
        </div>

        {/* Bin info */}
        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Bin Info</h3>
            {bin ? (
              <div className="space-y-1.5 text-sm">
                <p><span className="text-slate-500">ID:</span> {bin.id}</p>
                <p><span className="text-slate-500">Department:</span> {bin.department}</p>
                <p><span className="text-slate-500">Location:</span> {bin.location}</p>
                <CategoryBadge category={bin.category} />
              </div>
            ) : <p className="text-sm text-slate-500">Bin data unavailable.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorRequestDetail;
