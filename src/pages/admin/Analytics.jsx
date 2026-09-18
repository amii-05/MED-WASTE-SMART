import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
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
  LineChart,
  Line,
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
  STATUS_COLORS,
} from "../../utils/constants";
import { collectionStats } from "../../utils/statusUtils";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const ChartCard = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    {children}
  </div>
);

const AdminAnalytics = () => {
  const { wasteRecords, requests, collections, bins } = useAppData();

  const wasteByCategory = useMemo(
    () =>
      Object.values(WASTE_CATEGORIES).map((cat, i) => ({
        name: WASTE_CATEGORY_LABELS[cat],
        value: wasteRecords.filter((r) => r.category === cat).length,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [wasteRecords]
  );

  const requestsByStatus = useMemo(
    () =>
      Object.values(STATUSES).map((k) => ({
        status: STATUS_LABELS[k] || k,
        count: requests.filter((r) => r.status === k).length,
        fill: STATUS_COLORS[k] || "#94a3b8",
      })),
    [requests]
  );

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

  const fillDistribution = useMemo(
    () =>
      [
        { range: "0-30%", count: bins.filter((b) => b.fillLevel <= 30).length },
        { range: "30-70%", count: bins.filter((b) => b.fillLevel > 30 && b.fillLevel <= 70).length },
        { range: "70-90%", count: bins.filter((b) => b.fillLevel > 70 && b.fillLevel < 90).length },
        { range: "90-100%", count: bins.filter((b) => b.fillLevel >= 90).length },
      ],
    [bins]
  );

  const stats = collectionStats(requests, collections, bins, wasteRecords);
  
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Insights into waste collection &amp; segregation." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Total Requests"
          value={stats.totalRequests}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Collections (7d)"
          value={stats.collectionsWeek}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Waste Classified"
          value={stats.wasteRecords}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Fill Level"
          value={`${stats.avgFill}%`}
          color="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Waste by Category">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={wasteByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="80%"
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

        <ChartCard title="Requests by Status">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={requestsByStatus}>
              <XAxis dataKey="status" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collections (Last 7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={collectionsByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fill Level Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fillDistribution}>
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
