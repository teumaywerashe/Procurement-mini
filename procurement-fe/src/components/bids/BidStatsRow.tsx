"use client";
import React from "react";

interface Props {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export default function BidStatsRow({ total, pending, accepted, rejected }: Props) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-(--bg-surface) border border-(--border) rounded-lg">
        <span className="text-xs text-(--text-subtle)">Total</span>
        <span className="text-xs font-bold text-(--text-primary) tabular-nums">{total}</span>
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
  );
}
