"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
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
  IconChartBar,
  IconTrendingUp,
} from "@tabler/icons-react";

const BID_STATUS: Record<
  Bid["bidStatus"],
  { bg: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-yellow-950/60",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  accepted: {
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  rejected: { bg: "bg-red-950/60", text: "text-red-400", dot: "bg-red-400" },
};

const CATEGORIES = [
  { label: "All Categories", value: "", icon: <IconFileText size={14} /> },
  {
    label: "Infrastructure",
    value: "infrastructure",
    icon: <IconBuildingSkyscraper size={14} />,
  },
  { label: "Logistics", value: "logistics", icon: <IconTruck size={14} /> },
  {
    label: "Technology",
    value: "technology",
    icon: <IconDeviceDesktop size={14} />,
  },
  {
    label: "Healthcare",
    value: "healthcare",
    icon: <IconMedicalCross size={14} />,
  },
  { label: "Education", value: "education", icon: <IconSchool size={14} /> },
  { label: "Environment", value: "environment", icon: <IconLeaf size={14} /> },
];

export default function MyBidsPage() {
  const router = useRouter();
  const {user} = useSelector((s: RootState) => s.auth);
  const isVendor = user?.role === "Vendor";

  useEffect(() => {
    if (user && !isVendor) router.push("/dashboard");
  }, [user, isVendor, router]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["bidStatus"] | "">("");

  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, {
    skip: !isVendor,
  });
  const {
    data: bids = [],
    isLoading,
    isError,
  } = useGetBidsByVendorQuery(vendor?.id ?? 0, {
    skip: !vendor?.id,
  });
  const { data: tenders = [] } = useGetTendersQuery({});

  const tenderMap = React.useMemo(() => {
    const m: Record<number, (typeof tenders)[0]> = {};
    tenders.forEach((t) => {
      m[t.id] = t;
    });
    return m;
  }, [tenders]);

  const filtered = bids.filter((b) => {
    const tender = tenderMap[b.tenderId];
    const matchCat = categoryFilter
      ? tender?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchStatus = statusFilter ? b.bidStatus === statusFilter : true;
    return matchCat && matchStatus;
  });

  const pending = bids.filter((b) => b.bidStatus === "pending").length;
  const accepted = bids.filter((b) => b.bidStatus === "accepted").length;
  const rejected = bids.filter((b) => b.bidStatus === "rejected").length;
  const totalValue = bids.reduce((sum, b) => sum + Number(b.amount), 0);
  const highestBid = bids.reduce(
    (max, b) => Math.max(max, Number(b.amount)),
    0,
  );
  const successRate =
    bids.length > 0 ? Math.round((accepted / bids.length) * 100) : 0;

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
                    <span
                      className={
                        categoryFilter === cat.value
                          ? "text-indigo-400"
                          : "text-[var(--text-faint)]"
                      }
                    >
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
                    {statusFilter === s && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ── Center: Bid list ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            <div className="mb-5">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                My Bids
              </h1>
              <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                Track the status of your submitted bids
              </p>
            </div>

            {!isLoading && bids.length > 0 && (
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                  <span className="text-xs text-[var(--text-subtle)]">
                    Total
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums">
                    {bids.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-950/30 border border-yellow-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">
                    {pending} pending
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">
                    {accepted} accepted
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-800/30 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-xs text-red-400 font-medium">
                    {rejected} rejected
                  </span>
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
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-[var(--bg-elevated)] rounded animate-pulse"
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
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                    <IconGavel size={22} className="text-[var(--text-faint)]" />
                  </div>
                  <p className="text-sm text-[var(--text-subtle)]">
                    {bids.length === 0
                      ? "You haven't submitted any bids yet."
                      : "No bids match the filter."}
                  </p>
                  {bids.length === 0 && (
                    <Link
                      href="/tender"
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
                    >
                      <IconFileText size={13} />
                      Browse tenders
                    </Link>
                  )}
                </div>
              ) : (
                filtered.map((bid) => {
                  const s = BID_STATUS[bid.bidStatus];
                  const tender = tenderMap[bid.tenderId];
                  return (
                    <div
                      key={bid.id}
                      className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center"
                    >
                      <Link
                        href={`/tender/${bid.tenderId}`}
                        className="group min-w-0"
                      >
                        <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors truncate">
                          {tender?.title ?? `Tender #${bid.tenderId}`}
                        </p>
                        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                          {tender?.name ?? ""} · Bid #{bid.id}
                        </p>
                      </Link>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
                        <IconCurrencyDollar
                          size={13}
                          className="text-[var(--text-faint)]"
                        />
                        {Number(bid.amount).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-subtle)]">
                        <IconClock
                          size={12}
                          className="text-[var(--text-faint)]"
                        />
                        {new Date(bid.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {bid.bidStatus.charAt(0).toUpperCase() +
                          bid.bidStatus.slice(1)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* ── Right sidebar: Stats ── */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconChartBar size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Bid Statistics
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-[var(--bg-elevated)] rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Success rate */}
                <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                  <p className="text-[10px] text-[var(--text-faint)] mb-1">
                    Success rate
                  </p>
                  <p className="text-xl font-bold text-emerald-400">
                    {successRate}%
                  </p>
                  <div className="mt-2 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>

                {/* Stat cards */}
                {[
                  {
                    label: "Total bids",
                    value: bids.length,
                    color: "text-indigo-400",
                  },
                  {
                    label: "Pending",
                    value: pending,
                    color: "text-yellow-400",
                  },
                  {
                    label: "Accepted",
                    value: accepted,
                    color: "text-emerald-400",
                  },
                  { label: "Rejected", value: rejected, color: "text-red-400" },
                  {
                    label: "Total value",
                    value: `$${totalValue.toLocaleString()}`,
                    color: "text-purple-400",
                  },
                  {
                    label: "Highest bid",
                    value: `$${highestBid.toLocaleString()}`,
                    color: "text-orange-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]"
                  >
                    <span className="text-xs text-[var(--text-subtle)]">
                      {stat.label}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}

                {/* Status breakdown bar */}
                {bids.length > 0 && (
                  <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--text-faint)] mb-2">
                      Status breakdown
                    </p>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      {accepted > 0 && (
                        <div
                          className="bg-emerald-500 rounded-full"
                          style={{
                            width: `${(accepted / bids.length) * 100}%`,
                          }}
                          title={`Accepted: ${accepted}`}
                        />
                      )}
                      {pending > 0 && (
                        <div
                          className="bg-yellow-500 rounded-full"
                          style={{ width: `${(pending / bids.length) * 100}%` }}
                          title={`Pending: ${pending}`}
                        />
                      )}
                      {rejected > 0 && (
                        <div
                          className="bg-red-500 rounded-full"
                          style={{
                            width: `${(rejected / bids.length) * 100}%`,
                          }}
                          title={`Rejected: ${rejected}`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {[
                        {
                          label: "Accepted",
                          color: "bg-emerald-500",
                          count: accepted,
                        },
                        {
                          label: "Pending",
                          color: "bg-yellow-500",
                          count: pending,
                        },
                        {
                          label: "Rejected",
                          color: "bg-red-500",
                          count: rejected,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-1"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.color}`}
                          />
                          <span className="text-[10px] text-[var(--text-faint)]">
                            {item.label}: {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bids.length === 0 && (
                  <div className="text-center py-4">
                    <IconTrendingUp
                      size={24}
                      className="text-[var(--text-faint)] mx-auto mb-2"
                    />
                    <p className="text-xs text-[var(--text-subtle)]">
                      Submit bids to see statistics.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
