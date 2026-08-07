"use client";

import { useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetAllBidsQuery,
  useUpdateBidStatusMutation,
} from "@/src/store/api/bidApi";
import type { Bid, CollectionResult } from "@/src/types";
import type { DataTableColumn } from "mantine-datatable";
import { notifications } from "@mantine/notifications";
import { EntityTable } from "@/src/components/shared/EntityTable";
import { useCollectionQuery } from "@/src/hooks/useCollectionQuery";
import SidebarCategoryFilter from "@/src/components/shared/SidebarCategoryFilter";
import BidStatsRow from "@/src/components/bids/BidStatsRow";
import AdminBidsRightSidebar from "@/src/components/bids/AdminBidsRightSidebar";

const STATUS_COLORS: Record<Bid["bidStatus"], string> = {
  pending: "bg-yellow-950/60 text-yellow-400",
  accepted: "bg-emerald-950/60 text-emerald-400",
  rejected: "bg-red-950/60 text-red-400",
};

export default function AdminBidsPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["bidStatus"] | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] =
    useState<Bid["bidStatus"]>("pending");

  const { query, setQuery } = useCollectionQuery({ defaultSortBy: "id" });
  const { data: bids = [], isLoading, isError } = useGetAllBidsQuery();
  const [updateBidStatus, { isLoading: isUpdating }] =
    useUpdateBidStatusMutation();

  // Client-side filter + paginate (bid endpoint not yet paginated server-side)
  const filtered = bids.filter((b) => {
    const matchCat = categoryFilter
      ? b.tender?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchStatus = statusFilter ? b.bidStatus === statusFilter : true;
    return matchCat && matchStatus;
  });

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const result: CollectionResult<Bid> = {
    data: paginated,
    total: filtered.length,
    page,
    limit,
  };

  const pending = filtered.filter((b) => b.bidStatus === "pending").length;
  const accepted = filtered.filter((b) => b.bidStatus === "accepted").length;
  const rejected = filtered.filter((b) => b.bidStatus === "rejected").length;

  async function confirmEdit(bidId: number) {
    try {
      await updateBidStatus({ id: bidId, status: editingStatus }).unwrap();
      notifications.show({
        title: "Status updated",
        message: `Bid #${bidId} marked as ${editingStatus}.`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update bid status.",
        color: "red",
      });
    }
    setEditingId(null);
  }

  const COLUMNS: DataTableColumn<Bid>[] = [
    {
      accessor: "tender",
      title: "Tender",
      render: (b) => (
        <div>
          <p className="text-sm font-medium text-(--text-primary)">
            {b.tender?.title ?? `Tender #${b.tenderId}`}
          </p>
          <p className="text-xs text-(--text-faint)">{b.referenceNumber}</p>
        </div>
      ),
    },
    {
      accessor: "amount",
      title: "Amount",
      render: (b) => `$${Number(b.amount).toLocaleString()}`,
    },
    {
      accessor: "submittedAt",
      title: "Submitted",
      render: (b) =>
        new Date(b.submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      accessor: "bidStatus",
      title: "Status",
      render: (b) =>
        editingId === b.id ? (
          <div className="flex items-center gap-2">
            <select
              value={editingStatus}
              onChange={(e) =>
                setEditingStatus(e.target.value as Bid["bidStatus"])
              }
              className="text-xs bg-(--bg-elevated) border border-(--border) rounded px-2 py-1 text-(--text-primary) outline-none"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => confirmEdit(b.id)}
              disabled={isUpdating}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="text-xs text-(--text-faint) hover:text-(--text-primary)"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(b.id);
              setEditingStatus(b.bidStatus);
            }}
            className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer ${STATUS_COLORS[b.bidStatus]}`}
          >
            {b.bidStatus}
          </button>
        ),
    },
  ];

  return (
    <div className="h-screen bg-(--bg-base) text-(--text-primary) flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <SidebarCategoryFilter
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-(--border)">
            <h1 className="text-sm font-semibold text-(--text-primary)">
              All Bids
            </h1>
            <p className="text-xs text-(--text-faint) mt-0.5">
              {isLoading
                ? "Loading..."
                : `${filtered.length} bid${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {!isLoading && filtered.length > 0 && (
            <div className="px-4 sm:px-6 pt-4">
              <BidStatsRow
                total={filtered.length}
                pending={pending}
                accepted={accepted}
                rejected={rejected}
              />
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
            {isError ? (
              <p className="text-sm text-red-400 py-8 text-center">
                Failed to load bids.
              </p>
            ) : (
              <EntityTable<Bid>
                result={result}
                isLoading={isLoading}
                columns={COLUMNS}
                query={query}
                onQueryChange={setQuery}
              />
            )}
          </div>
        </main>

        <AdminBidsRightSidebar bids={bids} isLoading={isLoading} />
      </div>
    </div>
  );
}
