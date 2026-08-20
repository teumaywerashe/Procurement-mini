"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  IconCurrencyDollar,
  IconClock,
  IconTrash,
  IconEdit,
  IconLoader,
} from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import type { Bid } from "@/src/types";

interface Props {
  bid: Bid;
  handleDelete: (id: number) => void;
  isBidDeleting: boolean;
  showConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
}

export default function BidTableRow({ bid,showConfirm,setShowConfirm, handleDelete, isBidDeleting }: Props) {
  const s = BID_STATUS_STYLES[bid.bidStatus];
  const tender = bid.tender;

  // const [deletingBid, setDeletingBidId] = useState<number | null>(null);

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
              <IconTrash size={18} className="text-red-400" />
            </div>
            <h3 className="font-semibold text-(--text-primary) text-base">
              Delete Document?
            </h3>
          </div>
          <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
            This will permanently delete{" "}
            <span className="text-(--text-primary) font-medium">
              this document
            </span>
            . This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={(prev) => setShowConfirm(!prev)}
              disabled={isBidDeleting}
              className="flex-1 py-2.5 cursor-pointer rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(bid.id);
                // setShowConfirm(false);
              }}
              disabled={isBidDeleting}
              className="flex-1 py-2.5 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {isBidDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }
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
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${s.bg} ${s.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
        </span>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[1fr_130px_160px_120px_50px] gap-4 items-center">
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
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
        </span>
        <span className="flex items-center h-8 w-8 justify-between gap-5 hover:bg-(--bg-elevated) transition-colors cursor-pointer">
          {isBidDeleting ? (
            <IconLoader className="text-(--text-faint) animate-spin" />
          ) : (
            <IconTrash
              onClick={() => setShowConfirm(true)}
              className="text-(--text-faint) hover:text-red-400"
            />
          )}
        </span>
      </div>
    </div>
  );
}
