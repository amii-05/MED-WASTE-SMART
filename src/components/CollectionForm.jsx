import { CategoryBadge } from "./Badges";
import { ClipboardList } from "lucide-react";
import { DEPARTMENTS, WASTE_CATEGORIES, WASTE_CATEGORY_LABELS, PRIORITY_LEVELS, PRIORITY_LABELS } from "../utils/constants";

/**
 * CollectionForm — the collection request form fields.
 * Extracted so the container page stays small & readable.
 */
const CollectionForm = ({ form, errors, onChange, onSubmit, submitting, bins }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Department</label>
            <select name="department" value={form.department} onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Bin ID</label>
            <select name="binId" value={form.binId} onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
              <option value="">Select a bin…</option>
              {bins.map((b) => <option key={b.id} value={b.id}>{b.id} ({b.department}) — {b.fillLevel}%</option>)}
            </select>
            {errors.binId && <p className="mt-1 text-xs text-rose-600">{errors.binId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Waste Category</label>
            <div className="mt-1 flex items-center gap-2">
              <select name="category" value={form.category} onChange={onChange}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                {Object.values(WASTE_CATEGORIES).map((c) => <option key={c} value={c}>{WASTE_CATEGORY_LABELS[c]}</option>)}
              </select>
              <CategoryBadge category={form.category} />
            </div>
            {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Fill Level: {form.fillLevel}%</label>
            <input type="range" name="fillLevel" min="0" max="100" value={form.fillLevel} onChange={onChange}
              className="mt-1 block w-full accent-primary-600" />
          </div>
          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select name="priority" value={form.priority} onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
              {Object.values(PRIORITY_LEVELS).map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity (bags)</label>
            <input type="number" name="quantity" min="1" value={form.quantity} onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900" />
            {errors.quantity && <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>}
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium">Notes</label>
          <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Any special instructions…"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm dark:border-slate-600 dark:bg-slate-900" rows={3} />
        </div>
      </div>

      {errors.submit && <p className="rounded-lg bg-rose-50 p-2.5 text-sm text-rose-800">{errors.submit}</p>}

      <button type="submit" disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
        <ClipboardList size={18} />
        {submitting ? "Submitting…" : "Submit Collection Request"}
      </button>
    </form>
  );
};

export default CollectionForm;
