import { useState } from "react";
import { X, Save } from "lucide-react";
import { DEPARTMENTS, WASTE_CATEGORIES, WASTE_CATEGORY_LABELS } from "../utils/constants";
import { validateAddBin, hasErrors } from "../utils/validation";
import { generateId } from "../utils/helpers";
import { CategoryBadge } from "./Badges";

/** BinForm — modal form for adding or editing a bin. */
const BinForm = ({ bin = null, onClose, onSave, loading }) => {
  const isEdit = !!bin;
  const [form, setForm] = useState({
    binId: bin?.id || "",
    department: bin?.department || DEPARTMENTS[0],
    category: bin?.category || "yellow",
    capacity: bin?.capacity || 120,
    fillLevel: bin?.fillLevel ?? 0,
    location: bin?.location || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "capacity" || name === "fillLevel" ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validateAddBin(form);
    if (hasErrors(v)) { setErrors(v); return; }
    setErrors({});
    onSave({
      id: form.binId || generateId("BIN"),
      department: form.department,
      category: form.category,
      capacity: Number(form.capacity),
      fillLevel: Number(form.fillLevel) || 0,
      location: form.location,
      ...(isEdit ? { lastCollection: bin.lastCollection } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Edit Bin" : "Add New Bin"}
          </h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Bin ID</label>
              <input type="text" name="binId" value={form.binId} onChange={handleChange} placeholder="Auto-generates"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900" />
              {errors.binId && <p className="mt-1 text-xs text-rose-600">{errors.binId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <select name="department" value={form.department} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Waste Category</label>
              <div className="mt-1 flex items-center gap-2">
                <select name="category" value={form.category} onChange={handleChange}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                  {Object.values(WASTE_CATEGORIES).map((c) => <option key={c} value={c}>{WASTE_CATEGORY_LABELS[c]}</option>)}
                </select>
                <CategoryBadge category={form.category} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Capacity</label>
              <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900" />
              {errors.capacity && <p className="mt-1 text-xs text-rose-600">{errors.capacity}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. ICU Room 3"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900" />
              <input type="range" name="fillLevel" min="0" max="100" value={form.fillLevel} onChange={handleChange}
                className="mt-2 block w-full accent-primary-600" />
              {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            <Save size={16} /> {loading ? "Saving…" : isEdit ? "Update Bin" : "Add Bin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BinForm;
