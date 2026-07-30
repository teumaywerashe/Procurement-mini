"use client";
import React from "react";
import Link from "next/link";
import { IconBuilding, IconChartBar, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { Vendor } from "@/src/types";


interface LeftProps {
  vendors: Vendor[];
  sortBy: "name" | "newest" | "oldest";
  search: string;
  onSortChange: (v: "name" | "newest" | "oldest") => void;
  onSearchChange: (v: string) => void;
}

export function VendorLeftSidebar({ vendors, sortBy, search, onSortChange, onSearchChange }: LeftProps) {
  const letters = [...new Set(vendors.map((v) => v.name?.[0]?.toUpperCase()).filter(Boolean))].sort() as string[];
  const withPhone   = vendors.filter((v) => v.phoneNumber).length;
  const withEmail = vendors.filter((v) => v.email).length;

  return (
    <aside className="hidden lg:flex flex-col shrink-0 border-r border-(--border)] bg-(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "18%" }}>
      <div className="p-4 space-y-5">
        <div>
          <p className="text-[10px] font-semibold text-(--text-faint)] uppercase tracking-wider px-2 mb-2">Sort</p>
          <nav className="space-y-0.5">
            {([
              { label: "Newest first", value: "newest" as const, icon: <IconSortDescending size={14} /> },
              { label: "Oldest first", value: "oldest" as const, icon: <IconSortAscending size={14} /> },
              { label: "Name (A–Z)",   value: "name"   as const, icon: <IconBuilding size={14} /> },
            ]).map((opt) => (
              <button key={opt.value} onClick={() => onSortChange(opt.value)}
                className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors ${sortBy === opt.value ? "bg-indigo-600/20 text-indigo-300" : "text-(--text-subtle)] hover:text-(--text-primary)] hover:bg-white/5"}`}>
                <span className={sortBy === opt.value ? "text-indigo-400" : "text-(--text-faint)]"}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </nav>
        </div>

        {letters.length > 0 && (
          <>
            <div className="h-px bg-(--border)]" />
            <div>
              <p className="text-[10px] font-semibold text-(--text-faint)] uppercase tracking-wider px-2 mb-2">Filter A–Z</p>
              <div className="flex flex-wrap gap-1 px-2">
                <button onClick={() => onSearchChange("")} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${search === "" ? "bg-indigo-600/20 text-indigo-300" : "text-(--text-faint)] hover:text-(--text-primary)] hover:bg-white/5"}`}>All</button>
                {letters.map((l) => (
                  <button key={l} onClick={() => onSearchChange(l)} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${search === l ? "bg-indigo-600/20 text-indigo-300" : "text-(--text-faint)] hover:text-(--text-primary)] hover:bg-white/5"}`}>{l}</button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-(--border)]" />
        <div>
          <p className="text-[10px] font-semibold text-(--text-faint)] uppercase tracking-wider px-2 mb-2">Quick stats</p>
          {[{ label: "Total vendors", value: vendors.length }, { label: "With phone", value: withPhone }, { label: "With email", value: withEmail }].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs text-(--text-subtle)]">{row.label}</span>
              <span className="text-xs font-semibold text-(--text-primary)] tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

interface RightProps { vendors: Vendor[]; isLoading: boolean; }

export function VendorRightSidebar({ vendors, isLoading }: RightProps) {
  const withPhone   = vendors.filter((v) => v.phoneNumber).length;
  const withEmail = vendors.filter((v) => v.email).length;
  const monthMap: Record<string, number> = {};
  vendors.forEach((v) => {
    const key = new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });
  const months       = Object.entries(monthMap).slice(-6);
  const maxMonthCount = Math.max(...months.map(([, c]) => c), 1);

  return (
    <aside className="hidden xl:flex flex-col shrink-0 border-l border-(--border)] bg-(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "20%" }}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-1"><IconChartBar size={14} className="text-indigo-400" /><p className="text-xs font-semibold text-(--text-primary)]">Vendor Analytics</p></div>
        <div className="h-px bg-(--border)]" />
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-(--bg-elevated)] rounded animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            <div className="px-3 py-3 rounded-lg bg-(--bg-surface)] border border-(--border)] text-center">
              <p className="text-3xl font-bold text-indigo-400 tabular-nums">{vendors.length}</p>
              <p className="text-[10px] text-(--text-faint)] mt-1">Total Vendors</p>
            </div>
            <div className="px-3 py-3 rounded-lg bg-(--bg-surface)] border border-(--border)]">
              <p className="text-[10px] text-(--text-faint)] mb-2">Profile completeness</p>
              {[{ label: "With phone", count: withPhone, color: "bg-indigo-500" }, { label: "With email", count: withEmail, color: "bg-emerald-500" }].map((item) => (
                <div key={item.label} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-[10px] text-(--text-faint)] mb-1"><span>{item.label}</span><span>{vendors.length > 0 ? Math.round((item.count / vendors.length) * 100) : 0}%</span></div>
                  <div className="h-1.5 bg-(--bg-elevated)] rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${vendors.length > 0 ? (item.count / vendors.length) * 100 : 0}%` }} /></div>
                </div>
              ))}
            </div>
            {months.length > 0 && (
              <div className="px-3 py-3 rounded-lg bg-(--bg-surface)] border border-(--border)]">
                <p className="text-[10px] text-(--text-faint)] mb-3">Recent registrations</p>
                <div className="flex items-end gap-1 h-16">
                  {months.map(([month, count]) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-(--text-faint)] tabular-nums">{count}</span>
                      <div className="w-full bg-indigo-500/60 rounded-sm" style={{ height: `${(count / maxMonthCount) * 48}px` }} />
                      <span className="text-[9px] text-(--text-faint)] truncate w-full text-center">{month.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vendors.length > 0 && (
              <div className="px-3 py-3 rounded-lg bg-(--bg-surface)] border border-(--border)]">
                <p className="text-[10px] text-(--text-faint)] mb-2">Recently joined</p>
                <div className="space-y-2">
                  {[...vendors].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map((v) => (
                    <Link key={v.id} href={`/vendors/${v.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-indigo-950/60 flex items-center justify-center shrink-0"><IconBuilding size={11} className="text-indigo-400" /></div>
                      <div className="min-w-0"><p className="text-xs font-medium text-(--text-primary)] truncate">{v.name}</p><p className="text-[10px] text-(--text-faint)]">{new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
