"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import {
  IconSearch,
  IconUsers,
  IconBuilding,
  IconChevronRight,
  IconAlertTriangle,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconChartBar,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

export default function VendorsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "newest" | "oldest">("newest");

  useEffect(() => {
    if (user && !isAdmin) router.push("/dashboard");
  }, [user, isAdmin, router]);

  const { data: vendors = [], isLoading, isError } = useGetVendorsQuery();

  const filtered = vendors
    .filter((v) =>
      search ? (v.companyName ?? "").toLowerCase().includes(search.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortBy === "name") return (a.companyName ?? "").localeCompare(b.companyName ?? "");
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  // Letter groupings for left sidebar
  const letters = [...new Set(vendors.map((v) => v.companyName?.[0]?.toUpperCase()).filter(Boolean))].sort() as string[];

  // Monthly join trend for right sidebar
  const monthMap: Record<string, number> = {};
  vendors.forEach((v) => {
    const key = new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });
  const months = Object.entries(monthMap).slice(-6);
  const maxMonthCount = Math.max(...months.map(([, c]) => c), 1);

  // With phone / with address counts
  const withPhone = vendors.filter((v) => v.contactPhone).length;
  const withAddress = vendors.filter((v) => v.address).length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "18%" }}
        >
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Sort
              </p>
              <nav className="space-y-0.5">
                {([
                  { label: "Newest first",  value: "newest" as const, icon: <IconSortDescending size={14} /> },
                  { label: "Oldest first",  value: "oldest" as const, icon: <IconSortAscending size={14} /> },
                  { label: "Name (A–Z)",    value: "name"   as const, icon: <IconBuilding size={14} /> },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors ${
                      sortBy === opt.value
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className={sortBy === opt.value ? "text-indigo-400" : "text-[var(--text-faint)]"}>
                      {opt.icon}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </nav>
            </div>

            {letters.length > 0 && (
              <>
                <div className="h-px bg-[var(--border)]" />
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                    Filter A–Z
                  </p>
                  <div className="flex flex-wrap gap-1 px-2">
                    <button
                      onClick={() => setSearch("")}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        search === ""
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      All
                    </button>
                    {letters.map((l) => (
                      <button
                        key={l}
                        onClick={() => setSearch(l)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          search === l
                            ? "bg-indigo-600/20 text-indigo-300"
                            : "text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="h-px bg-[var(--border)]" />

            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Quick stats
              </p>
              {[
                { label: "Total vendors", value: vendors.length },
                { label: "With phone",   value: withPhone },
                { label: "With address", value: withAddress },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs text-[var(--text-subtle)]">{row.label}</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Center: Vendor cards ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Header + search */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">Vendors</h1>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                  {isLoading ? "Loading..." : `${filtered.length} registered vendor${filtered.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 gap-2">
                <IconSearch size={14} className="text-[var(--text-faint)] shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by company..."
                  className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none w-44"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <IconAlertTriangle size={28} className="text-red-400" />
                <p className="text-sm text-red-400">Failed to load vendors.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                  <IconUsers size={22} className="text-[var(--text-faint)]" />
                </div>
                <p className="text-sm text-[var(--text-subtle)]">No vendors found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vendors/${v.id}`}
                    className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 hover:border-indigo-500/40 hover:bg-[var(--bg-elevated)] transition-all flex flex-col gap-3"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-indigo-950/60 flex items-center justify-center shrink-0">
                        <IconBuilding size={18} className="text-indigo-400" />
                      </div>
                      <IconChevronRight
                        size={15}
                        className="text-[var(--text-faint)] group-hover:text-indigo-400 transition-colors mt-0.5"
                      />
                    </div>

                    {/* Company name */}
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-indigo-300 transition-colors leading-snug">
                        {v.companyName}
                      </p>
                      <p className="text-[11px] text-[var(--text-faint)] mt-0.5">Vendor ID: {v.id}</p>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-1.5">
                      {v.contactPhone ? (
                        <div className="flex items-center gap-1.5">
                          <IconPhone size={12} className="text-[var(--text-faint)] shrink-0" />
                          <span className="text-xs text-[var(--text-muted)]">{v.contactPhone}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <IconPhone size={12} className="text-[var(--text-faint)] shrink-0" />
                          <span className="text-xs text-[var(--text-faint)] italic">No phone</span>
                        </div>
                      )}
                      {v.address ? (
                        <div className="flex items-center gap-1.5">
                          <IconMapPin size={12} className="text-[var(--text-faint)] shrink-0" />
                          <span className="text-xs text-[var(--text-muted)] truncate">{v.address}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <IconMapPin size={12} className="text-[var(--text-faint)] shrink-0" />
                          <span className="text-xs text-[var(--text-faint)] italic">No address</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <IconCalendar size={12} className="text-[var(--text-faint)] shrink-0" />
                        <span className="text-xs text-[var(--text-faint)]">
                          Since {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ── Right sidebar: Analytics ── */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconChartBar size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">Vendor Analytics</p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-[var(--bg-elevated)] rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Total */}
                <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                  <p className="text-3xl font-bold text-indigo-400 tabular-nums">{vendors.length}</p>
                  <p className="text-[10px] text-[var(--text-faint)] mt-1">Total Vendors</p>
                </div>

                {/* Profile completeness */}
                <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                  <p className="text-[10px] text-[var(--text-faint)] mb-2">Profile completeness</p>
                  {[
                    { label: "With phone",   count: withPhone,   total: vendors.length, color: "bg-indigo-500" },
                    { label: "With address", count: withAddress, total: vendors.length, color: "bg-emerald-500" },
                  ].map((item) => (
                    <div key={item.label} className="mb-2 last:mb-0">
                      <div className="flex justify-between text-[10px] text-[var(--text-faint)] mb-1">
                        <span>{item.label}</span>
                        <span className="tabular-nums">{vendors.length > 0 ? Math.round((item.count / vendors.length) * 100) : 0}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${vendors.length > 0 ? (item.count / vendors.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Monthly registrations */}
                {months.length > 0 && (
                  <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--text-faint)] mb-3">Recent registrations</p>
                    <div className="flex items-end gap-1 h-16">
                      {months.map(([month, count]) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[9px] text-[var(--text-faint)] tabular-nums">{count}</span>
                          <div
                            className="w-full bg-indigo-500/60 rounded-sm"
                            style={{ height: `${(count / maxMonthCount) * 48}px` }}
                            title={`${month}: ${count}`}
                          />
                          <span className="text-[9px] text-[var(--text-faint)] truncate w-full text-center">{month.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recently joined */}
                {vendors.length > 0 && (
                  <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--text-faint)] mb-2">Recently joined</p>
                    <div className="space-y-2">
                      {[...vendors]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 3)
                        .map((v) => (
                          <Link
                            key={v.id}
                            href={`/vendors/${v.id}`}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                          >
                            <div className="w-6 h-6 rounded-full bg-indigo-950/60 flex items-center justify-center shrink-0">
                              <IconBuilding size={11} className="text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{v.companyName}</p>
                              <p className="text-[10px] text-[var(--text-faint)]">
                                {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
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
