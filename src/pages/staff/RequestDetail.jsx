import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, User as UserIcon, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../../components/Badges";
import StatusTimeline from "../../components/StatusTimeline";
import { formatDateTime } from "../../utils/helpers";
import { STATUSES } from "../../utils/constants";

const StaffRequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { requestById, binById, getUserById, updateCollectionRequest } = useAppData();
  const [note, setNote] = useState("");

  const request = requestById ? requestById(id) : null;

  if (!request) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Request &ldquo;{id}&rdquo; not found.</p>
        <Link to="/staff/requests" className="text-primary-600 hover:text-primary-700">
          ← Back to requests
        </Link>
      </div>
    );
  }

  const bin = request.binId ? binById(request.binId) : null;
  const collector = request.collectorId ? getUserById(request.collectorId) : null;

  const addNote = () => {
    if (!note.trim()) return;
    const existing = request.notes ? `${request.notes}\n` : "";
    updateCollectionRequest(request.id, {
      notes: existing + `[${user?.name || "Staff"}] ${note}`,
    });
    setNote("");
  };

  return (
    <div>
      <PageHeader title={request.id} subtitle="Collection request details" backTo="/staff/requests" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <CategoryBadge category={request.category} />
              <PriorityBadge priority={request.priority} />
              <StatusBadge status={request.status} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" />Created {formatDateTime(request.createdAt)}</div>
              <div className="flex items-center gap-2"><UserIcon size={16} className="text-slate-400" />{request.staffName}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" />{request.department} · Bin {request.binId}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" />Fill {request.fillLevel}% · Qty {request.quantity}</div>
              {collector && <div className="flex items-center gap-2"><UserIcon size={16} className="text-slate-400" />Collector: {collector.name}</div>}
            </div>
            {request.notes && (
              <div className="mt-4">
                <h4 className="mb-1 text-xs font-semibold text-slate-500">Notes</h4>
                <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{request.notes}</p>
              </div>
            )}
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold text-slate-500">Status Timeline</h4>
              <StatusTimeline status={request.status} />
            </div>
          </div>

          {request.status !== STATUSES.COMPLETED && request.status !== STATUSES.COLLECTED && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Add a note</h3>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note to this request..."
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" rows={3} />
              <button onClick={addNote} disabled={!note.trim()}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
                <Send size={14} /> Add note
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Bin Info</h3>
            {bin ? (
              <div className="space-y-1.5 text-sm">
                <p><span className="text-slate-500">ID:</span> {bin.id}</p>
                <p><span className="text-slate-500">Dept:</span> {bin.department}</p>
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

export default StaffRequestDetail;
