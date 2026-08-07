"use client";
import Link from "next/link";
import {
  IconFileText,
  IconCurrencyDollar,
  IconClock,
  IconUser,
} from "@tabler/icons-react";
import {
  TENDER_STATUS_COLORS,
  timeAgo,
  daysLeft,
} from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

export default function TenderRow({
  tender,
  now,
}: {
  tender: Tender;
  now: number;
}) {
  const status =
    TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;
  const bidCount = tender.bids?.length ?? 0;

  return (
    <Link
      href={`/tenders/${tender.id}`}
      className="group flex items-start justify-between gap-4 mx-4 sm:mx-6 my-3 p-4 sm:p-5 border border-(--border) rounded-2xl hover:border-indigo-500/50 hover:shadow-sm transition-all bg-(--bg-base)"
    >
      {/* Left content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Title + company */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-(--text-primary) group-hover:text-indigo-400 transition-colors leading-snug">
            {tender.title}
          </h3>
          <p className="text-xs sm:text-sm text-(--text-subtle) mt-0.5">
            {tender.name}
          </p>
          {tender.user?.name && (
            <p className="text-xs text-(--text-faint) mt-0.5 flex items-center gap-1">
              <IconUser size={11} className="shrink-0" />
              {tender.user.name}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-(--text-subtle)">
          <span className="flex items-center gap-1">
            <IconFileText size={13} className="text-(--text-faint)" />
            {bidCount} bid{bidCount !== 1 ? "s" : ""}
          </span>
          <span className="text-(--border)">|</span>
          <span className="flex items-center gap-1 capitalize">
            <IconClock size={13} className="text-(--text-faint)" />
            {tender.status}
          </span>
          <span className="text-(--border)">|</span>
          <span className="flex items-center gap-1">
            <IconCurrencyDollar size={13} className="text-(--text-faint)" />
            {tender.referenceNumber}
          </span>
        </div>

        {/* Description */}
        {tender.description && (
          <p className="text-xs text-(--text-subtle) line-clamp-1">
            {tender.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
          </span>
          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-(--border) text-(--text-subtle) bg-(--bg-elevated)">
            ${Number(tender.estimatedValue).toLocaleString()}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-2 border-t border-(--border) mt-1">
          <span className="text-xs text-indigo-400 font-medium">
            Posted {timeAgo(tender.createdAt, now)}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              isUrgent && closing !== "Closed"
                ? "text-orange-400"
                : closing === "Closed"
                  ? "text-(--text-faint)"
                  : "text-(--text-subtle)"
            }`}
          >
            <IconClock size={12} />
            {closing}
          </span>
        </div>
      </div>

      {/* Right icon box */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-(--border) bg-(--bg-elevated) flex items-center justify-center shrink-0">
        <IconFileText size={24} className="text-indigo-400" />
      </div>
    </Link>
  );
}
