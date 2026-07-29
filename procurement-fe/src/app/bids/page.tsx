"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetAllBidsQuery, useUpdateBidStatusMutation } from "@/src/store/api/bidApi";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { Bid } from "@/src/types";
import { notifications } from "@mantine/notifications";
import {
  IconGavel,
  IconCurrencyDollar,
  IconClock,
  IconAlertTriangle,
  IconFileText,
  IconBuildingSkyscraper,
  IconTruck,
  IconDeviceDesktop,
  IconMedicalCross,
  IconSchool,
  IconLeaf,
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconX,
  IconEdit,
} from "@tabler/icons-react";

const BID_STATUS: Record<Bid["bidStatus"], { bg: string; text: string; dot: string }> = {
  pending:  { bg: "bg-yellow-950/60",  text: "text-yellow-400",  dot: "bg-yellow-400"  },
  accepted: { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-950/60",     text: "text-red-400",     dot: "bg-red-400"     },
};

const CATEGORIES = [
  { label: "All Categories", value: "",              icon: <IconFileText size={14} /> },
  { label: "Infrastructure", value: "infrastructure", icon: <IconBuildingSkyscraper size={14} /> },
  { label: "Logistics",      value: "logistics",      icon: <IconTruck size={14} /> },
  { label: "Technology",     value: "technology",     icon: <IconDeviceDesktop size={14} /> },
  { label: "Healthcare",     value: "healthcare",     icon: <IconMedicalCross size={14} /> },
  { label: "Education",      value: "education",      icon: <IconSchool size={14} /> },
  { label: "Environment",    value: "environment",    icon: <IconLeaf size={14} /> },
];

export default function AdminBidsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    if (user && !isAdmin) router.push("/dashboard");
  }, [user, isAdmin, router]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["bidStatus"] | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<Bid["bidStatus"]>("pending");

  const { data: bids = [], isLoading, isError } = useGetAllBidsQuery();
  const { data: tenders = [] } = useGetTendersQuery({});
  const [updateBidStatus, { isLoading: isUpdating }] = useUpdateBidStatusMutation();

  const tenderMap = React.useMemo(() => {
    const m: Record<number, (typeof tenders)[0]> = {};
    tenders.forEach((t) => { m[t.id] = t; });
    return m;
  }, [tenders]);

  const filtered = bids.filter((b) => {
    const tender = tenderMap[b.tenderId];
    const matchCategory = categoryFilter
      ? tender?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchStatus = statusFilter ? b.bidStatus === statusFilter : true;
    return matchCategory && matchStatus;
  });

  const { highest, lowest } = React.useMemo(() => {
    const highMap: Record<number, Bid> = {};
    const lowMap: Record<number, Bid> = {};
    bids.forEach((b) => {
      if (!highMap[b.tenderId] || Number(b.amount) > Number(highMap[b.tenderId].amount)) highMap[b.tenderId] = b;
      if (!lowMap[b.tenderId]  || Number(b.amount) < Number(lowMap[b.tenderId].amount))  lowMap[b.tenderId] = b;
    });
    return {
      highest: Object.values(highMap).sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 6),
      lowest:  Object.values(lowMap).sort((a, b) => Number(a.amount) - Number(b.amount)).slice(0, 6),
    };
  }, [bids]);

  const pending  = filtered.filter((b) => b.bidStatus === "pending").length;
  const accepted = filtered.filter((b) => b.bidStatus === "accepted").length;
  const rejected = filtered.filter((b) => b.bidStatus === "rejected").length;

  function startEdit(bid: Bid) {
    setEditingId(bid.id);
    setEditingStatus(bid.bidStatus);
  }

  async function confirmEdit(bidId: number) {
    try {
      await updateBidStatus({ id: bidId, status: editingStatus }).unwrap();
      notifications.show({ title: "Status updated", message: `Bid #${bidId} marked as ${editingStatus}.`, color: "green" });
    } catch {
      notifications.show({ title: "Error", message: "Failed to update bid status.", color: "red" });
    }
    setEditingId(null);
  }

  function BidCard({ bid, label, color }: { bid: Bid; label: string; color: string }) {
    const tender = tenderMap[bid.tenderId];
    const s = BID_STATUS[bid.bidStatus];
    return (
      <Link
        href={`/tender/${bid.tenderId}`}
        className="block px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:border-indigo-500/40 transition-colors space-y-1.5"
      >
        <div className="flex items-center justify-between gap-1">
          <span className={`text-[9px] font-semibold uppercase tracking-wider ${color}`}>{label}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s?.bg} ${s?.text}`}>
            {bid.bidStatus}
          </span>
        </div>
        <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
          {tender?.title ?? `Tender #${bid.tenderId}`}
        </p>
        <p className={`text-sm font-bold ${color}`}>${Number(bid.amount).toLocaleString()}</p>
        {tender?.name && <p className="text-[10px] text-[var(--text-faint)]">{tender.name}</p>}
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left sidebar */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "18%" }}
        >
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">Category</p>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors text-left ${
                      categoryFilter === cat.value
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className={categoryFilter === cat.value ? "text-indigo-400" : "text-[var(--text-faint)]"}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="h-px bg-[var(--border)]" />

            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">Status</p>
              <nav className="space-y-0.5">
                {(["", "pending", "accepted", "rejected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`w-full flex cursor-pointer items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${
                      statusFilter === s
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="capitalize">{s === "" ? "All" : s}</span>
                    {statusFilter === s && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                ))}
              </nav>
            </div>

            <div className="h-px bg-[var(--border)]" />

            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">Summary</p>
              {[
                { label: "Total bids", value: bids.length },
                { label: "Filtered",   value: filtered.length },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs text-[var(--text-subtle)]">{row.label}</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: bid list */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            <div className="mb-5">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">All Bids</h1>
              <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                {isLoading ? "Loading..." : `${filtered.length} bid${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {!isLoading && filtered.length > 0 && (
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                  <span className="text-xs text-[var(--text-subtle)]">Total</span>
                  <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums">{filtered.length}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-950/30 border border-yellow-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">{pending} pending</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">{accepted} accepted</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-xs text-red-400 font-medium">{rejected} rejected</span>
                </div>
              </div>
            )}

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_150px_1fr] gap-4 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                <span>Tender</span>
                <span>Amount</span>
                <span>Submitted</span>
                <span>Status</span>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 bg-[var(--bg-elevated)] rounded animate-pulse" />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <IconAlertTriangle size={28} className="text-red-400" />
                  <p className="text-sm text-red-400">Failed to load bids.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                    <IconGavel size={22} className="text-[var(--text-faint)]" />
                  </div>
                  <p className="text-sm text-[var(--text-subtle)]">No bids found.</p>
                </div>
              ) : (
                filtered.map((bid) => {
                  const s = BID_STATUS[bid.bidStatus];
                  const tender = tenderMap[bid.tenderId];
                  const isEditing = editingId === bid.id;
                  return (
                    <div
                      key={bid.id}
                      className="grid grid-cols-[1fr_120px_150px_1fr] gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center"
                    >
                      <Link href={`/tender/${bid.tenderId}`} className="group min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors truncate">
                          {tender?.title ?? `Tender #${bid.tenderId}`}
                        </p>
                        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                          {tender?.name ?? ""} · Bid #{bid.id}
                        </p>
                      </Link>

                      <span className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
                        <IconCurrencyDollar size={13} className="text-[var(--text-faint)]" />
                        {Number(bid.amount).toLocaleString()}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-[var(--text-subtle)]">
                        <IconClock size={12} className="text-[var(--text-faint)]" />
                        {new Date(bid.submittedAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value as Bid["bidStatus"])}
                            className="flex-1 bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 cursor-pointer"
                            autoFocus
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => confirmEdit(bid.id)}
                            disabled={isUpdating}
                            className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <IconCheck size={12} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-md border border-[var(--border-strong)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
                            title="Cancel"
                          >
                            <IconX size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${s?.bg} ${s?.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s?.dot}`} />
                            {bid.bidStatus?.charAt(0).toUpperCase() + bid.bidStatus?.slice(1)}
                          </span>
                          <button
                            onClick={() => startEdit(bid)}
                            className="p-1 rounded text-[var(--text-faint)] hover:text-indigo-400 hover:bg-indigo-950/40 transition-colors"
                            title="Edit status"
                          >
                            <IconEdit size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* Right sidebar: Highest & Lowest */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconTrendingUp size={14} className="text-emerald-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">Highest Bids</p>
            </div>
            <div className="h-px bg-[var(--border)]" />

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--bg-elevated)] rounded animate-pulse" />
                ))}
              </div>
            ) : highest.length === 0 ? (
              <p className="text-xs text-[var(--text-subtle)] text-center py-4">No bids yet.</p>
            ) : (
              <div className="space-y-2">
                {highest.map((bid) => (
                  <BidCard key={`h-${bid.id}`} bid={bid} label="Highest" color="text-emerald-400" />
                ))}
              </div>
            )}

            <div className="h-px bg-[var(--border)]" />

            <div className="flex items-center gap-2 px-1">
              <IconTrendingDown size={14} className="text-orange-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">Lowest Bids</p>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--bg-elevated)] rounded animate-pulse" />
                ))}
              </div>
            ) : lowest.length === 0 ? (
              <p className="text-xs text-[var(--text-subtle)] text-center py-4">No bids yet.</p>
            ) : (
              <div className="space-y-2">
                {lowest.map((bid) => (
                  <BidCard key={`l-${bid.id}`} bid={bid} label="Lowest" color="text-orange-400" />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
