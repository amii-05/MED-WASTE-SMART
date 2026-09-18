import { Link, useNavigate } from "react-router-dom";
import { Home, Frown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const dashboardByRole = {
    staff: "/staff/dashboard",
    collector: "/collector/dashboard",
    admin: "/admin/dashboard",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Frown size={72} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h1 className="text-8xl font-extrabold text-slate-200 dark:text-slate-800">
          404
        </h1>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Page not found
        </h2>
        <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have
          permission to view it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => {
              if (user && dashboardByRole[role]) {
                navigate(dashboardByRole[role]);
              } else {
                navigate("/");
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Home size={18} />
            Go to {user ? "Dashboard" : "Home"}
          </button>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
