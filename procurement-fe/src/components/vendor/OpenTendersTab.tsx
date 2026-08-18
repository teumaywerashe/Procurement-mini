"use client";

import React from "react";
import Link from "next/link";
import { Button, Group, Badge } from "@mantine/core";
import { IconSearch, IconEye, IconEdit, IconGavel } from "@tabler/icons-react";
import type { Tender, Bid } from "@/src/types";
import { useRouter } from "next/navigation";

interface OpenTendersTabProps {
  tendersLoading: boolean;
  tenderSearch: string;
  onSearchChange: (val: string) => void;
  filteredTenders: Tender[];
  myBids: Bid[];
  onOpenPlaceBid: (tender: Tender) => void;
  onOpenEditBid: (bid: Bid) => void;
}

export default function OpenTendersTab({
  tendersLoading,
  tenderSearch,
  onSearchChange,
  filteredTenders,
  myBids,
  onOpenPlaceBid,
  onOpenEditBid,
}: OpenTendersTabProps) {
  const router = useRouter();
  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-(--text-primary)">
            Open Tenders Marketplace
          </h2>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            Browse active tenders and submit competitive bids.
          </p>
        </div>
        <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
          <IconSearch size={16} className="text-(--text-faint) shrink-0" />
          <input
            type="text"
            value={tenderSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search open tenders..."
            className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
          />
        </div>
      </div>

      {tendersLoading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="p-12 text-center text-sm text-(--text-subtle)">
          No open tenders found matching criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-(--text-primary)">
            <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
              <tr>
                <th className="px-6 py-3.5">Ref No.</th>
                <th className="px-6 py-3.5">Tender Title</th>
                <th className="px-6 py-3.5">Est. Value</th>
                <th className="px-6 py-3.5">Closing Date</th>
                <th className="px-6 py-3.5">My Bid Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {filteredTenders.map((t: Tender) => {
                const existingBid = myBids.find((b) => b.tenderId === t.id);
                return (
                  <tr  key={t.id} className="hover:bg-(--bg-elevated) cursor-pointer transition-colors">
                    <td onClick={()=>router.push(`/tenders/${t.id}`)} className="px-6 py-4 font-mono text-(--text-faint) hover:text-blue-500">
                      {t.referenceNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-(--text-primary)">
                      {t.title}
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      ${Number(t.estimatedValue || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-(--text-subtle)">
                      {new Date(t.closingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {existingBid ? (
                        <Badge color="indigo" variant="light">
                          Bid Placed: ${Number(existingBid.amount || existingBid.proposedPrice || 0).toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge color="gray" variant="dot">Not Bidden Yet</Badge>
                      )}
                    </td>
                    <td className="px-0 py-4">
                      <Group justify="flex" gap="xs">
                        <Link href={`/tenders/${t.id}`}>
                          <Button variant="subtle" size="xs" leftSection={<IconEye size={14} />}>
                            View
                          </Button>
                        </Link>
                        {existingBid ? (
                          <Button
                            variant="light"
                            color="indigo"
                            size="xs"
                            // leftSection={<IconEdit size={14} />}
                            onClick={() => onOpenEditBid(existingBid)}
                          >
                            Edit Bid
                          </Button>
                        ) : (
                          <Button
                            color="emerald"
                            size="xs"
                            // leftSection={<IconGavel size={14} />}
                            onClick={() => onOpenPlaceBid(t)}
                          >
                            Place bid
                          </Button>
                        )}
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
