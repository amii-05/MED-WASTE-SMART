import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { validateLogin, hasErrors } from "../../utils/validation";
import DemoCredentials from "../../components/DemoCredentials";

const DASHBOARD = {
  staff: "/staff/dashboard",
  collector: "/collector/dashboard",
  admin: "/admin/dashboard",
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const fillDemo = (email, password) => setForm({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(form);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setServerError("");
    try {
      const user = await login(form.email, form.password);
      navigate(from || DASHBOARD[user.role] || "/", { replace: true });
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-12 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="text-4xl">🗑️</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            MedWaste Smart
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Smarter Medical Waste · Safer Healthcare
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            <LogIn size={20} /> Sign in to your account
          </h2>

          {serverError && (
            <p className="mt-3 rounded-lg bg-rose-50 p-2.5 text-sm text-rose-800">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="you@hospital.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={submitting}
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2 pr-10 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <DemoCredentials onFill={fillDemo} disabled={submitting} />

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Hackathon prototype — localStorage demo, no backend required.
        </p>
      </div>
    </div>
  );
};

export default Login;
