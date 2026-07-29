"use client";
import React from "react";
import { CATEGORIES } from "@/src/components/shared/constants";

const STATUS_FILTERS = [
  { label: "All",          value: ""          },
  { label: "Published",    value: "published"  },
  { label: "Closing soon", value: "closing"    },
  { label: "Awarded",      value: "awarded"    },
  { label: "Draft",        value: "draft"      },
  { label: "Cancelled",    value: "cancelled"  },
];

interface Props {
  stats: { total: number; published: number; closing: number };
  category: string;
  statusFilter: string;
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export default function TenderLeftSidebar({ stats, category, statusFilter, onCategoryChange, onStatusChange }: Props) {
  return (
    <aside className="hidden lg:flex flex-col shrink-0 border-r border-[#1e1c18] bg-[#0f0e0b] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "20%" }}>
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">Overview</p>
          {[
            { label: "Total tenders", value: stats.total },
            { label: "Active",        value: stats.published },
            { label: "Closing soon",  value: stats.closing },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs text-zinc-500">{s.label}</span>
              <span className="text-xs font-semibold text-white tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-[#1e1c18]" />
        <div>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">Categories</p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => onCategoryChange(cat.value)}
                className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors text-left ${category === cat.value ? "bg-indigo-600/20 text-indigo-300" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                <span className={category === cat.value ? "text-indigo-400" : "text-zinc-600"}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="h-px bg-[#1e1c18]" />
        <div>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">Status</p>
          <nav className="space-y-0.5">
            {STATUS_FILTERS.map((f) => (
              <button key={f.value} onClick={() => onStatusChange(f.value)}
                className={`w-full flex cursor-pointer items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${statusFilter === f.value ? "bg-indigo-600/20 text-indigo-300" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                {f.label}
                {statusFilter === f.value && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
