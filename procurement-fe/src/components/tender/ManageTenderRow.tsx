"use client";
import React from "react";
import Link from "next/link";
import { IconClock, IconChevronRight, IconEdit, IconTrash } from "@tabler/icons-react";
import { TENDER_STATUS_COLORS, daysLeftShort } from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

interface Props {
  tender: Tender;
  now: number;
  onDelete: (t: Tender) => void;
}

export default function ManageTenderRow({ tender, now, onDelete }: Props) {
  const s       = TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const closing = daysLeftShort(tender.closingDate, now);
  const isUrgent = closing !== "Closed" && closing !== "Today" && parseInt(closing) <= 3;

  return (
    <div className="grid grid-cols-[1fr_130px_120px_130px_110px] gap-3 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{tender.title}</p>
        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{tender.referenceNumber}</p>
      </div>
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
      </span>
      <span className="text-sm font-medium text-[var(--text-muted)]">${Number(tender.estimatedValue).toLocaleString()}</span>
      <span className={`flex items-center gap-1 text-xs ${closing === "Closed" ? "text-[var(--text-faint)]" : isUrgent ? "text-orange-400" : "text-[var(--text-subtle)]"}`}>
        <IconClock size={12} />{closing === "Closed" ? "Closed" : `${closing} left`}
      </span>
      <div className="flex items-center justify-center gap-1.5">
        <Link href={`/tender/${tender.id}`} className="p-2 text-[var(--text-subtle)] hover:text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border)] transition-all" title="View">
          <IconChevronRight size={14} />
        </Link>
        <Link href={`/tender/${tender.id}/edit`} className="p-2 text-indigo-400 hover:text-indigo-300 rounded-md hover:bg-indigo-950/40 border border-indigo-800/30 hover:border-indigo-600/50 transition-all" title="Edit">
          <IconEdit size={14} />
        </Link>
        <button onClick={() => onDelete(tender)} className="p-2 text-red-400 hover:text-red-300 cursor-pointer rounded-md hover:bg-red-950/40 border border-red-800/30 hover:border-red-600/50 transition-all" title="Delete">
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  );
}
