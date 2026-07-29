"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetAllBidsQuery } from "@/src/store/api/bidApi";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { Bid } from "@/src/types";
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
} from "@tabler/icons-react";

const BID_STATUS: Record<Bid["status"], { bg: string; text: string; dot: string }> = {
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
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (user && !isAdmin) router.push("/dashboard");
  }, [user, isAdmin, router]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["status"] | "">("");

  const { data: bids = [], isLoading, isError } = useGetAllBidsQuery();
  const { data: tenders = [] } = useGetTendersQuery({});

  // Map tenderId -> tender for category lookup
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
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    return matchCategory && matchStatus;
  });

  // Highest bid per tender for the right sidebar
  const highestBidPerTender = React.useMemo(() => {
    const map: Record<number, Bid> = {};
    bids.forEach((b) => {
      if (!map[b.tenderId] || Number(b.amount) > Number(map[b.tenderId].amount)) {
        map[b.tenderId] = b;
      }
    });
    return Object.values(map)
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 8);
  }, [bids]);

  const pending  = filtered.filter((b) => b.status === "pending").length;
  const accepted = filtered.filter((b) => b.status === "accepted").length;
  const rejected = filtered.filter((b) => b.status === "rejected").length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar: Category filter ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "18%" }}
        >
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Category
              </p>
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
                    <span className={categoryFilter === cat.value ? "text-indigo-400" : "text-[var(--text-faint)]"}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="h-px bg-[var(--border)]" />

            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Status
              </p>
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
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Summary
              </p>
              {[
                { label: "Total bids", value: bids.length },
                { label: "Filtered", value: filtered.length },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs text-[var(--text-subtle)]">{row.label}</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Center: Bid list ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            <div className="mb-5">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">All Bids</h1>
              <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                {isLoading ? "Loading..." : `${filtered.length} bid${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Status pills */}
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
              <div className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
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
                  const s = BID_STATUS[bid.status];
                  const tender = tenderMap[bid.tenderId];
                  return (
                    <div
                      key={bid.id}
                      className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center"
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
                        {new Date(bid.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* ── Right sidebar: Highest bids per tender ── */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconTrendingUp size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">Highest Bids</p>
            </div>
            <div className="h-px bg-[var(--border)]" />
            <p className="text-[10px] text-[var(--text-faint)] px-1">Top bid per tender</p>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--bg-elevated)] rounded animate-pulse" />
                ))}
              </div>
            ) : highestBidPerTender.length === 0 ? (
              <div className="text-center py-8">
                <IconGavel size={24} className="text-[var(--text-faint)] mx-auto mb-2" />
                <p className="text-xs text-[var(--text-subtle)]">No bids yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {highestBidPerTender.map((bid) => {
                  const tender = tenderMap[bid.tenderId];
                  const s = BID_STATUS[bid.status];
                  return (
                    <Link
                      key={bid.id}
                      href={`/tender/${bid.tenderId}`}
                      className="block px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:border-indigo-500/40 transition-colors space-y-1.5"
                    >
                      <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
                        {tender?.title ?? `Tender #${bid.tenderId}`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-400">
                          ${Number(bid.amount).toLocaleString()}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                          {bid.status}
                        </span>
                      </div>
                      {tender?.name && (
                        <p className="text-[10px] text-[var(--text-faint)]">{tender.name}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
