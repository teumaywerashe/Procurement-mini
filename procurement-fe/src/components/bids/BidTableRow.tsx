"use client";
import React from "react";
import Link from "next/link";
import { IconCurrencyDollar, IconClock } from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import type { Bid } from "@/src/types";

interface Props {
  bid: Bid;
}

export default function BidTableRow({ bid }: Props) {
  const s = BID_STATUS_STYLES[bid.bidStatus];
  const tender = bid.tender;
  return (
    <div className="border-b border-(--border-subtle) hover:bg-(--bg-elevated) transition-colors px-5 py-4">
      {/* Mobile layout */}
      <div className="sm:hidden flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/bids/${bid.id}`} className="group">
            <p className="text-sm font-medium text-(--text-primary) group-hover:text-indigo-400 transition-colors truncate">
              {tender?.title ?? `Tender #${bid.tenderId}`}
            </p>
            <p className="text-[11px] text-(--text-faint) mt-0.5">{tender?.name ?? ""} · Bid #{bid.id}</p>
          </Link>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-semibold text-(--text-muted)">
              <IconCurrencyDollar size={12} className="text-(--text-faint)" />
              {Number(bid.amount).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-(--text-subtle)">
              <IconClock size={11} className="text-(--text-faint)" />
              {new Date(bid.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${s.bg} ${s.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
        </span>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[1fr_130px_160px_120px] gap-4 items-center">
        <Link href={`/bids/${bid.id}`} className="group min-w-0">
          <p className="text-sm font-medium text-(--text-primary) group-hover:text-indigo-400 transition-colors truncate">
            {tender?.title ?? `Tender #${bid.tenderId}`}
          </p>
          <p className="text-[11px] text-(--text-faint) mt-0.5">
            {tender?.name ?? ""} · Bid #{bid.id}
          </p>
        </Link>
        <span className="flex items-center gap-1 text-sm font-semibold text-(--text-muted)">
          <IconCurrencyDollar size={13} className="text-(--text-faint)" />
          {Number(bid.amount).toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-xs text-(--text-subtle)">
          <IconClock size={12} className="text-(--text-faint)" />
          {new Date(bid.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
        </span>
      </div>
    </div>
  );
}
