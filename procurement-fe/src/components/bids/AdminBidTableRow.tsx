"use client";
import React from "react";
import Link from "next/link";
import { IconCurrencyDollar, IconClock, IconCheck, IconX, IconEdit } from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import type { Bid, Tender } from "@/src/types";

interface Props {
  bid: Bid;
  tender?: Tender;
  isEditing: boolean;
  editingStatus: Bid["bidStatus"];
  isUpdating: boolean;
  onEdit: (bid: Bid) => void;
  onConfirm: (id: number) => void;
  onCancel: () => void;
  onStatusChange: (s: Bid["bidStatus"]) => void;
}

export default function AdminBidTableRow({ bid, tender, isEditing, editingStatus, isUpdating, onEdit, onConfirm, onCancel, onStatusChange }: Props) {
  const s = BID_STATUS_STYLES[bid.bidStatus];
  return (
    <div className="grid grid-cols-[1fr_120px_150px_1fr] gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center">
      <Link href={`/tender/${bid.tenderId}`} className="group min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors truncate">
          {tender?.title ?? `Tender #${bid.tenderId}`}
        </p>
        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{tender?.name ?? ""} · Bid #{bid.id}</p>
      </Link>
      <span className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
        <IconCurrencyDollar size={13} className="text-[var(--text-faint)]" />
        {Number(bid.amount).toLocaleString()}
      </span>
      <span className="flex items-center gap-1 text-xs text-[var(--text-subtle)]">
        <IconClock size={12} className="text-[var(--text-faint)]" />
        {new Date(bid.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <select value={editingStatus} onChange={(e) => onStatusChange(e.target.value as Bid["bidStatus"])}
            className="flex-1 bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 cursor-pointer" autoFocus>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => onConfirm(bid.id)} disabled={isUpdating}
            className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50" title="Save">
            <IconCheck size={12} />
          </button>
          <button onClick={onCancel}
            className="p-1.5 rounded-md border border-[var(--border-strong)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors" title="Cancel">
            <IconX size={12} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${s?.bg} ${s?.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s?.dot}`} />
            {bid.bidStatus?.charAt(0).toUpperCase() + bid.bidStatus?.slice(1)}
          </span>
          <button onClick={() => onEdit(bid)}
            className="p-1 rounded text-[var(--text-faint)] hover:text-indigo-400 hover:bg-indigo-950/40 transition-colors" title="Edit status">
            <IconEdit size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
