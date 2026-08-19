/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button } from "@mantine/core";
import { IconGavel, IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";

const STATUS_OPTIONS = ["pending", "accepted", "rejected"] as const;

interface BidHeaderCardProps {
  bid: any;
  isAdmin: boolean;
  isOwnBid: boolean;
  editingStatus: (typeof STATUS_OPTIONS)[number] | null;
  setEditingStatus: (s: (typeof STATUS_OPTIONS)[number] | null) => void;
  onSaveStatus: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  onOpenDelete: () => void;
}

export function BidHeaderCard({
  bid,
  isAdmin,
  isOwnBid,
  editingStatus,
  setEditingStatus,
  onSaveStatus,
  isUpdating,
  isDeleting,
  onOpenDelete,
}: BidHeaderCardProps) {
  const bidStyle =
    BID_STATUS_STYLES[bid.bidStatus as keyof typeof BID_STATUS_STYLES] ||
    BID_STATUS_STYLES.pending;

  return (
    <div className="px-6 sm:px-8 py-6 border-b border-(--border)">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/60 flex items-center justify-center shrink-0">
            <IconGavel size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-(--text-faint) mb-1">Bid Reference</p>
            <h1 className="text-base sm:text-lg font-bold text-(--text-primary) leading-tight">
              {bid.referenceNumber}
            </h1>
            <p className="text-xs text-(--text-subtle) mt-0.5">Bid #{bid.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && editingStatus ? (
            <div className="flex items-center gap-2">
              <select
                value={editingStatus}
                onChange={(e) =>
                  setEditingStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
                }
                className="bg-(--bg-input) border border-(--border-strong) rounded-lg px-3 py-1.5 text-sm text-(--text-primary) outline-none focus:border-indigo-500 cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <Button
                onClick={onSaveStatus}
                disabled={isUpdating}
                loading={isUpdating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                <IconCheck size={14} />
                Save
              </Button>
              <button
                onClick={() => setEditingStatus(null)}
                disabled={isUpdating}
                className="px-3 py-1.5 rounded-lg border border-(--border-strong) text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${bidStyle.bg} ${bidStyle.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${bidStyle.dot}`} />
                {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
              </span>
              {isAdmin && (
                <button
                  onClick={() => setEditingStatus(bid.bidStatus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                  <IconEdit size={14} /> Edit status
                </button>
              )}
              {isOwnBid && (
                <button
                  disabled={isDeleting}
                  // loading={isDeleting}
                  onClick={onOpenDelete}
                  className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-lg border border-red-800/60 text-sm text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
                >
                  <IconTrash size={14} /> {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
