import { Save } from "lucide-react";
import { CategoryBadge } from "./Badges";

/**
 * WasteResult — displays an AI classification result with a Save action.
 * `result` = { detectedType, category, confidence, recommendedContainer,
 *   safetyInstruction, examples, imageUrl }
 */
const WasteResult = ({ result, onSave, saving }) => {
  if (!result) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start gap-4">
        {result.imageUrl && (
          <img
            src={result.imageUrl}
            alt={result.detectedType}
            className="h-24 w-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {result.detectedType}
            </h3>
            <CategoryBadge category={result.category} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {result.recommendedContainer}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 rounded bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded bg-primary-500"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {result.confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Safety Instructions
        </h4>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          {result.safetyInstruction}
        </p>
      </div>

      {result.examples && result.examples.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Examples in this category
          </h4>
          <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
            {result.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving…" : "Save to Records"}
        </button>
      </div>
    </div>
  );
};

export default WasteResult;
