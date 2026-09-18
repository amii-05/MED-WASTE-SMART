import { Link } from "react-router-dom";
import {
  Recycle,
  QrCode,
  BarChart3,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Recycle,
    title: "AI Waste Identification",
    desc: "Snap a photo to classify medical waste into the correct color-coded category.",
  },
  {
    icon: ClipboardList,
    title: "Smart Collection Requests",
    desc: "Staff submit priority collection requests; collectors get real-time notifications.",
  },
  {
    icon: QrCode,
    title: "QR Bin Tracking",
    desc: "Every bin carries a scannable QR code for collection verification & location.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Live dashboards for fill levels, collection performance, and segregation trends.",
  },
];

const STEPS = [
  { num: 1, title: "Identify", desc: "Staff identify & classify waste via AI." },
  { num: 2, title: "Request", desc: "Submit a priority collection request." },
  { num: 3, title: "Collect", desc: "Collector scans & collects the waste." },
  { num: 4, title: "Report", desc: "Admin tracks & analyzes the workflow." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 text-5xl">🗑️</span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Smarter Medical Waste.{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Safer Healthcare.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              AI-assisted waste segregation, QR-powered bin tracking, and smart
              collection workflows — all in one platform for hospitals.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Sign In <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold">Features</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16 dark:bg-slate-800/40">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold">How It Works</h2>
          <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            {STEPS.map((s) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                  <span className="text-sm font-bold">{s.num}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {s.desc}
                  </p>
                </div>
                {s.num < STEPS.length && (
                  <ArrowRight size={16} className="hidden text-slate-400 sm:inline" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} MedWaste Smart · Hackathon Prototype
        </div>
      </footer>
    </div>
  );
};

export default Landing;
