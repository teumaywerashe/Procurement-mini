"use client";
import React from "react";
import Link from "next/link";
import {
  IconFileText, IconCircleCheck, IconBan, IconChartBar, IconPencil, IconPlus,
} from "@tabler/icons-react";
import type { Tender, TenderStatus } from "@/src/types";

const STATUS_FILTERS: { label: string; value: TenderStatus | ""; icon: React.ReactNode }[] = [
  { label: "All",       value: "",          icon: <IconFileText size={14} /> },
  { label: "Published", value: "published", icon: <IconCircleCheck size={14} /> },
  { label: "Draft",     value: "draft",     icon: <IconPencil size={14} /> },
  { label: "Closed",    value: "closed",    icon: <IconBan size={14} /> },
  { label: "Awarded",   value: "awarded",   icon: <IconChartBar size={14} /> },
  { label: "Cancelled", value: "cancelled", icon: <IconBan size={14} /> },
];

interface LeftProps {
  tenders: Tender[];
  statusFilter: TenderStatus | "";
  onStatusChange: (v: TenderStatus | "") => void;
}

export function ManageLeftSidebar({ tenders, statusFilter, onStatusChange }: LeftProps) {
  return (
    <aside className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "18%" }}>
      <div className="p-4 space-y-5">
        <div>
          <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">Filter by status</p>
          <nav className="space-y-0.5">
            {STATUS_FILTERS.map((f) => {
              const count = f.value === "" ? tenders.length : tenders.filter((t) => t.status === f.value).length;
              return (
                <button key={f.value} onClick={() => onStatusChange(f.value)}
                  className={`w-full flex cursor-pointer items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${statusFilter === f.value ? "bg-indigo-600/20 text-indigo-300" : "text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-white/5"}`}>
                  <span className="flex items-center gap-2">
                    <span className={statusFilter === f.value ? "text-indigo-400" : "text-[var(--text-faint)]"}>{f.icon}</span>
                    {f.label}
                  </span>
                  <span className={`text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${statusFilter === f.value ? "bg-indigo-600/30 text-indigo-300" : "bg-[var(--bg-elevated)] text-[var(--text-faint)]"}`}>{count}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <Link href="/tender/create" className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors">
          <IconPlus size={13} /> New Tender
        </Link>
      </div>
    </aside>
  );
}

interface RightProps {
  stats: { total: number; published: number; draft: number; awarded: number; closed: number; cancelled: number; closingSoon: number; totalValue: number };
  isLoading: boolean;
}

export function ManageRightSidebar({ stats, isLoading }: RightProps) {
  return (
    <aside className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "20%" }}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <IconChartBar size={14} className="text-indigo-400" />
          <p className="text-xs font-semibold text-[var(--text-primary)]">Tender Stats</p>
        </div>
        <div className="h-px bg-[var(--border)]" />
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {[
              { label: "Total",        value: stats.total,       color: "text-[var(--text-primary)]" },
              { label: "Published",    value: stats.published,   color: "text-emerald-400" },
              { label: "Draft",        value: stats.draft,       color: "text-zinc-400" },
              { label: "Awarded",      value: stats.awarded,     color: "text-indigo-400" },
              { label: "Closed",       value: stats.closed,      color: "text-red-400" },
              { label: "Cancelled",    value: stats.cancelled,   color: "text-orange-400" },
              { label: "Closing soon", value: stats.closingSoon, color: "text-orange-300" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-subtle)]">{stat.label}</span>
                <span className={`text-sm font-bold tabular-nums ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
            <div className="px-3 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
              <p className="text-[10px] text-[var(--text-faint)] mb-0.5">Total estimated value</p>
              <p className="text-sm font-bold text-purple-400">${stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
