"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Tabs,
  ActionIcon,
  Tooltip,
  Select,
  Paper,
} from "@mantine/core";
import {
  IconFileText,
  IconClock,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconChevronRight,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconGavel,
  IconEye,
  IconTrendingUp,
  IconChecklist,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import { useGetTendersQuery, useDeleteTenderMutation } from "@/src/store/api/tenderApi";
import { useGetAllBidsQuery, useUpdateBidStatusMutation } from "@/src/store/api/bidApi";
import type { Tender, Bid } from "@/src/types";

interface AdminDashboardProps {
  currentUser: { id?: number; name?: string; email?: string } | null;
}

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  // Queries
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery({ limit: 100 });
  const myTenders = tendersResult?.data ?? [];

  const { data: myBids = [], isLoading: bidsLoading } = useGetAllBidsQuery();

  // Mutations
  const [deleteTender, { isLoading: isDeletingTender }] = useDeleteTenderMutation();
  const [updateBidStatus, { isLoading: isUpdatingBid }] = useUpdateBidStatusMutation();

  // State
  const [activeTab, setActiveTab] = useState<string | null>("tenders");
  const [tenderSearch, setTenderSearch] = useState("");
  const [tenderStatusFilter, setTenderStatusFilter] = useState("ALL");

  const [bidSearch, setBidSearch] = useState("");
  const [bidStatusFilter, setBidStatusFilter] = useState("ALL");

  const [deletingTender, setDeletingTender] = useState<Tender | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Handlers
  const handleDeleteTender = async () => {
    if (!deletingTender) return;
    try {
      await deleteTender(deletingTender.id).unwrap();
      setFeedback({ type: "success", message: `Tender "${deletingTender.title}" deleted successfully.` });
      setDeletingTender(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to delete tender" });
    }
  };

  const handleUpdateBidStatus = async (bidId: number, status: "accepted" | "rejected" | "pending") => {
    try {
      await updateBidStatus({ id: bidId, status }).unwrap();
      setFeedback({
        type: "success",
        message: `Bid status updated to "${status.toUpperCase()}".`,
      });
      if (selectedBid?.id === bidId) {
        setSelectedBid((prev) => (prev ? { ...prev, bidStatus: status } : null));
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to update bid status" });
    }
  };

  // Calculations
  const now = Date.now();
  const activeTenders = myTenders.filter(
    (t) => t.status === "published" && new Date(t.closingDate).getTime() > now
  );
  const pendingBids = myBids.filter((b) => b.bidStatus === "pending");
  const acceptedBids = myBids.filter((b) => b.bidStatus === "accepted");

  // Filters
  const filteredTenders = myTenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(tenderSearch.toLowerCase());
    const matchesStatus = tenderStatusFilter === "ALL" || t.status === tenderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBids = myBids.filter((b) => {
    const tenderTitle = b.tender?.title || "";
    const vendorName = b.vendor?.name || "";
    const matchesSearch =
      tenderTitle.toLowerCase().includes(bidSearch.toLowerCase()) ||
      vendorName.toLowerCase().includes(bidSearch.toLowerCase()) ||
      (b.referenceNumber && b.referenceNumber.toLowerCase().includes(bidSearch.toLowerCase()));
    const matchesStatus = bidStatusFilter === "ALL" || b.bidStatus === bidStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-(--bg-surface) p-6 rounded-2xl border border-indigo-900/40 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge color="blue" variant="filled" size="sm">
                ADMIN CONTROL PANEL
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-(--text-primary) tracking-tight">
              Tender & Bid Operations
            </h1>
            <p className="text-sm text-(--text-subtle) mt-1">
              Welcome back, <span className="text-indigo-400 font-semibold">{currentUser?.name || "Admin"}</span>. Track and manage your created tenders and evaluate submitted vendor bids.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tenders/create">
              <Button leftSection={<IconPlus size={16} />} color="indigo" radius="md" size="md">
                Create New Tender
              </Button>
            </Link>
            <Link href="/tenders/manage">
              <Button variant="outline" color="indigo" radius="md" size="md">
                Manage Tenders
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`flex items-center justify-between p-4 rounded-xl border ${
              feedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                : "bg-red-950/60 border-red-800 text-red-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === "success" ? <IconCheck size={20} /> : <IconX size={20} />}
              <p className="text-sm font-medium">{feedback.message}</p>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon={<IconFileText size={20} className="text-indigo-400" />}
            label="My Total Tenders"
            value={tendersLoading ? "—" : myTenders.length}
            sub="Created by you"
            color="bg-indigo-950/60"
          />
          <StatusCard
            icon={<IconTrendingUp size={20} className="text-emerald-400" />}
            label="Active Tenders"
            value={tendersLoading ? "—" : activeTenders.length}
            sub="Currently receiving bids"
            color="bg-emerald-950/60"
          />
          <StatusCard
            icon={<IconGavel size={20} className="text-purple-400" />}
            label="Total Bids Received"
            value={bidsLoading ? "—" : myBids.length}
            sub="Across your tenders"
            color="bg-purple-950/60"
          />
          <StatusCard
            icon={<IconChecklist size={20} className="text-amber-400" />}
            label="Pending Review"
            value={bidsLoading ? "—" : pendingBids.length}
            sub="Awaiting your decision"
            color="bg-amber-950/60"
          />
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
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
                  <h2 className="text-base font-bold text-(--text-primary)">My Created Tenders</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Track status, update details, or delete procurement tenders created under your account.
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
                    <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                    <input
                      type="text"
                      value={tenderSearch}
                      onChange={(e) => setTenderSearch(e.target.value)}
                      placeholder="Search my tenders..."
                      className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                    />
                  </div>
                  <Link href="/tenders/create">
                    <Button leftSection={<IconPlus size={14} />} color="indigo" size="xs">
                      New Tender
                    </Button>
                  </Link>
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
                  No tenders found matching criteria. Click &quot;New Tender&quot; to post one.
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
                        <tr key={t.id} className="hover:bg-(--bg-elevated) transition-colors">
                          <td className="px-6 py-4 font-mono text-(--text-faint)">{t.referenceNumber}</td>
                          <td className="px-6 py-4 font-semibold text-(--text-primary)">{t.title}</td>
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
                          <td className="px-6 py-4">
                            <Badge color="purple" variant="light">
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
                  <h2 className="text-base font-bold text-(--text-primary)">Received Vendor Bids</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Evaluate and decide (Accept / Reject / Pending) on bids submitted to your active tenders.
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
                    <IconSearch size={16} className="text-(--text-faint) shrink-0" />
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
                    <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
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
                        <tr key={b.id} className="hover:bg-(--bg-elevated) transition-colors">
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
                            ${Number(b.proposedPrice || b.amount || 0).toLocaleString()}
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
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
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
                                    onClick={() => handleUpdateBidStatus(b.id, "accepted")}
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
                                    onClick={() => handleUpdateBidStatus(b.id, "rejected")}
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

        {/* MODAL: DELETE TENDER CONFIRMATION */}
        <Modal
          opened={!!deletingTender}
          onClose={() => setDeletingTender(null)}
          title={
            <Group gap="xs">
              <IconAlertTriangle color="red" size={20} />
              <Text fw={700} c="red">
                Confirm Tender Deletion
              </Text>
            </Group>
          }
          centered
          radius="md"
        >
          <Stack gap="md">
            <Text size="sm">
              Are you sure you want to delete tender{" "}
              <span className="font-semibold text-white">&quot;{deletingTender?.title}&quot;</span>?
              This will permanently remove the tender and all submitted bids.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setDeletingTender(null)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteTender} loading={isDeletingTender}>
                Delete Tender
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* MODAL: VIEW BID DETAILS & PROPOSAL */}
        <Modal
          opened={!!selectedBid}
          onClose={() => setSelectedBid(null)}
          title={
            <Text fw={700}>
              Bid Details — {selectedBid?.referenceNumber || `#BID-${selectedBid?.id}`}
            </Text>
          }
          centered
          size="lg"
          radius="md"
        >
          {selectedBid && (
            <Stack gap="md">
              <div className="grid grid-cols-2 gap-4 bg-(--bg-elevated) p-4 rounded-xl border border-(--border)">
                <div>
                  <Text size="xs" c="dimmed">
                    Tender Title
                  </Text>
                  <Text fw={600} size="sm">
                    {selectedBid.tender?.title || `Tender #${selectedBid.tenderId}`}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Vendor Company
                  </Text>
                  <Text fw={600} size="sm">
                    {selectedBid.vendor?.name || `Vendor #${selectedBid.vendorId}`}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Proposed Amount
                  </Text>
                  <Text fw={700} size="md" c="green">
                    ${Number(selectedBid.proposedPrice || selectedBid.amount || 0).toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Current Bid Status
                  </Text>
                  <Badge
                    color={
                      selectedBid.bidStatus === "accepted"
                        ? "emerald"
                        : selectedBid.bidStatus === "rejected"
                        ? "red"
                        : "yellow"
                    }
                    variant="light"
                    mt={4}
                  >
                    {selectedBid.bidStatus?.toUpperCase() || "PENDING"}
                  </Badge>
                </div>
              </div>

              <div>
                <Text size="xs" fw={700} c="dimmed" mb={4}>
                  Proposal Description / Note
                </Text>
                <Paper p="md" radius="md" withBorder className="bg-(--bg-surface) text-xs leading-relaxed">
                  {selectedBid.proposal || selectedBid.notes || "No detailed proposal text submitted."}
                </Paper>
              </div>

              <Group justify="space-between" mt="md" className="pt-4 border-t border-(--border)">
                <Group gap="xs">
                  <Button
                    color="emerald"
                    size="xs"
                    disabled={selectedBid.bidStatus === "accepted"}
                    onClick={() => handleUpdateBidStatus(selectedBid.id, "accepted")}
                  >
                    Accept Bid
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    disabled={selectedBid.bidStatus === "rejected"}
                    onClick={() => handleUpdateBidStatus(selectedBid.id, "rejected")}
                  >
                    Reject Bid
                  </Button>
                </Group>
                <Button variant="default" size="xs" onClick={() => setSelectedBid(null)}>
                  Close
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </div>
    </main>
  );
}
