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
  NumberInput,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  IconFileText,
  IconClock,
  IconEdit,
  IconTrash,
  IconSearch,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconGavel,
  IconEye,
  IconTrendingUp,
  IconCurrencyDollar,
  IconBuilding,
  IconPlus,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import {
  useGetBidsByVendorQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
} from "@/src/store/api/bidApi";
import { useGetMyVendorQuery, useCreateVendorMutation } from "@/src/store/api/vendorApi";
import type { Tender, Bid } from "@/src/types";

interface VendorDashboardProps {
  currentUser: { id?: number; name?: string; email?: string } | null;
}

export default function VendorDashboard({ currentUser }: VendorDashboardProps) {
  // Vendor Profile
  const { data: myVendor, isLoading: vendorLoading } = useGetMyVendorQuery(undefined);
  const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();

  // Queries
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery({ limit: 100 });
  const allTenders = tendersResult?.data ?? [];

  const { data: myBids = [], isLoading: bidsLoading } = useGetBidsByVendorQuery(undefined, {
    skip: !myVendor?.id,
  });

  // Mutations
  const [createBid, { isLoading: isCreatingBid }] = useCreateBidMutation();
  const [updateBid, { isLoading: isUpdatingBid }] = useUpdateBidMutation();
  const [deleteBid, { isLoading: isDeletingBid }] = useDeleteBidMutation();

  // State
  const [activeTab, setActiveTab] = useState<string | null>("tenders");

  // Filters
  const [tenderSearch, setTenderSearch] = useState("");
  const [bidSearch, setBidSearch] = useState("");
  const [bidStatusFilter, setBidStatusFilter] = useState("ALL");

  // Modals
  const [biddingTender, setBiddingTender] = useState<Tender | null>(null);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [deletingBid, setDeletingBid] = useState<Bid | null>(null);

  // Forms
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [bidNotes, setBidNotes] = useState("");

  const [vendorName, setVendorName] = useState("");
  const [vendorRegNo, setVendorRegNo] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [showVendorModal, setShowVendorModal] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Handlers
  const handleCreateVendorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVendor({
        name: vendorName,
        registrationNumber: vendorRegNo,
        email: vendorEmail || undefined,
        phoneNumber: vendorPhone || undefined,
      }).unwrap();
      setFeedback({ type: "success", message: "Vendor profile created successfully!" });
      setShowVendorModal(false);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to create vendor profile." });
    }
  };

  const handleOpenPlaceBid = (tender: Tender) => {
    if (!myVendor) {
      setShowVendorModal(true);
      return;
    }
    setBiddingTender(tender);
    setBidAmount(tender.estimatedValue ? Number(tender.estimatedValue) : "");
    setBidNotes("");
  };

  const handleSubmitNewBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingTender || !myVendor) return;
    try {
      await createBid({
        tenderId: biddingTender.id,
        vendorId: myVendor.id,
        amount: Number(bidAmount),
        proposedPrice: Number(bidAmount),
        notes: bidNotes || undefined,
      }).unwrap();
      setFeedback({ type: "success", message: `Bid for "${biddingTender.title}" submitted successfully!` });
      setBiddingTender(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to submit bid." });
    }
  };

  const handleOpenEditBid = (bid: Bid) => {
    setEditingBid(bid);
    setBidAmount(bid.amount || bid.proposedPrice || "");
    setBidNotes(bid.notes || bid.proposal || "");
  };

  const handleUpdateBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBid) return;
    try {
      await updateBid({
        id: editingBid.id,
        amount: Number(bidAmount),
        proposedPrice: Number(bidAmount),
        notes: bidNotes || undefined,
      }).unwrap();
      setFeedback({ type: "success", message: "Bid updated successfully!" });
      setEditingBid(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to update bid." });
    }
  };

  const handleDeleteBid = async () => {
    if (!deletingBid) return;
    try {
      await deleteBid(deletingBid.id).unwrap();
      setFeedback({ type: "success", message: "Bid deleted successfully." });
      setDeletingBid(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to delete bid." });
    }
  };

  // Calculations
  const now = Date.now();
  const publishedTenders = allTenders.filter(
    (t) => t.status === "published" && new Date(t.closingDate).getTime() > now
  );
  const acceptedBids = myBids.filter((b) => b.bidStatus === "accepted");
  const pendingBids = myBids.filter((b) => b.bidStatus === "pending");

  // Filtered lists
  const filteredTenders = publishedTenders.filter((t) => {
    const search = tenderSearch.toLowerCase();
    return (
      t.title.toLowerCase().includes(search) ||
      t.referenceNumber.toLowerCase().includes(search) ||
      (t.name && t.name.toLowerCase().includes(search))
    );
  });

  const filteredBids = myBids.filter((b) => {
    const search = bidSearch.toLowerCase();
    const matchesSearch =
      (b.tender?.title || "").toLowerCase().includes(search) ||
      (b.referenceNumber || "").toLowerCase().includes(search);
    const matchesStatus = bidStatusFilter === "ALL" || b.bidStatus === bidStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/70 via-indigo-950/50 to-(--bg-surface) p-6 rounded-2xl border border-emerald-900/40 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge color="emerald" variant="filled" size="sm">
                VENDOR PORTAL
              </Badge>
              {myVendor && (
                <Badge color="indigo" variant="outline" size="sm">
                  {myVendor.name}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-(--text-primary) tracking-tight">
              Tender Marketplace & Bid Center
            </h1>
            <p className="text-sm text-(--text-subtle) mt-1">
              Welcome, <span className="text-emerald-400 font-semibold">{currentUser?.name || "Vendor"}</span>. Browse published tenders, submit proposals, and manage your active bids.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!myVendor && (
              <Button
                leftSection={<IconBuilding size={16} />}
                color="emerald"
                radius="md"
                onClick={() => setShowVendorModal(true)}
              >
                Setup Vendor Profile
              </Button>
            )}
            <Button
              variant="outline"
              color="emerald"
              radius="md"
              onClick={() => setActiveTab("bids")}
              leftSection={<IconGavel size={16} />}
            >
              My Bids ({myBids.length})
            </Button>
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
            icon={<IconFileText size={20} className="text-emerald-400" />}
            label="Available Tenders"
            value={tendersLoading ? "—" : publishedTenders.length}
            sub="Open for bidding"
            color="bg-emerald-950/60"
          />
          <StatusCard
            icon={<IconGavel size={20} className="text-indigo-400" />}
            label="My Submitted Bids"
            value={bidsLoading ? "—" : myBids.length}
            sub="Total bids placed"
            color="bg-indigo-950/60"
          />
          <StatusCard
            icon={<IconTrendingUp size={20} className="text-emerald-400" />}
            label="Accepted / Won Bids"
            value={bidsLoading ? "—" : acceptedBids.length}
            sub="Successful bids"
            color="bg-emerald-950/60"
          />
          <StatusCard
            icon={<IconClock size={20} className="text-amber-400" />}
            label="Pending Review"
            value={bidsLoading ? "—" : pendingBids.length}
            sub="Awaiting admin evaluation"
            color="bg-amber-950/60"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
          <Tabs.List className="border-b border-(--border) mb-6">
            <Tabs.Tab value="tenders" leftSection={<IconFileText size={16} />}>
              All Open Tenders ({publishedTenders.length})
            </Tabs.Tab>
            <Tabs.Tab value="bids" leftSection={<IconGavel size={16} />}>
              My Submitted Bids ({myBids.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: ALL OPEN TENDERS */}
          <Tabs.Panel value="tenders">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">Open Tenders Marketplace</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Browse active tenders and submit competitive bids.
                  </p>
                </div>
                <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
                  <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                  <input
                    type="text"
                    value={tenderSearch}
                    onChange={(e) => setTenderSearch(e.target.value)}
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
                          <tr key={t.id} className="hover:bg-(--bg-elevated) transition-colors">
                            <td className="px-6 py-4 font-mono text-(--text-faint)">{t.referenceNumber}</td>
                            <td className="px-6 py-4 font-semibold text-(--text-primary)">{t.title}</td>
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
                                <Badge color="gray" variant="dot">
                                  Not Bidden Yet
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Group justify="flex-end" gap="xs">
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
                                    leftSection={<IconEdit size={14} />}
                                    onClick={() => handleOpenEditBid(existingBid)}
                                  >
                                    Edit Bid
                                  </Button>
                                ) : (
                                  <Button
                                    color="emerald"
                                    size="xs"
                                    leftSection={<IconGavel size={14} />}
                                    onClick={() => handleOpenPlaceBid(t)}
                                  >
                                    Place Bid
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
          </Tabs.Panel>

          {/* TAB 2: MY SUBMITTED BIDS */}
          <Tabs.Panel value="bids">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">My Submitted Bids</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    View, update proposed prices/notes, or delete your submitted bids.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    size="xs"
                    value={bidStatusFilter}
                    onChange={(v) => setBidStatusFilter(v || "ALL")}
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
                      onChange={(e) => setBidSearch(e.target.value)}
                      placeholder="Search my bids..."
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
                                <ActionIcon
                                  variant="subtle"
                                  color="blue"
                                  onClick={() => handleOpenEditBid(b)}
                                >
                                  <IconEdit size={16} />
                                </ActionIcon>
                              </Tooltip>

                              <Tooltip label="Delete My Bid">
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  onClick={() => setDeletingBid(b)}
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
        </Tabs>

        {/* MODAL: PLACE NEW BID */}
        <Modal
          opened={!!biddingTender}
          onClose={() => setBiddingTender(null)}
          title={<Text fw={700}>Submit Bid for &quot;{biddingTender?.title}&quot;</Text>}
          centered
          radius="md"
        >
          <form onSubmit={handleSubmitNewBid}>
            <Stack gap="md">
              <Text size="xs" c="dimmed">
                Reference: {biddingTender?.referenceNumber} · Estimated Value: $
                {Number(biddingTender?.estimatedValue || 0).toLocaleString()}
              </Text>

              <NumberInput
                label="Your Proposed Bid Price ($)"
                placeholder="Enter bid amount"
                required
                min={1}
                value={bidAmount}
                onChange={setBidAmount}
                leftSection={<IconCurrencyDollar size={16} />}
              />

              <Textarea
                label="Proposal Notes / Pitch (Optional)"
                placeholder="Detail your capability, timeline, or scope specifications..."
                rows={3}
                value={bidNotes}
                onChange={(e) => setBidNotes(e.target.value)}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setBiddingTender(null)}>
                  Cancel
                </Button>
                <Button color="emerald" type="submit" loading={isCreatingBid}>
                  Submit Proposal
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* MODAL: EDIT EXISTING BID */}
        <Modal
          opened={!!editingBid}
          onClose={() => setEditingBid(null)}
          title={
            <Text fw={700}>
              Edit Bid — {editingBid?.referenceNumber || `#BID-${editingBid?.id}`}
            </Text>
          }
          centered
          radius="md"
        >
          <form onSubmit={handleUpdateBid}>
            <Stack gap="md">
              <Text size="xs" c="dimmed">
                Tender: {editingBid?.tender?.title || `Tender #${editingBid?.tenderId}`}
              </Text>

              <NumberInput
                label="Updated Proposed Price ($)"
                placeholder="Enter updated amount"
                required
                min={1}
                value={bidAmount}
                onChange={setBidAmount}
                leftSection={<IconCurrencyDollar size={16} />}
              />

              <Textarea
                label="Updated Proposal Notes"
                placeholder="Update proposal details..."
                rows={3}
                value={bidNotes}
                onChange={(e) => setBidNotes(e.target.value)}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setEditingBid(null)}>
                  Cancel
                </Button>
                <Button color="indigo" type="submit" loading={isUpdatingBid}>
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* MODAL: DELETE BID CONFIRMATION */}
        <Modal
          opened={!!deletingBid}
          onClose={() => setDeletingBid(null)}
          title={
            <Group gap="xs">
              <IconAlertTriangle color="red" size={20} />
              <Text fw={700} c="red">
                Confirm Bid Deletion
              </Text>
            </Group>
          }
          centered
          radius="md"
        >
          <Stack gap="md">
            <Text size="sm">
              Are you sure you want to delete your bid for tender{" "}
              <span className="font-semibold text-white">
                &quot;{deletingBid?.tender?.title || `Tender #${deletingBid?.tenderId}`}&quot;
              </span>
              ? This action cannot be undone.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setDeletingBid(null)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteBid} loading={isDeletingBid}>
                Delete Bid
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* MODAL: CREATE VENDOR PROFILE */}
        <Modal
          opened={showVendorModal}
          onClose={() => setShowVendorModal(false)}
          title={<Text fw={700}>Create Vendor Profile</Text>}
          centered
          radius="md"
        >
          <form onSubmit={handleCreateVendorProfile}>
            <Stack gap="md">
              <Text size="xs" c="dimmed">
                You must register your vendor company details before placing bids on tenders.
              </Text>
              <TextInput
                label="Company / Vendor Name"
                placeholder="e.g. Acme Supplies Ltd"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
              <TextInput
                label="Registration Number"
                placeholder="e.g. REG-98765"
                required
                value={vendorRegNo}
                onChange={(e) => setVendorRegNo(e.target.value)}
              />
              <TextInput
                label="Business Email"
                placeholder="contact@company.com"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
              />
              <TextInput
                label="Phone Number"
                placeholder="+1 234 567 8900"
                value={vendorPhone}
                onChange={(e) => setVendorPhone(e.target.value)}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setShowVendorModal(false)}>
                  Cancel
                </Button>
                <Button color="emerald" type="submit" loading={isCreatingVendor}>
                  Create Profile
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

      </div>
    </main>
  );
}
