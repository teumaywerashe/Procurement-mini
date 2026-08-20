/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bid, Tender } from "@/src/types";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Select,
  Tabs,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconFileText,
  IconGavel,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";

interface AdminNavigationTapProps {
  myBids: Array<any>;
  bidsLoading: boolean;
  setBidStatusFilter: (v: string) => void;
  setBidSearch: (v: string) => void;
  setDeletingTender: (t: Tender) => void;
  tendersLoading: boolean;
  setTenderStatusFilter: (f: string) => void;
  setTenderSearch: (s: string) => void;
  myTenders: Array<any>;
  tenderSearch: string;
  tenderStatusFilter: string;
  bidSearch: string;
  isUpdatingBid: boolean;
  bidStatusFilter: string;
  setSelectedBid: (b: Bid) => void;
  handleUpdateBidStatus: (
    id: number,
    status: "accepted" | "rejected" | "pending",
  ) => void;
}

function AdminNavigationTabs({
  myBids,
  bidsLoading,
  setBidStatusFilter,
  setBidSearch,
  setDeletingTender,
  tendersLoading,
  setTenderStatusFilter,
  setTenderSearch,
  myTenders,
  tenderSearch,
  tenderStatusFilter,
  bidSearch,
  isUpdatingBid,
  bidStatusFilter,
  setSelectedBid,
  handleUpdateBidStatus,
}: AdminNavigationTapProps) {
  const [activeTab, setActiveTab] = useState<string | null>("tenders");
  const acceptedBids = myBids.filter((b) => b.bidStatus === "accepted");

  const filteredTenders = myTenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(tenderSearch.toLowerCase());
    const matchesStatus =
      tenderStatusFilter === "ALL" || t.status === tenderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBids = myBids.filter((b) => {
    const tenderTitle = b.tender?.title || "";
    const vendorName = b.vendor?.name || "";
    const matchesSearch =
      tenderTitle.toLowerCase().includes(bidSearch.toLowerCase()) ||
      vendorName.toLowerCase().includes(bidSearch.toLowerCase()) ||
      (b.referenceNumber &&
        b.referenceNumber.toLowerCase().includes(bidSearch.toLowerCase()));
    const matchesStatus =
      bidStatusFilter === "ALL" || b.bidStatus === bidStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      variant="outline"
      radius="md"
    >
      <Tabs.List className="border-b border-(--border) mb-6">
        <Tabs.Tab value="tenders" leftSection={<IconFileText size={16} />}>
          My Tenders ({myTenders.length})
        </Tabs.Tab>
        <Tabs.Tab value="bids" leftSection={<IconGavel size={16} />}>
          Bids on My Tenders ({myBids.length})
        </Tabs.Tab>
      </Tabs.List>

      {/* TAB 1: MY TENDERS */}
      <Tabs.Panel value="tenders">
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-(--text-primary)">
                My Created Tenders
              </h2>
              <p className="text-xs text-(--text-subtle) mt-0.5">
                Track status, update details, or delete procurement tenders
                created under your account.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                size="xs"
                value={tenderStatusFilter}
                onChange={(v) => setTenderStatusFilter(v || "ALL")}
                data={[
                  { value: "ALL", label: "All Statuses" },
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                  { value: "awarded", label: "Awarded" },
                  { value: "closed", label: "Closed" },
                ]}
                className="w-36"
              />
              <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-56">
                <IconSearch
                  size={16}
                  className="text-(--text-faint) shrink-0"
                />
                <input
                  type="text"
                  value={tenderSearch}
                  onChange={(e) => setTenderSearch(e.target.value)}
                  placeholder="Search my tenders..."
                  className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                />
              </div>
              <Link href="/tenders/create">
                <Button
                  leftSection={<IconPlus size={14} />}
                  color="indigo"
                  size="xs"
                >
                  New Tender
                </Button>
              </Link>
            </div>
          </div>

          {tendersLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="p-12 text-center text-sm text-(--text-subtle)">
              No tenders found matching criteria. Click &quot;New Tender&quot;
              to post one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-(--text-primary)">
                <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                  <tr>
                    <th className="px-6 py-3.5">Ref No.</th>
                    <th className="px-6 py-3.5">Tender Title</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Bids Count</th>
                    <th className="px-6 py-3.5">Closing Date</th>
                    <th className="px-6 py-3.5">Est. Value</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border-subtle)">
                  {filteredTenders.map((t: Tender) => (
                    <tr
                      key={t.id}
                      className="hover:bg-(--bg-elevated) transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-(--text-faint)">
                        {t.referenceNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-(--text-primary)">
                        {t.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                            t.status === "published"
                              ? "bg-emerald-950/80 text-emerald-400"
                              : t.status === "awarded"
                                ? "bg-indigo-950/80 text-indigo-400"
                                : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-8">
                        <Badge
                          className="py-2 px-5"
                          color="purple"
                          variant="light"
                        >
                          {t.bids?.length ?? 0} Bids
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-(--text-subtle)">
                        {new Date(t.closingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-(--text-primary)">
                        ${Number(t.estimatedValue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Group justify="flex-end" gap="xs">
                          <Tooltip label="View Tender">
                            <Link href={`/tenders/${t.id}`}>
                              <ActionIcon variant="subtle" color="indigo">
                                <IconEye size={16} />
                              </ActionIcon>
                            </Link>
                          </Tooltip>
                          <Tooltip label="Edit Tender">
                            <Link href={`/tenders/${t.id}/edit`}>
                              <ActionIcon variant="subtle" color="blue">
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Link>
                          </Tooltip>
                          <Tooltip label="Delete Tender">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => setDeletingTender(t)}
                            >
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
          )}
        </div>
      </Tabs.Panel>

      {/* TAB 2: BIDS ON MY TENDERS */}
      <Tabs.Panel value="bids">
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-(--text-primary)">
                Received Vendor Bids
              </h2>
              <p className="text-xs text-(--text-subtle) mt-0.5">
                Evaluate and decide (Accept / Reject / Pending) on bids
                submitted to your active tenders.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                size="xs"
                value={bidStatusFilter}
                onChange={(v) => setBidStatusFilter(v || "ALL")}
                data={[
                  { value: "ALL", label: "All Bids" },
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accepted" },
                  { value: "rejected", label: "Rejected" },
                ]}
                className="w-36"
              />
              <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-56">
                <IconSearch
                  size={16}
                  className="text-(--text-faint) shrink-0"
                />
                <input
                  type="text"
                  value={bidSearch}
                  onChange={(e) => setBidSearch(e.target.value)}
                  placeholder="Search vendor or tender..."
                  className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                />
              </div>
            </div>
          </div>

          {bidsLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="p-12 text-center text-sm text-(--text-subtle)">
              No bids found matching search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-(--text-primary)">
                <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                  <tr>
                    <th className="px-6 py-3.5">Bid Ref</th>
                    <th className="px-6 py-3.5">Tender Title</th>
                    <th className="px-6 py-3.5">Vendor Name</th>
                    <th className="px-6 py-3.5">Bid Price / Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Submitted Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border-subtle)">
                  {filteredBids.map((b: Bid) => (
                    <tr
                      key={b.id}
                      className="hover:bg-(--bg-elevated) transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-(--text-faint)">
                        {b.referenceNumber || `#BID-${b.id}`}
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-400 max-w-xs truncate">
                        {b.tender?.title || `Tender #${b.tenderId}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-(--text-primary)">
                        {b.vendor?.name || `Vendor #${b.vendorId}`}
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        $
                        {Number(
                          b.proposedPrice || b.amount || 0,
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
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
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Group justify="flex-end" gap="xs">
                          <Tooltip label="View Full Proposal">
                            <ActionIcon
                              variant="subtle"
                              color="indigo"
                              onClick={() => setSelectedBid(b)}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>

                          {b.bidStatus !== "accepted" && (
                            <Tooltip label="Accept Bid">
                              <ActionIcon
                                variant="subtle"
                                color="emerald"
                                loading={isUpdatingBid}
                                onClick={() =>
                                  handleUpdateBidStatus(b.id, "accepted")
                                }
                              >
                                <IconCheck size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}

                          {b.bidStatus !== "rejected" && (
                            <Tooltip label="Reject Bid">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                loading={isUpdatingBid}
                                onClick={() =>
                                  handleUpdateBidStatus(b.id, "rejected")
                                }
                              >
                                <IconX size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

export default AdminNavigationTabs;
