"use client";
import React from "react";
import Link from "next/link";
import { IconCurrencyDollar, IconClock } from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import type { Bid, Tender } from "@/src/types";

interface Props {
  bid: Bid;
  tender?: Tender;
}

export default function BidTableRow({ bid, tender }: Props) {
  const s = BID_STATUS_STYLES[bid.bidStatus];
  return (
    <div className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-4 border-b border-(--border-subtle) hover:bg-(--bg-elevated) transition-colors items-center">
      <Link href={`/tender/${bid.tenderId}`} className="group min-w-0">
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
  );
}
