/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useState } from "react";
import { Tabs } from "@mantine/core";
import { IconFileText, IconGavel } from "@tabler/icons-react";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import {
  useGetBidsByVendorQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
} from "@/src/store/api/bidApi";
import {
  useGetMyVendorQuery,
  useCreateVendorMutation,
} from "@/src/store/api/vendorApi";
import type { Tender, Bid } from "@/src/types";

import VendorHeader from "./VendorHeader";
import VendorFeedbackAlert from "./VendorFeedbackAlert";
import VendorStats from "./VendorStats";
import OpenTendersTab from "./OpenTendersTab";
import SubmittedBidsTab from "./SubmittedBidsTab";
import PlaceBidModal from "./PlaceBidModal";
import EditBidModal from "./EditBidModal";
import DeleteBidModal from "./DeleteBidModal";
import VendorProfileModal from "./VendorProfileModal";

interface VendorDashboardProps {
  currentUser: { id?: number; name?: string; email?: string } | null;
}

export default function VendorDashboard({ currentUser }: VendorDashboardProps) {
  // Vendor Profile
  const { data: myVendor } = useGetMyVendorQuery(undefined);
  const [createVendor, { isLoading: isCreatingVendor }] =
    useCreateVendorMutation();

  // Queries
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery(
    { limit: 100 },
  );
  const allTenders = tendersResult?.data ?? [];

  const { data: myBids = [], isLoading: bidsLoading } = useGetBidsByVendorQuery(
    undefined,
    { skip: !myVendor?.id },
  );

  // Mutations
  const [createBid, { isLoading: isCreatingBid }] = useCreateBidMutation();
  const [updateBid, { isLoading: isUpdatingBid }] = useUpdateBidMutation();
  const [deleteBid, { isLoading: isDeletingBid }] = useDeleteBidMutation();

  // State
  const [activeTab, setActiveTab] = useState<string | null>("tenders");
  const [tenderSearch, setTenderSearch] = useState("");
  const [bidSearch, setBidSearch] = useState("");
  const [bidStatusFilter, setBidStatusFilter] = useState("ALL");

  // Modals
  const [biddingTender, setBiddingTender] = useState<Tender | null>(null);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [deletingBid, setDeletingBid] = useState<Bid | null>(null);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Forms
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [bidNotes, setBidNotes] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorRegNo, setVendorRegNo] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
      setFeedback({
        type: "success",
        message: "Vendor profile created successfully!",
      });
      setShowVendorModal(false);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.data?.message || "Failed to create vendor profile.",
      });
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
      setFeedback({
        type: "success",
        message: `Bid for "${biddingTender.title}" submitted successfully!`,
      });
      setBiddingTender(null);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.data?.message || "Failed to submit bid.",
      });
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
      setFeedback({
        type: "error",
        message: err?.data?.message || "Failed to update bid.",
      });
    }
  };

  const handleDeleteBid = async () => {
    if (!deletingBid) return;
    try {
      await deleteBid(deletingBid.id).unwrap();
      setFeedback({ type: "success", message: "Bid deleted successfully." });
      setDeletingBid(null);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.data?.message || "Failed to delete bid.",
      });
    }
  };

  // Calculations
  const now = Date.now();
  const publishedTenders = allTenders.filter(
    (t) => t.status === "published" && new Date(t.closingDate).getTime() > now,
  );
  const acceptedBids = myBids.filter((b) => b.bidStatus === "accepted");
  const pendingBids = myBids.filter((b) => b.bidStatus === "pending");
  const rejectedBids = myBids.filter((b) => b.bidStatus === "rejected");

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
    const matchesStatus =
      bidStatusFilter === "ALL" || b.bidStatus === bidStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        <VendorHeader
          currentUser={currentUser}
          myVendor={myVendor}
          onOpenVendorModal={() => setShowVendorModal(true)}
          onNavigateBids={() => setActiveTab("bids")}
          bidsCount={myBids.length}
        />

        <VendorFeedbackAlert
          feedback={feedback}
          onDismiss={() => setFeedback(null)}
        />

        <VendorStats
          tendersLoading={tendersLoading}
          bidsLoading={bidsLoading}
          publishedTendersCount={publishedTenders.length}
          myBidsCount={myBids.length}
          acceptedBidsCount={acceptedBids.length}
          pendingBidsCount={pendingBids.length}
          rejectedBidsCount={rejectedBids.length}
        />

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="outline"
          radius="md"
        >
          <Tabs.List className="border-b border-(--border) mb-6">
            <Tabs.Tab value="tenders" leftSection={<IconFileText size={16} />}>
              All Open Tenders ({publishedTenders.length})
            </Tabs.Tab>
            <Tabs.Tab value="bids" leftSection={<IconGavel size={16} />}>
              My Submitted Bids ({myBids.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tenders">
            <OpenTendersTab
              tendersLoading={tendersLoading}
              tenderSearch={tenderSearch}
              onSearchChange={setTenderSearch}
              filteredTenders={filteredTenders}
              myBids={myBids}
              onOpenPlaceBid={handleOpenPlaceBid}
              onOpenEditBid={handleOpenEditBid}
            />
          </Tabs.Panel>

          <Tabs.Panel value="bids">
            <SubmittedBidsTab
              bidsLoading={bidsLoading}
              bidStatusFilter={bidStatusFilter}
              onStatusFilterChange={setBidStatusFilter}
              bidSearch={bidSearch}
              onSearchChange={setBidSearch}
              filteredBids={filteredBids}
              onOpenEditBid={handleOpenEditBid}
              onConfirmDeleteBid={setDeletingBid}
            />
          </Tabs.Panel>
        </Tabs>

        <PlaceBidModal
          biddingTender={biddingTender}
          onClose={() => setBiddingTender(null)}
          onSubmit={handleSubmitNewBid}
          bidAmount={bidAmount}
          onBidAmountChange={setBidAmount}
          bidNotes={bidNotes}
          onBidNotesChange={setBidNotes}
          isCreatingBid={isCreatingBid}
        />

        <EditBidModal
          editingBid={editingBid}
          onClose={() => setEditingBid(null)}
          onSubmit={handleUpdateBid}
          bidAmount={bidAmount}
          onBidAmountChange={setBidAmount}
          bidNotes={bidNotes}
          onBidNotesChange={setBidNotes}
          isUpdatingBid={isUpdatingBid}
        />

        <DeleteBidModal
          deletingBid={deletingBid}
          onClose={() => setDeletingBid(null)}
          onConfirmDelete={handleDeleteBid}
          isDeletingBid={isDeletingBid}
        />

        <VendorProfileModal
          opened={showVendorModal}
          onClose={() => setShowVendorModal(false)}
          onSubmit={handleCreateVendorProfile}
          vendorName={vendorName}
          onVendorNameChange={setVendorName}
          vendorRegNo={vendorRegNo}
          onVendorRegNoChange={setVendorRegNo}
          vendorEmail={vendorEmail}
          onVendorEmailChange={setVendorEmail}
          vendorPhone={vendorPhone}
          onVendorPhoneChange={setVendorPhone}
          isCreatingVendor={isCreatingVendor}
        />
      </div>
    </main>
  );
}
