"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetAllBidsQuery,
  useUpdateBidStatusMutation,
} from "@/src/store/api/bidApi";
import type { Bid } from "@/src/types";
import { notifications } from "@mantine/notifications";
import { IconGavel, IconAlertTriangle } from "@tabler/icons-react";
import SidebarCategoryFilter from "@/src/components/shared/SidebarCategoryFilter";
import BidStatsRow from "@/src/components/bids/BidStatsRow";
import AdminBidTableRow from "@/src/components/bids/AdminBidTableRow";
import AdminBidsRightSidebar from "@/src/components/bids/AdminBidsRightSidebar";

export default function AdminBidsPage() {
 

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["bidStatus"] | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] =
    useState<Bid["bidStatus"]>("pending");

  const { data: bids = [], isLoading, isError } = useGetAllBidsQuery();
  const [updateBidStatus, { isLoading: isUpdating }] =
    useUpdateBidStatusMutation();

  const filtered = bids.filter((b) => {
    const matchCat = categoryFilter
      ? b.tender?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchStatus = statusFilter ? b.bidStatus === statusFilter : true;
    return matchCat && matchStatus;
  });

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

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <SidebarCategoryFilter
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6">
            <div className="mb-5">
              <h1 className="text-lg font-bold text-(--text-primary)">
                All Bids
              </h1>
              <p className="text-xs text-(--text-subtle) mt-0.5">
                {isLoading
                  ? "Loading..."
                  : `${filtered.length} bid${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {!isLoading && filtered.length > 0 && (
              <BidStatsRow
                total={filtered.length}
                pending={pending}
                accepted={accepted}
                rejected={rejected}
              />
            )}

            <div className="bg-(--bg-surface)  border border-(--border) rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-[0.8fr_120px_150px_100px] gap-4 px-5 py-3 border-b border-(--border) text-[11px] font-semibold text-(--text-faint) uppercase tracking-wider">
                <span>Tender</span>
                <span>Amount</span>
                <span>Submitted</span>
                <span>Status</span>
              </div>
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-(--bg-elevated)rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <IconAlertTriangle size={28} className="text-red-400" />
                  <p className="text-sm text-red-400">Failed to load bids.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-full bg-(--bg-elevated) flex items-center justify-center">
                    <IconGavel size={22} className="text-(--text-faint)" />
                  </div>
                  <p className="text-sm text-(--text-subtle)">No bids found.</p>
                </div>
              ) : (
                filtered.map((bid) => (
                  
                  <AdminBidTableRow
                    key={bid.id}
                    bid={bid}
                    isEditing={editingId === bid.id}
                    editingStatus={editingStatus}
                    isUpdating={isUpdating}
                    onEdit={(b) => {
                      setEditingId(b.id);
                      setEditingStatus(b.bidStatus);
                    }}
                    onConfirm={confirmEdit}
                    onCancel={() => setEditingId(null)}
                    onStatusChange={setEditingStatus}
                  />
                 
                ))
              )}
            </div>
          </div>
        </main>

        <AdminBidsRightSidebar
          bids={bids}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
