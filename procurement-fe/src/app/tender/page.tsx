"use client";

import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Link from "next/link";
import {
  IconSearch,
  IconAdjustments,
  IconBookmark,
  IconClock,
  IconCurrencyDollar,
  IconPlus,
  IconFileText,
  IconChevronRight,
  IconBuildingSkyscraper,
  IconTruck,
  IconDeviceDesktop,
  IconMedicalCross,
  IconSchool,
  IconLeaf,
  IconArrowRight,
  IconFilter,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { RootState } from "@/src/store/store";
import type { Tender, TenderStatus } from "@/src/types";

const STATUS_COLORS: Record<TenderStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  draft:     { bg: "bg-zinc-800/80",    text: "text-zinc-400",    dot: "bg-zinc-400"    },
  closed:    { bg: "bg-red-950/60",     text: "text-red-400",     dot: "bg-red-400"     },
  awarded:   { bg: "bg-indigo-950/60",  text: "text-indigo-400",  dot: "bg-indigo-400"  },
  cancelled: { bg: "bg-orange-950/60",  text: "text-orange-400",  dot: "bg-orange-400"  },
};

const CATEGORIES = [
  { label: "All Categories", value: "", icon: <IconFileText size={15} /> },
  { label: "Infrastructure", value: "infrastructure", icon: <IconBuildingSkyscraper size={15} /> },
  { label: "Logistics",      value: "logistics",      icon: <IconTruck size={15} /> },
  { label: "Technology",     value: "technology",     icon: <IconDeviceDesktop size={15} /> },
  { label: "Healthcare",     value: "healthcare",     icon: <IconMedicalCross size={15} /> },
  { label: "Education",      value: "education",      icon: <IconSchool size={15} /> },
  { label: "Environment",    value: "environment",    icon: <IconLeaf size={15} /> },
];

const STATUS_FILTERS = [
  { label: "All",           value: "" },
  { label: "Published",     value: "published" },
  { label: "Closing soon",  value: "closing" },
  { label: "Awarded",       value: "awarded" },
  { label: "Draft",         value: "draft" },
  { label: "Cancelled",     value: "cancelled" },
];

function timeAgo(dateStr: string, now: number) {
  const diff = now - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function daysLeft(dateStr: string, now: number) {
  const diff = new Date(dateStr).getTime() - now;
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days}d left`;
}

function TenderRow({ tender, now }: { tender: Tender; now: number }) {
  const status = STATUS_COLORS[tender.status] ?? STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate, now);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;

  return (
    <Link
      href={`/tender/${tender.id}`}
      className="group flex items-start gap-4 px-6 py-5 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-[#1e1c18] border border-[#2a2620] flex items-center justify-center shrink-0 mt-0.5">
        <IconFileText size={18} className="text-indigo-400" />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </span>
              <span className="text-[11px] text-zinc-600">{tender.referenceNumber}</span>
              <span className="text-[11px] text-zinc-600">·</span>
              <span className="text-[11px] text-zinc-500">{timeAgo(tender.createdAt, now)}</span>
            </div>

            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-1 truncate pr-4">
              {tender.title}
            </h3>

            {tender.description && (
              <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
                {tender.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <IconCurrencyDollar size={12} className="text-zinc-600" />
                <span className="text-zinc-300 font-medium">
                  ${Number(tender.estimatedValue).toLocaleString()}
                </span>
              </span>
              <span className="capitalize text-zinc-500">{tender.name}</span>
            </div>
          </div>

          {/* Right meta */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap ${
                isUrgent && closing !== "Closed"
                  ? "text-orange-400"
                  : closing === "Closed"
                  ? "text-zinc-600"
                  : "text-zinc-400"
              }`}
            >
              <IconClock size={12} />
              {closing}
            </span>
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1.5 rounded-md text-zinc-700 hover:text-zinc-400 hover:bg-[#2a2620] opacity-0 group-hover:opacity-100 transition-all"
              title="Save"
            >
              <IconBookmark size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <IconChevronRight
        size={15}
        className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-3"
      />
    </Link>
  );
}

export default function TendersPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [category, setCategory]       = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortNewest, setSortNewest]   = useState(true);

  const user    = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "admin";

  const { data: tenders = [], isLoading, isError } = useGetTendersQuery(
    search ? { title: search } : {}
  );

  // Stable timestamp — initialized once, never triggers impurity rules
  const [now] = useState<number>(() => new Date().getTime());
  const filtered = tenders.filter((t) => {
    if (statusFilter === "closing") {
      const days = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000);
      return days >= 0 && days <= 7;
    }
    if (statusFilter) return t.status === statusFilter;
    return true;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortNewest
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const stats = {
    total:     tenders.length,
    published: tenders.filter((t) => t.status === "published").length,
    closing:   tenders.filter((t) => {
      const d = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000);
      return d >= 0 && d <= 7;
    }).length,
  };

  return (
    <div className="min-h-screen bg-[#0f0e0b] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 border-r border-[#1e1c18] bg-[#0f0e0b] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Stats */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                Overview
              </p>
              {[
                { label: "Total tenders",  value: stats.total     },
                { label: "Active",         value: stats.published  },
                { label: "Closing soon",   value: stats.closing    },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs text-zinc-500">{s.label}</span>
                  <span className="text-xs font-semibold text-white tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#1e1c18]" />

            {/* Categories */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                Categories
              </p>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors text-left ${
                      category === cat.value
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={category === cat.value ? "text-indigo-400" : "text-zinc-600"}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="h-px bg-[#1e1c18]" />

            {/* Status filters */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                Status
              </p>
              <nav className="space-y-0.5">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${
                      statusFilter === f.value
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {f.label}
                    {statusFilter === f.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Toolbar */}
          <div className="sticky top-14 z-30 bg-[#0f0e0b] border-b border-[#1e1c18] px-6 py-3 flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center flex-1 bg-[#161410] border border-[#2a2620] rounded-lg px-3 py-2 gap-2 max-w-lg">
              <IconSearch size={14} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenders..."
                className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none flex-1"
              />
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`lg:hidden flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? "border-indigo-500 text-indigo-400 bg-indigo-950/40"
                  : "border-[#2a2620] text-zinc-400 hover:text-white"
              }`}
            >
              <IconFilter size={14} />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sortNewest ? "newest" : "oldest"}
              onChange={(e) => setSortNewest(e.target.value === "newest")}
              className="bg-[#161410] border border-[#2a2620] text-xs text-zinc-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <div className="flex-1" />

            {isAdmin && (
              <Link
                href="/tender/create"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
              >
                <IconPlus size={14} />
                New Tender
              </Link>
            )}
          </div>

          {/* Mobile filter pills */}
          {showFilters && (
            <div className="lg:hidden border-b border-[#1e1c18] px-6 py-3 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    statusFilter === f.value
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-[#2a2620] text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Header row */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-[#1e1c18]">
            <div>
              <h1 className="text-sm font-semibold text-white">
                {statusFilter
                  ? STATUS_FILTERS.find((f) => f.value === statusFilter)?.label
                  : "All Tenders"}
              </h1>
              <p className="text-xs text-zinc-600 mt-0.5">
                {isLoading ? "Loading..." : `${sorted.length} result${sorted.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {isAdmin && (
              <Link
                href="/tender/create"
                className="hidden sm:flex lg:hidden items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <IconPlus size={14} />
                New Tender
              </Link>
            )}
          </div>

          {/* Tender list */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col gap-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="px-6 py-5 border-b border-[#1e1c18] flex items-start gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-[#1e1c18] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#1e1c18] rounded w-1/4" />
                      <div className="h-4 bg-[#1e1c18] rounded w-2/3" />
                      <div className="h-3 bg-[#1e1c18] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-red-950/40 flex items-center justify-center mb-4">
                  <IconAdjustments size={20} className="text-red-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Failed to load tenders</p>
                <p className="text-xs text-zinc-500">Check your connection and try again.</p>
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-[#1e1c18] flex items-center justify-center mb-4">
                  <IconFileText size={20} className="text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-white mb-1">No tenders found</p>
                <p className="text-xs text-zinc-500">Try adjusting your search or filters.</p>
                {isAdmin && (
                  <Link
                    href="/tender/create"
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <IconPlus size={14} />
                    Create first tender
                  </Link>
                )}
              </div>
            ) : (
              sorted.map((t) => <TenderRow key={t.id} tender={t} now={now} />)
            )}
          </div>

          {/* Footer count */}
          {!isLoading && sorted.length > 0 && (
            <div className="px-6 py-3 border-t border-[#1e1c18] flex items-center justify-between">
              <p className="text-xs text-zinc-600">
                Showing {sorted.length} of {tenders.length} tenders
              </p>
              <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                View all <IconArrowRight size={12} />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
