import { ROLES } from "../utils/constants";

const DEMO = [
  {
    label: "Staff",
    email: "staff@medwaste.demo",
    password: "staff123",
    role: ROLES.STAFF,
  },
  {
    label: "Collector",
    email: "collector@medwaste.demo",
    password: "collector123",
    role: ROLES.COLLECTOR,
  },
  {
    label: "Admin",
    email: "admin@medwaste.demo",
    password: "admin123",
    role: ROLES.ADMIN,
  },
];

/**
 * DemoCredentials — clickable demo account cards to pre-fill the login form.
 */
const DemoCredentials = ({ onFill, disabled }) => {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700">
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        Demo accounts
      </p>
      <div className="space-y-2">
        {DEMO.map((d) => (
          <button
            key={d.email}
            onClick={() => onFill(d.email, d.password)}
            disabled={disabled}
            className="w-full text-left rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {d.label}
            </span>
            <span className="float-right text-xs text-slate-500">{d.email}</span>
            <br />
            <span className="text-xs text-slate-500">password: {d.password}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoCredentials;
