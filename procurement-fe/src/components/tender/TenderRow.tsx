"use client";
import React from "react";
import Link from "next/link";
import { IconFileText, IconCurrencyDollar, IconClock, IconChevronRight } from "@tabler/icons-react";
import { TENDER_STATUS_COLORS, timeAgo, daysLeft } from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

export default function TenderRow({ tender, now }: { tender: Tender; now: number }) {
  const status  = TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const closing =  daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;
  const bidCount = tender.bids?.length ?? 0;

  return (
    <Link href={`/tender/${tender.id}`} className="group flex items-start gap-3 sm:gap-5 px-4 sm:px-8 py-4  sm:py-6 border rounded-2xl border-(--border) hover:bg-(--bg-elevated) hover:border-blue-950 transition-colors">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--bg-elevated) border border-(--border) flex items-center justify-center shrink-0 mt-0.5">
        <IconFileText size={20} className="text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </span>
              <span className="text-xs text-(--text-faint) hidden sm:inline">{tender.referenceNumber}</span>
              <span className="text-xs text-(--text-subtle) hidden sm:inline">{timeAgo(tender.createdAt, now)}</span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-(--text-primary) group-hover:text-indigo-400 transition-colors leading-snug mb-1 pr-2">{tender.title}</h3>
            {tender.description && (
              <p className="text-xs sm:text-sm text-(--text-subtle) line-clamp-1 sm:line-clamp-2 mb-2">{tender.description}</p>
            )}
            <div className="flex items-center gap-3 sm:gap-5 text-sm text-(--text-subtle) flex-wrap">
              <span className="flex items-center gap-1">
                <IconCurrencyDollar size={13} className="text-(--text-faint)" />
                <span className="text-(--text-primary) font-semibold text-xs sm:text-sm">${Number(tender.estimatedValue).toLocaleString()}</span>
              </span>
              <span className="capitalize text-xs hidden sm:inline">{tender.name}</span>
              {bidCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-(--text-faint)">
                  <IconFileText size={12} />{bidCount} bid{bidCount !== 1 ? "s" : ""}
                </span>
              )}
              <span className={`flex items-center gap-1 text-xs sm:hidden font-medium ${isUrgent && closing !== "Closed" ? "text-orange-400" : closing === "Closed" ? "text-(--text-faint)" : "text-(--text-subtle)"}`}>
                <IconClock size={12} />{closing}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`hidden sm:flex items-center gap-1 text-sm font-medium whitespace-nowrap ${isUrgent && closing !== "Closed" ? "text-orange-400" : closing === "Closed" ? "text-(--text-faint)" : "text-(--text-subtle)"}`}>
              <IconClock size={14} />{closing}
            </span>
          </div>
        </div>
      </div>
      <IconChevronRight size={16} className="text-(--text-faint) group-hover:text-(--text-subtle) transition-colors shrink-0 mt-3 sm:mt-4" />
    </Link>
  );
}
