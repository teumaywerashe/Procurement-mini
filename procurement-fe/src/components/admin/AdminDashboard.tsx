/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Modal, Button, Group, Stack, Text, Badge, Paper } from "@mantine/core";
import {
  IconFileText,
  IconAlertTriangle,
  IconGavel,
  IconTrendingUp,
  IconChecklist,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import {
  useGetTendersQuery,
  useDeleteTenderMutation,
} from "@/src/store/api/tenderApi";
import {
  useGetAllBidsQuery,
  useUpdateBidStatusMutation,
} from "@/src/store/api/bidApi";
import type { Tender, Bid } from "@/src/types";
import { notifications } from "@mantine/notifications";
import LoadingSpan from "@/src/utilis/LoadingSpan";
import AdminNavigationTabs from "./AdminNavigationTabs";
import AdminBanerHeader from "./AdminBanerHeader";
import AdminBidDetailModel from "./AdminBidDetailModel";

export interface AdminDashboardProps {
  currentUser: { id?: number; name?: string; email?: string } | null;
}

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery(
    { limit: 100 },
  );
  const rawTenders = tendersResult?.data ?? [];
  const myTenders = rawTenders.filter(
    (t) =>
      t.createdBy === currentUser?.id ||
      (t as any).createdBy === currentUser?.id,
  );

  const { data: rawBids = [], isLoading: bidsLoading } = useGetAllBidsQuery();
  const myBids = rawBids.filter((b) => {
    if (!b.tender) return true;
    return (
      b.tender.createdBy === currentUser?.id ||
      (b.tender as any).createdBy === currentUser?.id
    );
  });

  const [deleteTender, { isLoading: isDeletingTender }] =
    useDeleteTenderMutation();
  const [updateBidStatus, { isLoading: isUpdatingBid }] =
    useUpdateBidStatusMutation();

  const [tenderSearch, setTenderSearch] = useState("");
  const [tenderStatusFilter, setTenderStatusFilter] = useState("ALL");

  const [bidSearch, setBidSearch] = useState("");
  const [bidStatusFilter, setBidStatusFilter] = useState("ALL");

  const [deletingTender, setDeletingTender] = useState<Tender | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  const handleDeleteTender = async () => {
    if (!deletingTender) return;
    try {
      await deleteTender(deletingTender.id).unwrap();
      notifications.show({
        title: "deleted",
        message: `Tender "${deletingTender.title}" deleted successfully.`,
      });
      setDeletingTender(null);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err?.data?.message || "Failed to delete tender",
        color: "red",
      });
    }
  };

  const handleUpdateBidStatus = async (
    bidId: number,
    status: "accepted" | "rejected" | "pending",
  ) => {
    try {
      await updateBidStatus({ id: bidId, status }).unwrap();
      notifications.show({
        title: `Bid Status updated to ${status}`,
        message: `Successfully updated bid status to ${status}`,
        color: "green",
      });
      if (selectedBid?.id === bidId) {
        setSelectedBid((prev) =>
          prev ? { ...prev, bidStatus: status } : null,
        );
      }
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err?.data?.message || "Failed to update bid status.",
        color: "red",
      });
    }
  };

  const now = Date.now();
  const activeTenders = myTenders.filter(
    (t) => t.status === "published" && new Date(t.closingDate).getTime() > now,
  );
  const pendingBids = myBids.filter((b) => b.bidStatus === "pending");

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        {/* Banner / Header */}
        <AdminBanerHeader currentUser={currentUser} />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon={<IconFileText size={20} className="text-indigo-400" />}
            label="My Total Tenders"
            value={tendersLoading ? <LoadingSpan /> : myTenders.length}
            sub="Created by you"
            color="bg-indigo-950/60"
          />
          <StatusCard
            icon={<IconTrendingUp size={20} className="text-emerald-400" />}
            label="Active Tenders"
            value={tendersLoading ? <LoadingSpan /> : activeTenders.length}
            sub="Currently receiving bids"
            color="bg-emerald-950/60"
          />
          <StatusCard
            icon={<IconGavel size={20} className="text-purple-400" />}
            label="Total Bids Received"
            value={bidsLoading ? <LoadingSpan /> : myBids.length}
            sub="Across your tenders"
            color="bg-purple-950/60"
          />
          <StatusCard
            icon={<IconChecklist size={20} className="text-amber-400" />}
            label="Pending Review"
            value={bidsLoading ? <LoadingSpan /> : pendingBids.length}
            sub="Awaiting your decision"
            color="bg-amber-950/60"
          />
        </div>

        {/* Navigation Tabs */}
        <AdminNavigationTabs
          myBids={myBids}
          bidsLoading={bidsLoading}
          setBidStatusFilter={setBidStatusFilter}
          setBidSearch={setBidSearch}
          setDeletingTender={setDeletingTender}
          tendersLoading={tendersLoading}
          setTenderStatusFilter={setTenderStatusFilter}
          setTenderSearch={setTenderSearch}
          myTenders={myTenders}
          tenderSearch={tenderSearch}
          tenderStatusFilter={tenderStatusFilter}
          bidSearch={bidSearch}
          isUpdatingBid={isUpdatingBid}
          bidStatusFilter={bidStatusFilter}
          setSelectedBid={setSelectedBid}
          handleUpdateBidStatus={handleUpdateBidStatus}
        />

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
              <span className="font-semibold text-white">
                &quot;{deletingTender?.title}&quot;
              </span>
              ? This will permanently remove the tender and all submitted bids.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setDeletingTender(null)}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDeleteTender}
                loading={isDeletingTender}
              >
                Delete Tender
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* MODAL: VIEW BID DETAILS & PROPOSAL */}
        <AdminBidDetailModel
          selectedBid={selectedBid}
          setSelectedBid={setSelectedBid}
          handleUpdateBidStatus={handleUpdateBidStatus}
        />
      </div>
    </main>
  );
}
