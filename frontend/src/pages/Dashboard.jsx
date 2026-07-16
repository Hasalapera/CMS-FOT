import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileChartColumn,
  FileText,
  Filter,
  FlaskConical,
  MapPin,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";

const DAY = 24 * 60 * 60 * 1000;
const PANEL =
  "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]";

const inputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateFromInput = (value, endOfDay = false) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date;
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return inputDate(date);
};

const showDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(dateFromInput(value))
    : "N/A";

const number = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const USAGE = [
  { id: 1, date: daysAgo(1), chemical: "Acetone", category: "Flammable", quantity: 1.25, user: "Dr. Alex Davis", lab: "Organic Synthesis Lab" },
  { id: 2, date: daysAgo(3), chemical: "Ethanol", category: "Flammable", quantity: 2.0, user: "Emily Mehta", lab: "Biochemistry Lab" },
  { id: 3, date: daysAgo(5), chemical: "Sodium Hydroxide", category: "Corrosive", quantity: 0.25, user: "Sam Patel", lab: "Analytical Chemistry" },
  { id: 4, date: daysAgo(8), chemical: "Silver Nitrate", category: "Oxidizing", quantity: 0.1, user: "Ananya Kapoor", lab: "Titration Lab" },
  { id: 5, date: daysAgo(11), chemical: "Hydrochloric Acid (37%)", category: "Corrosive", quantity: 0.5, user: "Mohammed Junaid", lab: "Photochemistry Lab" },
  { id: 6, date: daysAgo(15), chemical: "Ethanol", category: "Flammable", quantity: 1.6, user: "Dr. Alex Davis", lab: "Research Annex" },
  { id: 7, date: daysAgo(20), chemical: "Acetone", category: "Flammable", quantity: 2.3, user: "Nimal Perera", lab: "Organic Synthesis Lab" },
  { id: 8, date: daysAgo(27), chemical: "Nitric Acid (70%)", category: "Oxidizing", quantity: 0.4, user: "Ishara Silva", lab: "Inorganic Lab" },
  { id: 9, date: daysAgo(34), chemical: "Sodium Hydroxide", category: "Corrosive", quantity: 0.75, user: "Hasini Fernando", lab: "Analytical Chemistry" },
  { id: 10, date: daysAgo(41), chemical: "Ethanol", category: "Flammable", quantity: 3.1, user: "Dr. Alex Davis", lab: "Biochemistry Lab" },
  { id: 11, date: daysAgo(49), chemical: "Acetone", category: "Flammable", quantity: 1.8, user: "Emily Mehta", lab: "Research Annex" },
  { id: 12, date: daysAgo(58), chemical: "Hydrochloric Acid (37%)", category: "Corrosive", quantity: 0.9, user: "Sam Patel", lab: "Photochemistry Lab" },
  { id: 13, date: daysAgo(67), chemical: "Silver Nitrate", category: "Oxidizing", quantity: 0.2, user: "Ananya Kapoor", lab: "Titration Lab" },
  { id: 14, date: daysAgo(76), chemical: "Ethanol", category: "Flammable", quantity: 2.7, user: "Mohammed Junaid", lab: "Research Annex" },
  { id: 15, date: daysAgo(88), chemical: "Sodium Hydroxide", category: "Corrosive", quantity: 0.55, user: "Ishara Silva", lab: "Analytical Chemistry" },
];

const INVENTORY = [
  { id: 1, name: "Acetone", cas: "67-64-1", category: "Flammable", quantity: "18.50 L", expiry: daysAgo(-132), status: "Sufficient", location: "Organic Lab / Cabinet A" },
  { id: 2, name: "Ethanol", cas: "64-17-5", category: "Flammable", quantity: "32.20 L", expiry: daysAgo(-178), status: "Sufficient", location: "Organic Lab / Cabinet B" },
  { id: 3, name: "Hydrochloric Acid (37%)", cas: "7647-01-0", category: "Corrosive", quantity: "6.25 L", expiry: daysAgo(-36), status: "Low Stock", location: "Acid Store / Shelf A" },
  { id: 4, name: "Sodium Hydroxide", cas: "1310-73-2", category: "Corrosive", quantity: "2.15 kg", expiry: daysAgo(-21), status: "Low Stock", location: "Chemical Store / Cabinet 3" },
  { id: 5, name: "Silver Nitrate", cas: "7761-88-8", category: "Oxidizing", quantity: "500 g", expiry: daysAgo(-8), status: "Expiring Soon", location: "Inorganic Lab / Shelf C" },
  { id: 6, name: "Nitric Acid (70%)", cas: "7697-37-2", category: "Oxidizing", quantity: "8.40 L", expiry: daysAgo(-17), status: "Expiring Soon", location: "Acid Store / Shelf B" },
];

const LOCATIONS = [
  { name: "Science Building", count: 8, usage: 78 },
  { name: "Research Annex", count: 5, usage: 61 },
  { name: "Chemistry Lab", count: 4, usage: 64 },
  { name: "Engineering Block", count: 3, usage: 45 },
  { name: "Health Sciences", count: 2, usage: 33 },
  { name: "Innovation Centre", count: 2, usage: 22 },
];

const ALERTS = [
  { id: 1, title: "Hydrochloric Acid (37%)", text: "Quantity is below the configured threshold.", label: "Low Stock", color: "var(--color-warning)", Icon: AlertTriangle },
  { id: 2, title: "Sodium Hydroxide", text: "Only 2.15 kg remains in Cabinet 3.", label: "Low Stock", color: "var(--color-warning)", Icon: AlertTriangle },
  { id: 3, title: "Silver Nitrate", text: "This batch will expire within the next 30 days.", label: "Expiring Soon", color: "var(--color-danger)", Icon: CalendarDays },
  { id: 4, title: "SDS document updated", text: "The latest SDS version is now available.", label: "Information", color: "var(--color-info)", Icon: FileText },
];

const SectionHeader = ({ icon: Icon, title, text, to, action }) => (
  <header className="flex flex-col gap-3 border-b border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] text-[var(--color-primary)]">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-extrabold text-[var(--color-text-primary)] sm:text-lg">{title}</h2>
        {text && <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">{text}</p>}
      </div>
    </div>
    {to && action && (
      <Link to={to} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)]">
        {action}
        <ArrowRight size={15} />
      </Link>
    )}
  </header>
);

const MetricCard = ({ label, value, helper, icon: Icon, iconClass, helperClass = "text-[var(--color-success)]" }) => (
  <article className={`${PANEL} min-w-0 p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-5`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-3 truncate text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-3xl">{value}</p>
      </div>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${iconClass}`}>
        <Icon size={23} />
      </span>
    </div>
    <p className={`mt-3 text-xs font-semibold leading-5 ${helperClass}`}>{helper}</p>
  </article>
);

const EmptyState = ({ children }) => (
  <div className="flex min-h-44 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-4 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
    {children}
  </div>
);

const TrendChart = ({ points }) => {
  const width = 760;
  const height = 250;
  const left = 44;
  const right = 20;
  const top = 20;
  const bottom = 42;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const max = Math.max(...points.map((item) => item.value), 1);

  const coordinates = points.map((item, index) => ({
    ...item,
    x: points.length === 1 ? left + chartWidth / 2 : left + (index / (points.length - 1)) * chartWidth,
    y: top + chartHeight - (item.value / max) * chartHeight,
  }));

  const line = coordinates.map((item) => `${item.x},${item.y}`).join(" ");
  const area = `${left},${top + chartHeight} ${line} ${left + chartWidth},${top + chartHeight}`;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[250px] min-w-[650px] w-full" role="img" aria-label="Usage trend chart">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = top + chartHeight - tick * chartHeight;
          return (
            <g key={tick}>
              <line x1={left} x2={left + chartWidth} y1={y} y2={y} stroke="var(--color-border)" />
              <text x={left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-text-muted)">
                {number(max * tick)}
              </text>
            </g>
          );
        })}
        <polygon points={area} fill="var(--color-primary-tint)" opacity="0.85" />
        <polyline points={line} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coordinates.map((item, index) => (
          <g key={`${item.label}-${index}`}>
            <circle cx={item.x} cy={item.y} r="5" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="3" />
            <text x={item.x} y={height - 14} textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let consumed = 0;

  return (
    <div className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--color-surface-muted)" strokeWidth="18" />
          {data.map((item) => {
            const percentage = total ? (item.value / total) * 100 : 0;
            const offset = -consumed;
            consumed += percentage;
            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r="44"
                pathLength="100"
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-2xl text-[var(--color-text-primary)]">{number(total)} L</strong>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Selected Usage</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = total ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-[var(--color-text-secondary)]">{item.label}</span>
                  <strong className="text-[var(--color-text-primary)]">{percentage.toFixed(0)}%</strong>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                  <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const statusClass = (status) => {
  if (status === "Sufficient") return "border-[var(--color-success)] bg-[var(--color-primary-tint)] text-[var(--color-success)]";
  if (status === "Low Stock") return "border-[var(--color-warning)] bg-[var(--color-surface-muted)] text-[var(--color-warning)]";
  return "border-[var(--color-danger)] bg-[var(--color-surface-muted)] text-[var(--color-danger)]";
};

const Dashboard = () => {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const monthStart = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);

  const [preset, setPreset] = useState("this-month");
  const [startDate, setStartDate] = useState(inputDate(monthStart));
  const [endDate, setEndDate] = useState(inputDate(today));

  const { data: chemicalStats, isLoading: isLoadingChemicalStats } = useQuery({
    queryKey: ['chemicalStats'],
    queryFn: () => api.get('/chemicals/stats').then(res => res.data.stats),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const displayName = user?.fullName || user?.name || user?.institutionalId || "FLCMS User";

  const applyPreset = (value) => {
    const end = new Date();
    let start = new Date(end);

    if (value === "this-month") start = new Date(end.getFullYear(), end.getMonth(), 1);
    if (value === "last-30") start.setDate(start.getDate() - 29);
    if (value === "last-90") start.setDate(start.getDate() - 89);
    if (value === "this-year") start = new Date(end.getFullYear(), 0, 1);

    setPreset(value);
    setStartDate(inputDate(start));
    setEndDate(inputDate(end));
  };

  const filteredUsage = useMemo(() => {
    const start = dateFromInput(startDate);
    const end = dateFromInput(endDate, true);
    if (!start || !end || start > end) return [];

    return USAGE.filter((item) => {
      const date = dateFromInput(item.date);
      return date >= start && date <= end;
    }).sort((a, b) => dateFromInput(b.date) - dateFromInput(a.date));
  }, [startDate, endDate]);

  const report = useMemo(() => {
    const total = filteredUsage.reduce((sum, item) => sum + item.quantity, 0);
    const chemicals = {};
    const categories = {};

    filteredUsage.forEach((item) => {
      chemicals[item.chemical] = (chemicals[item.chemical] || 0) + item.quantity;
      categories[item.category] = (categories[item.category] || 0) + item.quantity;
    });

    const top = Object.entries(chemicals)
      .map(([chemical, quantity]) => ({ chemical, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const colors = {
      Flammable: "var(--color-danger)",
      Corrosive: "var(--color-warning)",
      Oxidizing: "var(--color-accent)",
    };

    const pie = Object.entries(categories)
      .map(([label, value]) => ({ label, value, color: colors[label] || "var(--color-info)" }))
      .sort((a, b) => b.value - a.value);

    const start = dateFromInput(startDate);
    const end = dateFromInput(endDate, true);
    const trend = [];

    if (start && end && start <= end) {
      const totalDays = Math.max(1, Math.floor((end - start) / DAY) + 1);
      const buckets = Math.min(8, totalDays);
      const bucketSize = Math.max(1, Math.ceil(totalDays / buckets));

      for (let index = 0; index < buckets; index += 1) {
        const bucketStart = new Date(start.getTime() + index * bucketSize * DAY);
        const bucketEnd = new Date(Math.min(end.getTime(), bucketStart.getTime() + (bucketSize - 1) * DAY));
        bucketEnd.setHours(23, 59, 59, 999);

        const value = filteredUsage
          .filter((item) => {
            const itemDate = dateFromInput(item.date);
            return itemDate >= bucketStart && itemDate <= bucketEnd;
          })
          .reduce((sum, item) => sum + item.quantity, 0);

        trend.push({
          label: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(bucketStart),
          value,
        });
      }
    }

    return { total, top, pie, trend, unique: Object.keys(chemicals).length };
  }, [filteredUsage, startDate, endDate]);

  const lowStock = INVENTORY.filter((item) => item.status === "Low Stock").length;
  const expiring = INVENTORY.filter((item) => item.status === "Expiring Soon").length;
  const topMax = Math.max(...report.top.map((item) => item.quantity), 1);
  const invalidRange = dateFromInput(startDate) > dateFromInput(endDate);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1600px]">
          <section className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-dark)] px-5 py-6 shadow-[var(--shadow-md)] sm:px-7 sm:py-7 lg:px-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[var(--color-accent)] opacity-20" />
            <div className="pointer-events-none absolute -bottom-28 right-20 h-56 w-56 rounded-full bg-[var(--color-primary-light)] opacity-30" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-accent-light)]">
                  <BarChart3 size={14} />
                  Laboratory Overview
                </span>
                <h1 className="mt-4 text-2xl font-extrabold text-[var(--color-text-inverse)] sm:text-3xl lg:text-4xl">
                  Welcome back, {displayName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-inverse)] opacity-80 sm:text-base">
                  Monitor chemical inventory, usage activity, stock risks and laboratory safety information from one dashboard.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-xl">
                <div className="rounded-[var(--radius-md)] border border-[var(--color-primary-light)] bg-[var(--color-primary)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light)]">Active Date Range</p>
                  <p className="mt-2 text-sm font-extrabold text-[var(--color-text-inverse)]">
                    {showDate(startDate)} – {showDate(endDate)}
                  </p>
                </div>
                <Link
                  to="/reports/usage"
                  className="group flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent)] p-4 text-[var(--color-primary-dark)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em]">Reports</p>
                    <p className="mt-2 text-sm font-extrabold">Open full analytics</p>
                  </div>
                  <FileChartColumn size={26} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          <section className={`${PANEL} mt-6 p-4 sm:p-5`}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[var(--color-primary)]" />
                  <h2 className="text-base font-extrabold text-[var(--color-text-primary)]">Report Date Filter</h2>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Usage cards, line chart and pie chart update automatically.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[180px_170px_170px_auto]">
                <label>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Quick Range</span>
                  <select
                    value={preset}
                    onChange={(event) => applyPreset(event.target.value)}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="this-month">This Month</option>
                    <option value="last-30">Last 30 Days</option>
                    <option value="last-90">Last 90 Days</option>
                    <option value="this-year">This Year</option>
                    {preset === "custom" && <option value="custom">Custom Range</option>}
                  </select>
                </label>

                <label>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Start Date</span>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => {
                      setPreset("custom");
                      setStartDate(event.target.value);
                    }}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">End Date</span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    max={inputDate(today)}
                    onChange={(event) => {
                      setPreset("custom");
                      setEndDate(event.target.value);
                    }}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => applyPreset("this-month")}
                  className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-4 text-sm font-bold text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                >
                  <RefreshCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {invalidRange && (
              <p className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-danger)]">
                Start date cannot be later than end date.
              </p>
            )}
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Link to="/chemicals/list">
              <MetricCard
                label="Total Chemicals"
                value={isLoadingChemicalStats ? <Loader2 className="h-7 w-7 animate-spin" /> : number(chemicalStats?.active)}
                helper={isLoadingChemicalStats ? "Loading..." : `${number(chemicalStats?.inactive)} deactivated`}
                icon={FlaskConical}
                iconClass="bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
                helperClass="text-[var(--color-text-secondary)]"
              />
            </Link>
            <MetricCard label="Low Stock" value={lowStock} helper="Reorder recommended" icon={AlertTriangle} iconClass="bg-[var(--color-surface-muted)] text-[var(--color-warning)]" helperClass="text-[var(--color-warning)]" />
            <MetricCard label="Expiring Soon" value={expiring} helper="Within next 30 days" icon={CalendarDays} iconClass="bg-[var(--color-surface-muted)] text-[var(--color-danger)]" helperClass="text-[var(--color-danger)]" />
            <MetricCard label="Locations" value="24" helper="Across 6 laboratory areas" icon={MapPin} iconClass="bg-[var(--color-primary-tint)] text-[var(--color-primary)]" />
            <MetricCard label="Selected Usage" value={`${number(report.total)} L`} helper={`${filteredUsage.length} usage records`} icon={TrendingUp} iconClass="bg-[var(--color-primary-tint)] text-[var(--color-success)]" />
            <MetricCard label="SDS Documents" value="116" helper="90.6% document coverage" icon={FileText} iconClass="bg-[var(--color-surface-muted)] text-[var(--color-accent-dark)]" helperClass="text-[var(--color-accent-dark)]" />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className={`${PANEL} overflow-hidden xl:col-span-2`}>
              <SectionHeader icon={Activity} title="Chemical Usage Trend" text="Issued quantity for the selected reporting period." to="/reports/usage" action="View report" />
              <div className="p-4 sm:p-5">
                {!report.total ? (
                  <EmptyState>No chemical usage was recorded in this date range.</EmptyState>
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Total Usage</p>
                        <p className="mt-1 text-2xl font-extrabold text-[var(--color-primary)]">{number(report.total)} L</p>
                      </div>
                      <span className="rounded-full bg-[var(--color-primary-tint)] px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]">
                        {report.unique} active chemicals
                      </span>
                    </div>
                    <TrendChart points={report.trend} />
                  </>
                )}
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={ShieldAlert} title="Usage by Hazard Category" text="Dynamic distribution for the selected dates." />
              <div className="p-4 sm:p-5">
                {report.pie.length ? <DonutChart data={report.pie} /> : <EmptyState>No category data is available.</EmptyState>}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className={`${PANEL} overflow-hidden xl:col-span-2`}>
              <SectionHeader icon={FlaskConical} title="Inventory Snapshot" text="Important stock, expiry and storage information." to="/chemicals/list" action="View inventory" />
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border-collapse text-left">
                  <thead className="bg-[var(--color-surface-muted)]">
                    <tr className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      <th className="px-5 py-3">Chemical</th>
                      <th className="px-4 py-3">CAS No.</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Expiry</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {INVENTORY.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--color-primary-tint)]">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-[var(--color-text-primary)]">{item.name}</p>
                          <p className="mt-1 max-w-56 truncate text-xs text-[var(--color-text-muted)]">{item.location}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">{item.cas}</td>
                        <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">{item.category}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-[var(--color-text-primary)]">{item.quantity}</td>
                        <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">{showDate(item.expiry)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={Warehouse} title="Storage Overview" text="Current utilization across laboratory locations." to="/locations" action="View locations" />
              <div className="space-y-5 p-4 sm:p-5">
                {LOCATIONS.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{item.count} locations</p>
                      </div>
                      <strong className="text-sm text-[var(--color-primary)]">{item.usage}%</strong>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                      <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${item.usage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={Clock3} title="Recent Usage Activity" text="Latest records inside the selected date range." to="/usage/batchwise" action="View all" />
              <div className="p-4 sm:p-5">
                {filteredUsage.length ? (
                  <div className="space-y-1">
                    {filteredUsage.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-[var(--radius-sm)] px-2 py-3 hover:bg-[var(--color-primary-tint)]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-extrabold text-[var(--color-text-inverse)]">
                          {item.user.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                            <p className="text-sm font-extrabold text-[var(--color-text-primary)]">{item.chemical} — {number(item.quantity)} L</p>
                            <span className="shrink-0 text-xs font-semibold text-[var(--color-text-muted)]">{showDate(item.date)}</span>
                          </div>
                          <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">By {item.user} • {item.lab}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState>No recent usage activity is available.</EmptyState>
                )}
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={BarChart3} title="Top Chemical Usage" text="Highest issued quantities for the selected period." to="/reports/usage" action="Detailed report" />
              <div className="p-4 sm:p-5">
                {report.top.length ? (
                  <div className="space-y-5">
                    {report.top.map((item, index) => (
                      <div key={item.chemical}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-tint)] text-xs font-extrabold text-[var(--color-primary)]">{index + 1}</span>
                            <span className="truncate text-sm font-bold text-[var(--color-text-primary)]">{item.chemical}</span>
                          </div>
                          <strong className="shrink-0 text-sm text-[var(--color-primary)]">{number(item.quantity)} L</strong>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                          <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${(item.quantity / topMax) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState>No usage ranking is available.</EmptyState>
                )}
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={Bell} title="Alerts & Notifications" text="Items that need laboratory attention." to="/notifications" action="View all" />
              <div className="p-4 sm:p-5">
                <div className="space-y-2">
                  {ALERTS.map(({ id, title, text, label, color, Icon }) => (
                    <div key={id} className="flex gap-3 rounded-[var(--radius-sm)] border border-transparent p-2.5 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)]" style={{ color }}>
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <p className="text-sm font-extrabold text-[var(--color-text-primary)]">{title}</p>
                          <span className="w-fit shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-extrabold" style={{ color, borderColor: color }}>{label}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] px-3 py-2.5 text-xs font-semibold text-[var(--color-primary)]">
                  <CheckCircle2 size={16} />
                  Safety monitoring is active for all configured locations.
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;