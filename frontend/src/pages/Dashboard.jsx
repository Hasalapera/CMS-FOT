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
import ChemicalUsageTrend from "../components/dashboard/ChemicalUsageTrend.jsx";
import UsageByHazardCategory from "../components/dashboard/UsageByHazardCategory.jsx";
import InventorySnapshot from "../components/dashboard/InventorySnapshot.jsx";
import StorageOverview from "../components/dashboard/StorageOverview.jsx";

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

const trendDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return inputDate(new Date(value));
};

const number = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

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
        <p className="mt-3 whitespace-nowrap text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-3xl">{value}</p>
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

  const invalidRange = dateFromInput(startDate) > dateFromInput(endDate);

  const { data: chemicalStats, isLoading: isLoadingChemicalStats } = useQuery({
    queryKey: ['chemicalStats'],
    queryFn: () => api.get('/chemicals/stats').then(res => res.data.stats),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: batchStats, isLoading: isLoadingBatchStats } = useQuery({
    queryKey: ['batchStats'],
    queryFn: () => api.get('/batches/stats').then(res => res.data.stats),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: locationStats, isLoading: isLoadingLocationStats } = useQuery({
    queryKey: ['locationStats'],
    queryFn: () => api.get('/locations/stats').then(res => res.data.stats),
    staleTime: 1000 * 60 * 5,
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
            <Link to="/stock/batches">
              <article className={`${PANEL} flex h-full flex-col p-0 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]`}>
                <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Inventory Alerts</p>
                    <p className="mt-3 truncate text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-3xl">
                      {isLoadingBatchStats ? <Loader2 className="inline-block h-7 w-7 animate-spin" /> : number((batchStats?.lowStock || 0) + (batchStats?.expiringSoon || 0))}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-warning)]">
                    <AlertTriangle size={23} />
                  </span>
                </div>
                <div className="mt-auto grid grid-cols-2 border-t border-[var(--color-border)]">
                  <div className="border-r border-[var(--color-border)] p-2 text-center">
                    <p className="text-lg font-bold text-[var(--color-warning)]">{isLoadingBatchStats ? '...' : number(batchStats?.lowStock)}</p>
                    <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">Low Stock</p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-lg font-bold text-[var(--color-danger)]">{isLoadingBatchStats ? '...' : number(batchStats?.expiringSoon)}</p>
                    <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">Expiring Soon</p>
                  </div>
                </div>
              </article>
            </Link>
            <MetricCard
              label="Total Locations"
              value={isLoadingLocationStats ? <Loader2 className="h-7 w-7 animate-spin" /> : number(locationStats?.total)}
              helper={isLoadingLocationStats ? "Loading..." : `${number(locationStats?.rootLocations)} parent, ${number(locationStats?.childLocations)} child locations`}
              icon={MapPin}
              iconClass="bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
              helperClass="text-[var(--color-text-secondary)]"
            />
            <MetricCard
              label="Total Usage"
              value={isLoadingBatchStats ? <Loader2 className="h-7 w-7 animate-spin" /> : `${(batchStats?.usagePercentage || 0).toFixed(1)}%`}
              helper={isLoadingBatchStats ? "Loading..." : `${number(batchStats?.totalUsed)} of ${number(batchStats?.totalReceived)} units consumed`}
              icon={TrendingUp}
              iconClass="bg-[var(--color-primary-tint)] text-[var(--color-success)]"
              helperClass="text-[var(--color-success)]"
            />
            <Link to="/sds/library">
              <MetricCard
                label="SDS Documents"
                value={isLoadingChemicalStats ? <Loader2 className="h-7 w-7 animate-spin" /> : number(chemicalStats?.sdsCount)}
                helper={
                  isLoadingChemicalStats ? "Loading..." :
                  `${chemicalStats?.active > 0 ? ((chemicalStats?.sdsCount / chemicalStats?.active) * 100).toFixed(1) : '0.0'}% document coverage`
                }
                icon={FileText}
                iconClass="bg-[var(--color-surface-muted)] text-[var(--color-accent-dark)]"
                helperClass="text-[var(--color-accent-dark)]"
              />
            </Link>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <ChemicalUsageTrend
              startDate={startDate}
              endDate={endDate}
              invalidRange={invalidRange}
            />
            <UsageByHazardCategory
              startDate={startDate}
              endDate={endDate}
              invalidRange={invalidRange}
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <InventorySnapshot />

            <StorageOverview />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={Clock3} title="Recent Usage Activity" text="Latest records inside the selected date range." to="/usage/batchwise" action="View all" />
              <div className="p-4 sm:p-5">
                {/* {filteredUsage.length ? (
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
                ) : ( */}
                  <EmptyState>Recent usage is coming soon.</EmptyState>
                {/* )} */}
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={BarChart3} title="Top Chemical Usage" text="Highest issued quantities for the selected period." to="/reports/usage" action="Detailed report" />
              <div className="p-4 sm:p-5">
                {/* {report.top.length ? (
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
                ) : ( */}
                  <EmptyState>Top usage is coming soon.</EmptyState>
                {/* )} */}
              </div>
            </article>

            <article className={`${PANEL} overflow-hidden`}>
              <SectionHeader icon={Bell} title="Alerts & Notifications" text="Items that need laboratory attention." to="/notifications" action="View all" />
              <div className="p-4 sm:p-5">
                {/* <div className="space-y-2">
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
                </div> */}
                <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] px-3 py-2.5 text-xs font-semibold text-[var(--color-primary)]">
                  <CheckCircle2 size={16} />
                  Safety monitoring is active for all configured locations.
                </div>
                <EmptyState>Live alerts are coming soon.</EmptyState>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
