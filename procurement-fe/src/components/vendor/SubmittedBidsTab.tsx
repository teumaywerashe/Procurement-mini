"use client";

import React from "react";
import { Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { Bid } from "@/src/types";
import SubmittedBidsTable from "./SubmittedBidsTable";

interface SubmittedBidsTabProps {
  bidsLoading: boolean;
  bidStatusFilter: string;
  onStatusFilterChange: (val: string) => void;
  bidSearch: string;
  onSearchChange: (val: string) => void;
  filteredBids: Bid[];
  onOpenEditBid: (bid: Bid) => void;
  onConfirmDeleteBid: (bid: Bid) => void;
}

export default function SubmittedBidsTab({
  bidsLoading,
  bidStatusFilter,
  onStatusFilterChange,
  bidSearch,
  onSearchChange,
  filteredBids,
  onOpenEditBid,
  onConfirmDeleteBid,
}: SubmittedBidsTabProps) {
  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-(--text-primary)">
            My Submitted Bids
          </h2>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            View, update proposed prices/notes, or delete your submitted bids.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            size="xs"
            value={bidStatusFilter}
            onChange={(v) => onStatusFilterChange(v || "ALL")}
            data={[
              { value: "ALL", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "accepted", label: "Accepted" },
              { value: "rejected", label: "Rejected" },
            ]}
            className="w-36"
          />
          <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-56">
            <IconSearch size={16} className="text-(--text-faint) shrink-0" />
            <input
              type="text"
              value={bidSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search my bids..."
              className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
            />
          </div>
        </div>
      </div>

      <SubmittedBidsTable
        bidsLoading={bidsLoading}
        filteredBids={filteredBids}
        onOpenEditBid={onOpenEditBid}
        onConfirmDeleteBid={onConfirmDeleteBid}
      />
    </div>
  );
}
