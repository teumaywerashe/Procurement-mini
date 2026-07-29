"use client";
import React from "react";
import { IconChartBar, IconTrendingUp } from "@tabler/icons-react";
import type { Bid } from "@/src/types";

interface Props {
  bids: Bid[];
  isLoading: boolean;
}

export default function MyBidsRightSidebar({ bids, isLoading }: Props) {
  const pending  = bids.filter((b) => b.bidStatus === "pending").length;
  const accepted = bids.filter((b) => b.bidStatus === "accepted").length;
  const rejected = bids.filter((b) => b.bidStatus === "rejected").length;
  const totalValue  = bids.reduce((sum, b) => sum + Number(b.amount), 0);
  const highestBid  = bids.reduce((max, b) => Math.max(max, Number(b.amount)), 0);
  const successRate = bids.length > 0 ? Math.round((accepted / bids.length) * 100) : 0;

  return (
    <aside className="hidden xl:flex flex-col shrink-0 border-l border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "20%" }}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <IconChartBar size={14} className="text-indigo-400" />
          <p className="text-xs font-semibold text-(--text-primary)">Bid Statistics</p>
        </div>
        <div className="h-px bg-(--border)" />

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-(--bg-elevated) rounded animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            <div className="px-3 py-3 rounded-lg bg-(--bg-surface) border border-(--border)">
              <p className="text-[10px] text-(--text-faint) mb-1">Success rate</p>
              <p className="text-xl font-bold text-emerald-400">{successRate}%</p>
              <div className="mt-2 h-1.5 bg-(--bg-elevated) rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${successRate}%` }} />
              </div>
            </div>
            {[
              { label: "Total bids",    value: bids.length,                    color: "text-indigo-400"  },
              { label: "Pending",       value: pending,                        color: "text-yellow-400"  },
              { label: "Accepted",      value: accepted,                       color: "text-emerald-400" },
              { label: "Rejected",      value: rejected,                       color: "text-red-400"     },
              { label: "Total value",   value: `$${totalValue.toLocaleString()}`,   color: "text-purple-400"  },
              { label: "Highest bid",   value: `$${highestBid.toLocaleString()}`,   color: "text-orange-400"  },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-(--bg-surface) border border-(--border)">
                <span className="text-xs text-(--text-subtle)">{stat.label}</span>
                <span className={`text-sm font-bold tabular-nums ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
            {bids.length === 0 && (
              <div className="text-center py-4">
                <IconTrendingUp size={24} className="text-(--text-faint) mx-auto mb-2" />
                <p className="text-xs text-(--text-subtle)">Submit bids to see statistics.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
