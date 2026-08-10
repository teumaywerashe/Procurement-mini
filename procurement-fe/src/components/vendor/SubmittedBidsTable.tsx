"use client";

import React from "react";
import Link from "next/link";
import { Badge, ActionIcon, Tooltip, Group } from "@mantine/core";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import type { Bid } from "@/src/types";

interface SubmittedBidsTableProps {
  bidsLoading: boolean;
  filteredBids: Bid[];
  onOpenEditBid: (bid: Bid) => void;
  onConfirmDeleteBid: (bid: Bid) => void;
}

export default function SubmittedBidsTable({
  bidsLoading,
  filteredBids,
  onOpenEditBid,
  onConfirmDeleteBid,
}: SubmittedBidsTableProps) {
  if (bidsLoading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredBids.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-(--text-subtle)">
        No bids found matching search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-(--text-primary)">
        <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
          <tr>
            <th className="px-6 py-3.5">Bid Ref</th>
            <th className="px-6 py-3.5">Tender Title</th>
            <th className="px-6 py-3.5">My Proposed Price</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">Submitted Date</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-subtle)">
          {filteredBids.map((b: Bid) => (
            <tr key={b.id} className="hover:bg-(--bg-elevated) transition-colors">
              <td className="px-6 py-4 font-mono text-(--text-faint)">
                {b.referenceNumber || `#BID-${b.id}`}
              </td>
              <td className="px-6 py-4 font-semibold text-indigo-400 max-w-xs truncate">
                {b.tender?.title || `Tender #${b.tenderId}`}
              </td>
              <td className="px-6 py-4 font-semibold text-emerald-400">
                ${Number(b.amount || b.proposedPrice || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <Badge
                  color={
                    b.bidStatus === "accepted"
                      ? "emerald"
                      : b.bidStatus === "rejected"
                        ? "red"
                        : "yellow"
                  }
                  variant="light"
                >
                  {b.bidStatus?.toUpperCase() || "PENDING"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-(--text-faint)">
                {b.submittedAt
                  ? new Date(b.submittedAt).toLocaleDateString()
                  : b.createdAt
                    ? new Date(b.createdAt).toLocaleDateString()
                    : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <Group justify="flex-end" gap="xs">
                  <Tooltip label="View Bid Details">
                    <Link href={`/bids/${b.id}`}>
                      <ActionIcon variant="subtle" color="indigo">
                        <IconEye size={16} />
                      </ActionIcon>
                    </Link>
                  </Tooltip>
                  <Tooltip label="Edit My Bid">
                    <ActionIcon variant="subtle" color="blue" onClick={() => onOpenEditBid(b)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete My Bid">
                    <ActionIcon variant="subtle" color="red" onClick={() => onConfirmDeleteBid(b)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
