"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import {
  IconFileText,
  IconUsers,
  IconGavel,
  IconClock,
  IconChevronRight,
  IconPlus,
  IconTrendingUp,
  IconLayoutDashboard,
} from "@tabler/icons-react";

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-zinc-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const now = React.useMemo(() => Date.now(), []);

  const { data: tenders = [], isLoading: tendersLoading } = useGetTendersQuery(
    {},
  );
  const { data: vendors = [], isLoading: vendorsLoading } = useGetVendorsQuery(
    undefined,
    { skip: !isAdmin },
  );
  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, {
    skip: !isVendor,
  });
  const { data: myBids = [], isLoading: bidsLoading } = useGetBidsByVendorQuery(
    vendor?.id ?? 0,
    {
      skip: !vendor?.id,
    },
  );
  console.log({"Tenders": tenders,"Vendors": vendors,"My Bids": myBids });
  const published = tenders.filter((t) => t.status === "published");
  const closingSoon = tenders.filter((t) => {
    const d = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000);
    return d >= 0 && d <= 7 && t.status === "published";
  });
  const recentTenders = [...tenders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const pendingBids = myBids.filter((b) => b.status === "pending");
  const acceptedBids = myBids.filter((b) => b.status === "accepted");

  const quickLinks = [
    {
      href: "/tender",
      icon: <IconFileText size={15} />,
      label: "Browse tenders",
      color: "text-indigo-400",
      always: true,
    },
    {
      href: "/bids/my",
      icon: <IconGavel size={15} />,
      label: "My bids",
      color: "text-yellow-400",
      always: false,
      vendorOnly: true,
    },
    {
      href: "/tender/create",
      icon: <IconPlus size={15} />,
      label: "Create tender",
      color: "text-emerald-400",
      always: false,
      adminOnly: true,
    },
    {
      href: "/tender/manage",
      icon: <IconFileText size={15} />,
      label: "Manage tenders",
      color: "text-orange-400",
      always: false,
      adminOnly: true,
    },
    {
      href: "/vendors",
      icon: <IconUsers size={15} />,
      label: "Manage vendors",
      color: "text-purple-400",
      always: false,
      adminOnly: true,
    },
  ].filter(
    (l) => l.always || (l.adminOnly && isAdmin) || (l.vendorOnly && isVendor),
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-6">
            {/* Overview stats */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                Overview
              </p>
              {[
                {
                  label: "Total tenders",
                  value: tendersLoading ? "—" : tenders.length,
                },
                {
                  label: "Active",
                  value: tendersLoading ? "—" : published.length,
                },
                {
                  label: "Closing soon",
                  value: tendersLoading ? "—" : closingSoon.length,
                },
                ...(isAdmin
                  ? [
                      {
                        label: "Vendors",
                        value: vendorsLoading ? "—" : vendors.length,
                      },
                    ]
                  : []),
                ...(isVendor
                  ? [
                      {
                        label: "My bids",
                        value: bidsLoading ? "—" : myBids.length,
                      },
                    ]
                  : []),
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between px-2 py-1.5"
                >
                  <span className="text-xs text-zinc-500">{s.label}</span>
                  <span className="text-xs font-semibold text-white tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#1e1c18]" />

            {/* Quick Actions nav */}
            <div>
              <div className="flex items-center gap-2 px-2 mb-2">
                <IconLayoutDashboard size={12} className="text-zinc-600" />
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  Quick Actions
                </p>
              </div>
              <nav className="space-y-0.5">
                {quickLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className={l.color}>{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white">
                Welcome back, {user?.name?.split(" ")[0] ?? "User"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1 capitalize">
                {user?.role} account
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<IconFileText size={18} className="text-indigo-400" />}
                label="Total Tenders"
                value={tendersLoading ? "—" : tenders.length}
                sub={`${published.length} active`}
                color="bg-indigo-950/60"
              />
              <StatCard
                icon={<IconClock size={18} className="text-orange-400" />}
                label="Closing Soon"
                value={tendersLoading ? "—" : closingSoon.length}
                sub="Within 7 days"
                color="bg-orange-950/60"
              />
              {isAdmin ? (
                <StatCard
                  icon={<IconUsers size={18} className="text-emerald-400" />}
                  label="Registered Vendors"
                  value={vendorsLoading ? "—" : vendors.length}
                  color="bg-emerald-950/60"
                />
              ) : (
                <StatCard
                  icon={<IconGavel size={18} className="text-yellow-400" />}
                  label="My Bids"
                  value={bidsLoading ? "—" : myBids.length}
                  sub={`${pendingBids.length} pending`}
                  color="bg-yellow-950/60"
                />
              )}
              <StatCard
                icon={<IconTrendingUp size={18} className="text-purple-400" />}
                label={isAdmin ? "Awarded" : "Accepted Bids"}
                value={
                  isAdmin
                    ? tenders.filter((t) => t.status === "awarded").length
                    : acceptedBids.length
                }
                color="bg-purple-950/60"
              />
            </div>

            {/* Recent tenders */}
            <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                  Recent Tenders
                </h2>
                <Link
                  href="/tender"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View all <IconChevronRight size={13} />
                </Link>
              </div>
              <div>
                {tendersLoading ? (
                  <div className="p-5 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-[#14120e] rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : recentTenders.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-zinc-600">
                    No tenders yet.
                  </div>
                ) : (
                  recentTenders.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tender/${t.id}`}
                      className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                          {t.title}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {t.referenceNumber}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                          t.status === "published"
                            ? "bg-emerald-950/60 text-emerald-400"
                            : t.status === "awarded"
                              ? "bg-indigo-950/60 text-indigo-400"
                              : t.status === "closed"
                                ? "bg-red-950/60 text-red-400"
                                : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              {isAdmin && (
                <div className="px-5 py-3 border-t border-[#2a2620]">
                  <Link
                    href="/tender/create"
                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <IconPlus size={13} /> Create new tender
                  </Link>
                </div>
              )}
            </div>

            {/* Vendor: recent bids */}
            {isVendor && (
              <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    My Recent Bids
                  </h2>
                  <Link
                    href="/bids/my"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    View all <IconChevronRight size={13} />
                  </Link>
                </div>
                <div>
                  {bidsLoading ? (
                    <div className="p-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 bg-[#14120e] rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : myBids.length === 0 ? (
                    <div className="px-5 py-6 text-center text-xs text-zinc-600">
                      No bids submitted yet.
                    </div>
                  ) : (
                    myBids.slice(0, 3).map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between px-5 py-3 border-b border-[#1e1c18]"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">
                            Tender #{bid.tenderId}
                          </p>
                          <p className="text-[11px] text-zinc-600">
                            ${Number(bid.amount).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            bid.status === "accepted"
                              ? "bg-emerald-950/60 text-emerald-400"
                              : bid.status === "rejected"
                                ? "bg-red-950/60 text-red-400"
                                : "bg-yellow-950/60 text-yellow-400"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── Right sidebar: Tender stats ── */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconTrendingUp size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Tender Overview
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {tendersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  {
                    label: "Total tenders",
                    value: tenders.length,
                    color: "text-[var(--text-primary)]",
                  },
                  {
                    label: "Published",
                    value: published.length,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Closing soon",
                    value: closingSoon.length,
                    color: "text-orange-400",
                  },
                  {
                    label: "Awarded",
                    value: tenders.filter((t) => t.status === "awarded").length,
                    color: "text-indigo-400",
                  },
                  {
                    label: "Closed",
                    value: tenders.filter((t) => t.status === "closed").length,
                    color: "text-red-400",
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

                {/* Status bar */}
                {tenders.length > 0 && (
                  <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--text-faint)] mb-2">
                      Distribution
                    </p>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      {published.length > 0 && (
                        <div
                          className="bg-emerald-500"
                          style={{
                            width: `${(published.length / tenders.length) * 100}%`,
                          }}
                        />
                      )}
                      {tenders.filter((t) => t.status === "draft").length >
                        0 && (
                        <div
                          className="bg-zinc-500"
                          style={{
                            width: `${(tenders.filter((t) => t.status === "draft").length / tenders.length) * 100}%`,
                          }}
                        />
                      )}
                      {tenders.filter((t) => t.status === "awarded").length >
                        0 && (
                        <div
                          className="bg-indigo-500"
                          style={{
                            width: `${(tenders.filter((t) => t.status === "awarded").length / tenders.length) * 100}%`,
                          }}
                        />
                      )}
                      {tenders.filter((t) => t.status === "closed").length >
                        0 && (
                        <div
                          className="bg-red-500"
                          style={{
                            width: `${(tenders.filter((t) => t.status === "closed").length / tenders.length) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {[
                        { label: "Published", color: "bg-emerald-500" },
                        { label: "Draft", color: "bg-zinc-500" },
                        { label: "Awarded", color: "bg-indigo-500" },
                        { label: "Closed", color: "bg-red-500" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-1"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.color}`}
                          />
                          <span className="text-[10px] text-[var(--text-faint)]">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isVendor && (
                  <>
                    <div className="h-px bg-[var(--border)]" />
                    <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-1">
                      My Bids
                    </p>
                    {[
                      {
                        label: "Total bids",
                        value: myBids.length,
                        color: "text-[var(--text-primary)]",
                      },
                      {
                        label: "Pending",
                        value: myBids.filter((b) => b.status === "pending")
                          .length,
                        color: "text-yellow-400",
                      },
                      {
                        label: "Accepted",
                        value: myBids.filter((b) => b.status === "accepted")
                          .length,
                        color: "text-emerald-400",
                      },
                      {
                        label: "Rejected",
                        value: myBids.filter((b) => b.status === "rejected")
                          .length,
                        color: "text-red-400",
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
                  </>
                )}
              </div>
            )}

            <Link
              href="/tender"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Browse tenders
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
