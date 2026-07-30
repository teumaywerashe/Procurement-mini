"use client";
import React from "react";
import Link from "next/link";
import { IconFileText, IconCurrencyDollar, IconClock, IconChevronRight } from "@tabler/icons-react";
import { TENDER_STATUS_COLORS, timeAgo, daysLeft } from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

export default function TenderRow({ tender, now }: { tender: Tender; now: number }) {
  const status  = TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;

  return (
    <Link href={`/tender/${tender.id}`} className="group flex items-start gap-5 px-8 py-6 border-b border-(--border) hover:bg-(--bg-elevated) transition-colors">
      <div className="w-12 h-12 rounded-xl bg-(--bg-elevated) border border-(--border) flex items-center justify-center shrink-0 mt-0.5">
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
              <span className="text-xs text-(--text-faint)">{tender.referenceNumber}</span>
              <span className="text-xs text-(--text-faint)">·</span>
              <span className="text-xs text-(--text-subtle)">{timeAgo(tender.createdAt, now)}</span>
            </div>
            <h3 className="text-base font-semibold text-(--text-primary) group-hover:text-indigo-400 transition-colors leading-snug mb-1.5 pr-4">{tender.title}</h3>
            {tender.description && <p className="text-sm text-(--text-subtle) line-clamp-2 mb-3">{tender.description}</p>}
            <div className="flex items-center gap-5 text-sm text-(--text-subtle)">
              <span className="flex items-center gap-1">
                <IconCurrencyDollar size={14} className="text-(--text-faint)" />
                <span className="text-(--text-primary) font-semibold">${Number(tender.estimatedValue).toLocaleString()}</span>
              </span>
              <span className="capitalize">{tender.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap ${isUrgent && closing !== "Closed" ? "text-orange-400" : closing === "Closed" ? "text-(--text-faint)" : "text-(--text-subtle)"}`}>
              <IconClock size={14} />{closing}
            </span>
           
          </div>
        </div>
      </div>
      <IconChevronRight size={16} className="text-(--text-faint) group-hover:text-(--text-subtle) transition-colors shrink-0 mt-4" />
    </Link>
  );
}
