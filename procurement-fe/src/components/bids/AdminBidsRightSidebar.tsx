"use client";
import React from "react";
import Link from "next/link";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import type { Bid } from "@/src/types";

interface BidCardProps {
  bid: Bid;
  label: string;
  color: string;
}

function BidCard({ bid, label, color }: BidCardProps) {
  const s = BID_STATUS_STYLES[bid.bidStatus];
  const tender = bid.tender;
  return (
    <Link href={`/tender/${bid.tenderId}`} className="block px-3 py-3 rounded-lg bg-(--bg-surface) border border-(--border) hover:border-indigo-500/40 transition-colors space-y-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className={`text-[9px] font-semibold uppercase tracking-wider ${color}`}>{label}</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s?.bg} ${s?.text}`}>{bid.bidStatus}</span>
      </div>
      <p className="text-xs font-medium text-(--text-primary) line-clamp-1">{tender?.title ?? `Tender #${bid.tenderId}`}</p>
      <p className={`text-sm font-bold ${color}`}>${Number(bid.amount).toLocaleString()}</p>
      {tender?.name && <p className="text-[10px] text-(--text-faint)">{tender.name}</p>}
    </Link>
  );
}

interface Props {
  bids: Bid[];
  isLoading: boolean;
}

export default function AdminBidsRightSidebar({ bids, isLoading }: Props) {
  const { highest, lowest } = React.useMemo(() => {
    const highMap: Record<number, Bid> = {};
    const lowMap:  Record<number, Bid> = {};
    bids.forEach((b) => {
      if (!highMap[b.tenderId] || Number(b.amount) > Number(highMap[b.tenderId].amount)) highMap[b.tenderId] = b;
      if (!lowMap[b.tenderId]  || Number(b.amount) < Number(lowMap[b.tenderId].amount))  lowMap[b.tenderId]  = b;
    });
    return {
      highest: Object.values(highMap).sort((a, b) => Number(b.amount) - Number(a.amount)),
      lowest:  Object.values(lowMap).sort((a, b)  => Number(a.amount) - Number(b.amount)),
    };
  }, [bids]);

  const skeleton = Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="h-16 bg-(--bg-elevated) rounded animate-pulse" />
  ));

  return (
    <aside className="hidden xl:flex flex-col shrink-0 border-l border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ width: "20%" }}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <IconTrendingUp size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-(--text-primary)">Highest Bids</p>
        </div>
        <div className="h-px bg-(--border)" />
        {isLoading ? <div className="space-y-2">{skeleton}</div>
          : highest.length === 0 ? <p className="text-xs text-(--text-subtle) text-center py-4">No bids yet.</p>
          : <div className="space-y-2">{highest.map((b,i) =>
           <BidCard key={`h-${b.id}`} bid={b} label="Highest" color="text-emerald-400" />
           
          )
           }
           
           </div>}

        <div className="h-px bg-(--border)" />
        <div className="flex items-center gap-2 px-1">
          <IconTrendingDown size={14} className="text-orange-400" />
          <p className="text-xs font-semibold text-(--text-primary)">Lowest Bids</p>
        </div>
        {isLoading ? <div className="space-y-2">{skeleton}</div>
          : lowest.length === 0 ? <p className="text-xs text-(--text-subtle) text-center py-4">No bids yet.</p>
          : <div className="space-y-2">{lowest.map((b) => <BidCard key={`l-${b.id}`} bid={b} label="Lowest" color="text-orange-400" />)}</div>}
      </div>
    </aside>
  );
}
