import {
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
} from "lucide-react";
import { WASTE_CATEGORIES, WASTE_CATEGORY_COLORS, WASTE_SAFETY_INSTRUCTIONS, WASTE_EXAMPLES, WASTE_CATEGORY_CONTAINERS, WASTE_CATEGORY_LABELS } from "../utils/constants";

const CATEGORY_ICON = {
  yellow: AlertTriangle,
  red: AlertCircle,
  white: AlertOctagon,
  blue: Info,
  general: Info,
};

/**
 * WasteCategoryGuide — reference card showing the 5 waste categories, their
 * recommended containers, example items and safety instructions.
 * Used on IdentifyWaste and as a quick-reference in layouts.
 */
const WasteCategoryGuide = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {Object.values(WASTE_CATEGORIES).map((cat) => (
          <div
            key={cat}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center ${
              WASTE_CATEGORY_COLORS[cat].split(" ")[0]
            } bg-opacity-20`}
          >
            {(() => {
              const Icon = CATEGORY_ICON[cat];
              return <Icon size={20} />;
            })()}
            <span className="text-xs font-medium">
              {WASTE_CATEGORY_LABELS[cat]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.values(WASTE_CATEGORIES).map((cat) => {
        const Icon = CATEGORY_ICON[cat];
        const colorClass = WASTE_CATEGORY_COLORS[cat];
        return (
          <div
            key={cat}
            className={`rounded-xl border-2 border-slate-200 p-4 dark:border-slate-700 ${
              colorClass.split(" ")[0] ? "bg-opacity-[0.06]" : ""
            }`}
          >
            <div className="mb-2 flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClass}`}
              >
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {WASTE_CATEGORY_LABELS[cat]}
              </h3>
            </div>
            <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
              {WASTE_CATEGORY_CONTAINERS[cat]}
            </p>
            <ul className="mb-2 list-disc list-inside space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              {(WASTE_EXAMPLES[cat] || []).map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
            <p className="text-xs italic text-slate-500 dark:text-slate-400">
              {WASTE_SAFETY_INSTRUCTIONS[cat]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WasteCategoryGuide;
