"use client";
import React from "react";
import { CATEGORIES } from "./constants";
import type { Bid } from "@/src/types";

interface Props {
  categoryFilter: string;
  statusFilter: Bid["bidStatus"] | "";
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: Bid["bidStatus"] | "") => void;
}

export default function SidebarCategoryFilter({
  categoryFilter,
  statusFilter,
  onCategoryChange,
  onStatusChange,
}: Props) {
  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-r border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      style={{ width: "18%" }}
    >
      <div className="p-4 space-y-5">
        <div>
          <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider px-2 mb-2">Category</p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2 rounded-md text-xs transition-colors text-left ${
                  categoryFilter === cat.value
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-(--text-subtle) hover:text-(--text-primary) hover:bg-white/5"
                }`}
              >
                <span className={categoryFilter === cat.value ? "text-indigo-400" : "text-(--text-faint)"}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="h-px bg-(--border)" />

        <div>
          <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider px-2 mb-2">Status</p>
          <nav className="space-y-0.5">
            {(["", "pending", "accepted", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className={`w-full flex cursor-pointer items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${
                  statusFilter === s
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-(--text-subtle) hover:text-(--text-primary) hover:bg-white/5"
                }`}
              >
                <span className="capitalize">{s === "" ? "All" : s}</span>
                {statusFilter === s && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
