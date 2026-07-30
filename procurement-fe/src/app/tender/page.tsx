"use client";

import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Link from "next/link";
import {
  IconSearch,
  IconAdjustments,
  IconFileText,
  IconPlus,
  IconFilter,
  IconArrowRight,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { RootState } from "@/src/store/store";
import TenderRow from "@/src/components/tender/TenderRow";
import TenderLeftSidebar from "@/src/components/tender/TenderLeftSidebar";
import TenderBidsSidebar from "@/src/components/tender/TenderBidsSidebar";

const STATUS_FILTER_LABELS: Record<string, string> = {
  "": "All Tenders",
  published: "Published",
  closing: "Closing Soon",
  awarded: "Awarded",
  draft: "Draft",
  cancelled: "Cancelled",
};

export default function TendersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [now] = useState(() => Date.now());

  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role == "Admin";
  const isVendor = user?.role == "Vendor";

  const {
    data: tenders = [],
    isLoading,
    isError,
  } = useGetTendersQuery(search ? { title: search } : {});

  const filtered = tenders.filter((t) => {
    if (category && t.name?.toLowerCase() !== category.toLowerCase())
      return false;
    if (statusFilter === "closing") {
      const days = Math.ceil(
        (new Date(t.closingDate).getTime() - now) / 86_400_000,
      );
      return days >= 0 && days <= 7;
    }
    if (statusFilter) return t.status === statusFilter;
    return true;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortNewest
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const stats = {
    total: tenders.length,
    published: tenders.filter((t) => t.status === "published").length,
    closing: tenders.filter((t) => {
      const d = Math.ceil(
        (new Date(t.closingDate).getTime() - now) / 86_400_000,
      );
      return d >= 0 && d <= 7;
    }).length,
  };

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden mt-14">
        <TenderLeftSidebar
          stats={stats}
          category={category}
          statusFilter={statusFilter}
          onCategoryChange={setCategory}
          onStatusChange={setStatusFilter}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="sticky top-14 z-30 bg-(--bg-base) border-b border-(--border) px-6 py-3 flex items-center gap-3">
            <div className="flex items-center flex-1 bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 gap-2">
              <IconSearch size={14} className="text-(--text-faint) shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenders..."
                className="bg-transparent text-sm text-(--text-primary) placeholder-(--text-faint) outline-none flex-1"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`lg:hidden flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${showFilters ? "border-indigo-500 text-indigo-400 bg-indigo-950/40" : "border-[#2a2620] text-zinc-400 hover:text-white"}`}
            >
              <IconFilter size={14} /> Filters
            </button>
            <select
              value={sortNewest ? "newest" : "oldest"}
              onChange={(e) => setSortNewest(e.target.value === "newest")}
              className="bg-(--bg-elevated) border border-(--border) text-xs text-(--text-primary) rounded-lg px-3 py-2 outline-none cursor-pointer"
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
                <IconPlus size={14} /> New Tender
              </Link>
            )}
          </div>

          <div className="px-6 py-4 flex items-center border-b border-(--border)">
            <div>
              <h1 className="text-sm font-semibold text-(--text-primary)">
                {STATUS_FILTER_LABELS[statusFilter] ?? "All Tenders"}
              </h1>
              <p className="text-xs text-(--text-faint) mt-0.5">
                {isLoading
                  ? "Loading..."
                  : `${sorted.length} result${sorted.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="px-6 py-5 border-b border-(--border) flex items-start gap-4 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-lg bg-(--bg-elevated) shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-(--bg-elevated) rounded w-1/4" />
                      <div className="h-4 bg-(--bg-elevated) rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-red-950/40 flex items-center justify-center mb-4">
                  <IconAdjustments size={20} className="text-red-400" />
                </div>
                <p className="text-sm font-medium text-(--text-primary) mb-1">
                  Failed to load tenders
                </p>
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-(--bg-elevated) flex items-center justify-center mb-4">
                  <IconFileText size={20} className="text-(--text-faint)" />
                </div>
                <p className="text-sm font-medium text-(--text-primary) mb-1">
                  No tenders found
                </p>
                {isAdmin && (
                  <Link
                    href="/tender/create"
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <IconPlus size={14} /> Create first tender
                  </Link>
                )}
              </div>
            ) : (
              sorted.map((t) => <TenderRow key={t.id} tender={t} now={now} />)
            )}
          </div>

          {!isLoading && sorted.length > 0 && (
            <div className="px-6 py-3 border-t border-(--border) flex items-center justify-between">
              <p className="text-xs text-(--text-faint)">
                Showing {sorted.length} of {tenders.length} tenders
              </p>
              <Link
                href="#"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View all <IconArrowRight size={12} />
              </Link>
            </div>
          )}
        </main>

        <TenderBidsSidebar userId={user?.id ?? 0} isVendor={isVendor} />
      </div>
    </div>
  );
}
