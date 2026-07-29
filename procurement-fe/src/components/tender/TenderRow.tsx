"use client";
import React from "react";
import Link from "next/link";
import { IconFileText, IconCurrencyDollar, IconClock, IconBookmark, IconChevronRight } from "@tabler/icons-react";
import { TENDER_STATUS_COLORS, timeAgo, daysLeft } from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

export default function TenderRow({ tender, now }: { tender: Tender; now: number }) {
  const status  = TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;

  return (
    <Link href={`/tender/${tender.id}`} className="group flex items-start gap-5 px-8 py-6 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-[#1e1c18] border border-[#2a2620] flex items-center justify-center shrink-0 mt-0.5">
        <IconFileText size={22} className="text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </span>
              <span className="text-xs text-zinc-600">{tender.referenceNumber}</span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-500">{timeAgo(tender.createdAt, now)}</span>
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-1.5 pr-4">{tender.title}</h3>
            {tender.description && <p className="text-sm text-zinc-500 line-clamp-2 mb-3">{tender.description}</p>}
            <div className="flex items-center gap-5 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <IconCurrencyDollar size={14} className="text-zinc-600" />
                <span className="text-zinc-300 font-medium">${Number(tender.estimatedValue).toLocaleString()}</span>
              </span>
              <span className="capitalize">{tender.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap ${isUrgent && closing !== "Closed" ? "text-orange-400" : closing === "Closed" ? "text-zinc-600" : "text-zinc-400"}`}>
              <IconClock size={14} />{closing}
            </span>
            <button onClick={(e) => e.preventDefault()} className="p-1.5 rounded-md text-zinc-700 hover:text-zinc-400 hover:bg-[#2a2620] opacity-0 group-hover:opacity-100 transition-all">
              <IconBookmark size={15} />
            </button>
          </div>
        </div>
      </div>
      <IconChevronRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-4" />
    </Link>
  );
}
