"use client";
import React from "react";
import Link from "next/link";
import {
  IconCurrencyDollar,
  IconClock,
  IconCheck,
  IconX,
  IconEdit,
} from "@tabler/icons-react";
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

export default function AdminBidTableRow({
  bid,
  tender,
  isEditing,
  editingStatus,
  isUpdating,
  onEdit,
  onConfirm,
  onCancel,
  onStatusChange,
}: Props) {
  const s = BID_STATUS_STYLES[bid.bidStatus];

  const statusCell = isEditing ? (
    <div className="flex items-center gap-1.5   ">
      <select
        value={editingStatus}
        onChange={(e) => onStatusChange(e.target.value as Bid["bidStatus"])}
        className="flex-1 bg-(--bg-input) border border-(--border-strong) rounded-md px-2 py-1 text-xs text-(--text-primary) outline-none focus:border-indigo-500 cursor-pointer"
        autoFocus
      >
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
      <button
        onClick={() => onConfirm(bid.id)}
        disabled={isUpdating}
        className="p-1.5 cursor-pointer rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
        title="Save"
      >
        <IconCheck size={12} />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 cursor-pointer rounded-md border border-(--border-strong) text-(--text-subtle) hover:text-(--text-primary) transition-colors"
        title="Cancel"
      >
        <IconX size={12} />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${s?.bg} ${s?.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s?.dot}`} />
        {bid.bidStatus?.charAt(0).toUpperCase() + bid.bidStatus?.slice(1)}
      </span>
      <button
        onClick={() => onEdit(bid)}
        
        className="p-1 cursor-pointer rounded text-(--text-faint) hover:text-indigo-400 hover:bg-indigo-950/40 transition-colors"
        title="Edit status"
      >
        <IconEdit size={13} />
      </button>
    </div>
  );

  return (
    <div className="border-b border-(--border-subtle) hover:bg-(--bg-elevated) transition-colors px-5 py-4">
      {/* Mobile layout */}
      <div className="sm:hidden flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/bids/${bid.id}`} className="group">
            <p className="text-sm font-medium text-(--text-primary) group-hover:text-indigo-400 transition-colors truncate">
              {tender?.title ?? `Tender #${bid.tenderId}`}
            </p>
            <p className="text-[11px] text-(--text-faint) mt-0.5">
              {tender?.name ?? ""} · Bid #{bid.id}
            </p>
          </Link>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-semibold text-(--text-muted)">
              <IconCurrencyDollar size={12} className="text-(--text-faint)" />
              {Number(bid.amount).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-(--text-subtle)">
              <IconClock size={11} className="text-(--text-faint)" />
              {new Date(bid.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="mt-2">{statusCell}</div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[0.8fr_120px_150px_100px] gap-4 items-center">
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
          {new Date(bid.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {statusCell}
      </div>
    </div>
  );
}
