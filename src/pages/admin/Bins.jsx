import { useState } from "react";
import { Plus, Trash2, Edit, QrCode } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import BinForm from "../../components/BinForm";
import QrCodeModal from "../../components/QrCodeModal";
import { CategoryBadge } from "../../components/Badges";
import { getBinStatusLabel } from "../../utils/statusUtils";

const AdminBins = () => {
  const { bins, addBin, removeBin, updateBin } = useAppData();
    const [showForm, setShowForm] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [qrBin, setQrBin] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const handleSave = (payload) => {
    setLoadingId("save");
    try {
      if (editingBin) {
        updateBin(editingBin.id, payload);
      } else {
        addBin(payload);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
      setShowForm(false);
      setEditingBin(null);
    }
  };

  const handleEdit = (bin) => {
    setEditingBin(bin);
    setShowForm(true);
  };

  const handleDelete = async (bin) => {
    if (!window.confirm(`Delete bin ${bin.id}? This cannot be undone.`)) return;
    setLoadingId(bin.id);
    try {
      await removeBin(bin.id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Bins"
        subtitle="Manage all medical waste bins."
        actions={
          <button
                        onClick={() => { setShowForm(true); setEditingBin(null); }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Plus size={18} /> Add Bin
          </button>
        }
      />

      {bins.length === 0 ? (
        <p className="text-sm text-slate-500">No bins registered.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-3 py-2 text-left font-medium">ID</th>
                <th className="px-3 py-2 text-left font-medium">Department</th>
                <th className="px-3 py-2 text-left font-medium">Location</th>
                <th className="px-3 py-2 text-left font-medium">Category</th>
                <th className="px-3 py-2 text-left font-medium">Fill</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Last Collection</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bins.map((bin) => (
                <tr key={bin.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-3 py-2 font-medium">{bin.id}</td>
                  <td className="px-3 py-2">{bin.department}</td>
                  <td className="px-3 py-2">{bin.location}</td>
                  <td className="px-3 py-2"><CategoryBadge category={bin.category} size="sm" /></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bin.fillLevel}
                        onChange={(e) => updateBin(bin.id, { fillLevel: Number(e.target.value) })}
                        className="w-16 accent-primary-600"
                      />
                      <span>{bin.fillLevel}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{getBinStatusLabel(bin.status)}</td>
                  <td className="px-3 py-2 text-slate-500">{bin.lastCollection ? new Date(bin.lastCollection).toLocaleDateString() : "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                                                onClick={() => handleEdit(bin)}
                        className="rounded p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setQrBin(bin)}
                        className="rounded p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                        title="Generate QR"
                      >
                        <QrCode size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(bin)}
                        disabled={loadingId === bin.id}
                        className="rounded p-1 text-rose-600 hover:bg-rose-100 dark:hover:bg-slate-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

            {showForm && (
        <BinForm
          bin={editingBin}
          onClose={() => { setShowForm(false); setEditingBin(null); }}
          onSave={handleSave}
          loading={loadingId === "save"}
        />
      )}

      {qrBin && (
        <QrCodeModal
          value={qrBin.id}
          label={`QR: ${qrBin.id}`}
          onClose={() => setQrBin(null)}
        />
      )}
    </div>
  );
};

export default AdminBins;
