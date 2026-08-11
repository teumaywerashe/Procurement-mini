"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetTendersQuery,
  useDeleteTenderMutation,
} from "@/src/store/api/tenderApi";
import type { Tender, TenderStatus } from "@/src/types";
import type { DataTableColumn } from "mantine-datatable";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { EntityTable } from "@/src/components/shared/EntityTable";
import { useCollectionQuery } from "@/src/hooks/useCollectionQuery";
import {
  ManageLeftSidebar,
  ManageRightSidebar,
} from "@/src/components/tender/ManageTenderSidebars";
import DeleteModal from "@/src/components/tender/DeleteModal";
import {
  TENDER_STATUS_COLORS,
  daysLeft,
} from "@/src/components/shared/constants";

const now = Date.now();

export default function ManageTendersPage() {
  return (
    <Suspense>
      <ManageTendersContent />
    </Suspense>
  );
}

function ManageTendersContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "">("");
  const [toDelete, setToDelete] = useState<Tender | null>(null);

  const { query, setQuery } = useCollectionQuery({
    defaultSortBy: "createdAt",
  });
  const { data: result, isLoading, isError } = useGetTendersQuery(query);
  const tenders = result?.data ?? [];

  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();

  const stats = {
    total: result?.total ?? 0,
    published: tenders.filter((t) => t.status === "published").length,
    draft: tenders.filter((t) => t.status === "draft").length,
    closed: tenders.filter((t) => t.status === "closed").length,
    awarded: tenders.filter((t) => t.status === "awarded").length,
    cancelled: tenders.filter((t) => t.status === "cancelled").length,
    closingSoon: tenders.filter((t) => {
      const d = Math.ceil(
        (new Date(t.closingDate).getTime() - now) / 86_400_000,
      );
      return d >= 0 && d <= 7 && t.status === "published";
    }).length,
    totalValue: tenders.reduce((sum, t) => sum + Number(t.estimatedValue), 0),
  };

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteTender(toDelete.id).unwrap();
      notifications.show({
        title: "Deleted",
        message: `"${toDelete.title}" has been deleted.`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete tender.",
        color: "red",
      });
    }
    setToDelete(null);
  }

  const COLUMNS: DataTableColumn<Tender>[] = [
    {
      accessor: "title",
      title: "Tender",
      sortable: true,
      render: (t) => (
        <div>
          <p className="text-sm font-medium text-(--text-primary)">{t.title}</p>
          <p className="text-xs text-(--text-faint)">{t.name}</p>
        </div>
      ),
    },
    {
      accessor: "status",
      title: "Status",
      render: (t) => {
        const s = TENDER_STATUS_COLORS[t.status] ?? TENDER_STATUS_COLORS.draft;
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
          </span>
        );
      },
    },
    {
      accessor: "estimatedValue",
      title: "Value",
      sortable: true,
      render: (t) => `$${Number(t.estimatedValue).toLocaleString()}`,
    },
    {
      accessor: "closingDate",
      title: "Closing",
      sortable: true,
      render: (t) => daysLeft(t.closingDate),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "center",
      render: (t) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tenders/${t.id}/edit`);
            }}
            className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-faint) hover:text-indigo-400 transition-colors"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToDelete(t);
            }}
            className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-faint) hover:text-red-400 transition-colors"
          >
            <IconTrash size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen bg-(--bg-base) text-(--text-primary) flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <ManageLeftSidebar
          tenders={tenders}
          statusFilter={(query.status as TenderStatus) ?? ""}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setQuery({ status: s || undefined });
          }}
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
            <Link
              href="/tenders/create"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
            >
              <IconPlus size={14} />
              <span className="hidden sm:inline">New Tender</span>
            </Link>
          </div>

          <div className="px-4 sm:px-6 py-3 border-b border-(--border) flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-(--text-primary)">
                Manage Tenders
              </h1>
              <p className="text-xs text-(--text-faint) mt-0.5">
                {isLoading ? "Loading..." : `${result?.total ?? 0} total`}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
            {isError ? (
              <p className="text-sm text-red-400 py-8 text-center">
                Failed to load tenders.
              </p>
            ) : (
              <EntityTable<Tender>
                result={result}
                isLoading={isLoading}
                columns={COLUMNS}
                query={query}
                onQueryChange={setQuery}
                onRowClick={(t) => router.push(`/tenders/${t.id}`)}
              />
            )}
          </div>
        </main>

        <ManageRightSidebar stats={stats} isLoading={isLoading} />
      </div>

      {toDelete && (
        <DeleteModal
          tender={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
