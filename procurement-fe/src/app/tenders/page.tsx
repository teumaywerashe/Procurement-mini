/* eslint-disable react-hooks/purity */
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { RootState } from "@/src/store/store";
import type { Tender } from "@/src/types";
import type { DataTableColumn } from "mantine-datatable";
import { EntityTable } from "@/src/components/shared/EntityTable";
import { useCollectionQuery } from "@/src/hooks/useCollectionQuery";
import TenderLeftSidebar from "@/src/components/tender/TenderLeftSidebar";
import TenderBidsSidebar from "@/src/components/tender/TenderBidsSidebar";
import {
  TENDER_STATUS_COLORS,
  daysLeft,
} from "@/src/components/shared/constants";

function statusBadge(status: Tender["status"]) {
  const s = TENDER_STATUS_COLORS[status] ?? TENDER_STATUS_COLORS.draft;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const COLUMNS: DataTableColumn<Tender>[] = [
  {
    accessor: "title",
    title: "Title",
    sortable: true,
    render: (t) => (
      <div>
        <p className="font-medium text-(--text-primary)">{t.title}</p>
        {t.user?.name && (
          <p className="text-xs text-(--text-faint) mt-0.5">{t.user.name}</p>
        )}
      </div>
    ),
  },
  {
    accessor: "status",
    title: "Status",
    render: (t) => statusBadge(t.status),
  },
  {
    accessor: "estimatedValue",
    title: "Value",
    sortable: true,
    render: (t) => `${Number(t.estimatedValue).toLocaleString()}`,
  },
  {
    accessor: "closingDate",
    title: "Closing",
    sortable: true,
    render: (t) => daysLeft(t.closingDate),
  },
  {
    accessor: "referenceNumber",
    title: "Reference",
    render: (t) => (
      <span className="text-xs text-(--text-faint)">{t.referenceNumber}</span>
    ),
  },
];

export default function TendersPage() {
  return (
    <Suspense>
      <TendersPageContent />
    </Suspense>
  );
}

function TendersPageContent() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";

  const { query, setQuery } = useCollectionQuery({
    defaultSortBy: "createdAt",
  });
  const { data: result, isLoading, isError } = useGetTendersQuery(query);

  const filteredData = (result?.data ?? []).filter((t) => {
    // Status filter
    if (query.status === "closing") {
      const d = Math.ceil(
        (new Date(t.closingDate).getTime() - Date.now()) / 86_400_000,
      );
      if (d < 0 || d > 7) return false;
    } else if (query.status) {
      if (t.status !== query.status) return false;
    }

    if (query.category) {
      if (!t.name?.toLowerCase().includes(query.category.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // Compute stats from filtered results
  const stats = {
    total: filteredData.length,
    published: filteredData.filter((t) => t.status === "published").length,
    closing: filteredData.filter((t) => {
      const d = Math.ceil(
        (new Date(t.closingDate).getTime() - Date.now()) / 86_400_000,
      );
      return d >= 0 && d <= 7;
    }).length,
  };

  return (
    <div className="h-screen bg-(--bg-base) text-(--text-primary) flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <TenderLeftSidebar
          stats={stats}
          category={query.category ?? ""}
          statusFilter={query.status ?? ""}
          onCategoryChange={(c) => setQuery({ category: c || undefined })}
          onStatusChange={(s) => setQuery({ status: s || undefined })}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="sticky top-0 z-30 bg-(--bg-base) border-b border-(--border) px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={query.q ?? ""}
              onChange={(e) => setQuery({ q: e.target.value || undefined })}
              placeholder="Search tenders..."
              className="flex-1 min-w-0 bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text-primary) placeholder-(--text-faint) outline-none"
            />
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

          <div className="px-4 sm:px-6 py-3 flex items-center border-b border-(--border)">
            <div>
              <h1 className="text-sm font-semibold text-(--text-primary)">
                Tenders
              </h1>
              <p className="text-xs text-(--text-faint) mt-0.5">
                {isLoading
                  ? "Loading..."
                  : `${stats.total} result${stats.total !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            {isError ? (
              <p className="text-sm text-red-400 py-8 text-center">
                Failed to load tenders.
              </p>
            ) : (
              <EntityTable<Tender>
                result={{
                  data: filteredData,
                  total: stats.total,
                  page: result?.page ?? 1,
                  limit: result?.limit ?? 10,
                }}
                isLoading={isLoading}
                columns={COLUMNS}
                query={query}
                onQueryChange={setQuery}
                onRowClick={(t) => router.push(`/tenders/${t.id}`)}
              />
            )}
          </div>
        </main>

        <TenderBidsSidebar userId={user?.id ?? 0} isVendor={isVendor} />
      </div>
    </div>
  );
}
