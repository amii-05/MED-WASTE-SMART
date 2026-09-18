import { useMemo, useState } from "react";
import { FileText, TrendingUp, Calendar, Share2, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import {
  WASTE_CATEGORIES,
  WASTE_CATEGORY_LABELS,
  STATUSES,
  STATUS_LABELS,
  PRIORITY_LEVELS,
} from "../../utils/constants";
import { formatDate } from "../../utils/helpers";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const ChartCard = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    {children}
  </div>
);

const AdminReports = () => {
  const { bins, requests, collections, wasteRecords } = useAppData();
  const [period, setPeriod] = useState("7");

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - Number(period));
    return d;
  }, [period]);

  const recents = (arr, key) =>
    (arr || []).filter((item) => {
      const d = new Date(item[key] || item.createdAt);
      return !isNaN(d) && d >= cutoff;
    });

  const recentRequests = recents(requests, "createdAt");
  const recentCollections = recents(collections, "collectedAt");
  const recentBins = bins;
  const recentWaste = recents(wasteRecords, "createdAt");

  const requestsByDept = useMemo(() => {
    const byDept = {};
    recentRequests.forEach((r) => {
      byDept[r.department] = (byDept[r.department] || 0) + 1;
    });
    return Object.entries(byDept).map(([k, v]) => ({ dept: k, count: v }));
  }, [recentRequests]);

  const statusCounts = useMemo(() => {
    const counts = {};
    recentRequests.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.values(STATUSES).map((s) => ({
      label: STATUS_LABELS[s] || s,
      count: counts[s] || 0,
    }));
  }, [recentRequests]);
  
  const collectionsByWeek = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toDateString();
    });
    return days.map((d) => ({
      day: new Date(d).toLocaleDateString(undefined, { weekday: "short" }),
      count: collections.filter((c) => new Date(c.collectedAt).toDateString() === d).length,
    }));
  }, [collections]);

  const wasteByCategory = useMemo(
    () =>
      Object.values(WASTE_CATEGORIES).map((cat, i) => ({
        name: WASTE_CATEGORY_LABELS[cat],
        value: wasteRecords.filter((r) => r.category === cat).length,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [wasteRecords]
  );

  const emergencyCount = recentRequests.filter(
    (r) => r.priority === PRIORITY_LEVELS.EMERGENCY
  ).length;

  const handlePrint = () => window.print();

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Waste collection &amp; segregation reports for your facility."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <Calendar size={16} />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="9999">All time</option>
              </select>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
            >
              <Share2 size={16} /> Print
            </button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label={`Requests (${period}d)`}
          value={recentRequests.length}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Collections"
          value={recentCollections.length}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        />
        <StatCard
          icon={AlertTriangle}
          label="Emergency Requests"
          value={emergencyCount}
          color="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Waste Classified"
          value={recentWaste.length}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        />
      </div>

            {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Requests by Department">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={requestsByDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collections (Last 7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={collectionsByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Requests by Status">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="label" type="category" tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Waste by Category">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={wasteByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
              >
                {wasteByCategory.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Detailed tables */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Recent Collections
          </h2>
          {recentCollections.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No collections in this period.</p>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Request</th>
                  <th className="px-3 py-2 text-left font-medium">Collected</th>
                </tr>
              </thead>
              <tbody>
                {recentCollections.map((c) => (
                  <tr key={c.id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-3 py-2 font-medium">{c.requestId}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDate(c.collectedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bins at Risk
          </h2>
          {recentBins.filter((b) => b.fillLevel >= 90).length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No bins require immediate collection.</p>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Bin ID</th>
                  <th className="px-3 py-2 text-left font-medium">Dept</th>
                  <th className="px-3 py-2 text-left font-medium">Fill</th>
                </tr>
              </thead>
              <tbody>
                {recentBins
                  .filter((b) => b.fillLevel >= 90)
                  .map((b) => (
                    <tr key={b.id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-3 py-2 font-medium">{b.id}</td>
                      <td className="px-3 py-2">{b.department}</td>
                      <td className="px-3 py-2 text-rose-600">{b.fillLevel}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
