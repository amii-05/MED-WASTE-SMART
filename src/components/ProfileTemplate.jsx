import { useState } from "react";
import { LogOut, Save, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { updateUserProfile } from "../services/authService";
import { storage, LOCAL_KEYS } from "../services/dataStore";
import PageHeader from "./PageHeader";

const ProfileTemplate = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const saveName = async () => {
    if (name === user.name) return;
    setSaving(true);
    try {
      await updateUserProfile(user.id, { name });
      const session = storage.get(LOCAL_KEYS.auth, null);
      if (session) storage.set(LOCAL_KEYS.auth, { ...session, user: { ...session.user, name } });
    } catch (e) { void e; }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
            <img src={user.avatar || "https://i.pravatar.com/150?img=72"} alt={user.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-100" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.role} · {user.department}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Personal Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" value={user.email} disabled
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm opacity-60 dark:border-slate-600 dark:bg-slate-900" />
              </div>
            </div>
            <button onClick={saveName} disabled={saving}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Theme</h3>
            <div className="flex gap-2">
              {[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }].map((t) => (
                <button key={t.value} onClick={() => setTheme(t.value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    theme === t.value
                      ? "border-primary-600 bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Account</h3>
            <div className="space-y-3">
              <button className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
                <Key size={16} /> Change password
                <span className="ml-auto text-xs text-slate-400">(demo: unavailable)</span>
              </button>
              <button onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-left text-sm font-medium text-rose-700 hover:bg-rose-50">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTemplate;
