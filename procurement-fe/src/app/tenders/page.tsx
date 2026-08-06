"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import Link from "next/link";
import {
  IconSearch,
  IconAdjustments,
  IconFileText,
  IconPlus,
  IconFilter,
  IconArrowRight,
  IconX,
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
  return (
    <Suspense>
      <TendersPageContent />
    </Suspense>
  );
}

function TendersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") ?? "",
  );
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortNewest, setSortNewest] = useState(
    searchParams.get("sort") !== "oldest",
  );
  const [now] = useState(() => Date.now());

  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role == "Admin";
  const isVendor = user?.role == "Vendor";

  const {
    data: tenders = [],
    isLoading,
    isError,
  } = useGetTendersQuery({
    ...(search ? { title: search } : {}),
  });

  const syncUrl = useCallback(
    (
      overrides: Partial<{
        search: string;
        status: string;
        category: string;
        sort: string;
      }>,
    ) => {
      const params = new URLSearchParams();
      const s = overrides.search ?? search;
      const st = overrides.status ?? statusFilter;
      const cat = overrides.category ?? category;
      const sort = overrides.sort ?? (sortNewest ? "newest" : "oldest");

      if (s) params.set("search", s);
      if (st) params.set("status", st);
      if (cat) params.set("category", cat);
      if (sort !== "newest") params.set("sort", sort);

      router.replace(`/tenders?${params.toString()}`, { scroll: false });
    },
    [search, statusFilter, category, sortNewest, router],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    syncUrl({ search: value });
  };

  const handleStatus = (value: string) => {
    setStatusFilter(value);
    syncUrl({ status: value });
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    syncUrl({ category: value });
  };

  const handleSort = (value: string) => {
    setSortNewest(value === "newest");
    syncUrl({ sort: value });
  };

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
          onCategoryChange={handleCategory}
          onStatusChange={handleStatus}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Toolbar */}
          <div className="sticky top-0 z-30 bg-(--bg-base) border-b border-(--border) px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="flex items-center flex-1 bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 gap-2 min-w-0">
              <IconSearch size={14} className="text-(--text-faint) shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tenders..."
                className="bg-transparent text-sm text-(--text-primary) placeholder-(--text-faint) outline-none flex-1 min-w-0"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`lg:hidden flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors shrink-0 ${showFilters ? "border-indigo-500 text-indigo-400 bg-indigo-950/40" : "border-(--border) text-(--text-subtle) hover:text-(--text-primary)"}`}
            >
              {showFilters ? <IconX size={14} /> : <IconFilter size={14} />}
              <span className="hidden xs:inline">Filters</span>
            </button>

            {/* Sort */}
            <select
              value={sortNewest ? "newest" : "oldest"}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-(--bg-elevated) border border-(--border) text-xs text-(--text-primary) rounded-lg px-2 sm:px-3 py-2 outline-none cursor-pointer shrink-0"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            {isAdmin && (
              <Link
                href="/tenders/create"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
              >
                <IconPlus size={14} />
                <span className="hidden sm:inline">New Tender</span>
              </Link>
            )}
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden border-b border-(--border) bg-(--bg-base) px-4 py-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider mb-2">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_FILTER_LABELS).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => {
                        handleStatus(val);
                        setShowFilters(false);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === val ? "border-indigo-500 bg-indigo-600/20 text-indigo-300" : "border-(--border) text-(--text-subtle) hover:text-(--text-primary)"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-4 sm:px-6 py-3 flex items-center border-b border-(--border)">
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
                    className="px-4 sm:px-6 py-5 border-b border-(--border) flex items-start gap-4 animate-pulse"
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
                    href="/tenders/create"
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
            <div className="px-4 sm:px-6 py-3 border-t border-(--border) flex items-center justify-between">
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
