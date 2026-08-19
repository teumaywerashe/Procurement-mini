/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import {
  useGetBidByIdQuery,
  useUpdateBidStatusMutation,
  useDeleteBidMutation,
} from "@/src/store/api/bidApi";
import { useGetMyVendorQuery } from "@/src/store/api/vendorApi";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import { BidHeaderCard } from "@/src/components/bid/BidHeaderCard";
import { BidStatsAndInfo } from "@/src/components/bid/BidStatsAndInfo";
import { BidDocumentSection } from "@/src/components/bid/BidDocumentSection";
import { DeleteBidModal } from "@/src/components/bid/DeleteBidModal";
import { TenderDescriptionCard } from "@/src/components/bid/TenderDescriptionCard";
import { useBidDocuments } from "@/src/components/bid/useBidDocuments";

export default function BidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bidId = Number(id);
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";

  const [editingStatus, setEditingStatus] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);

  const {
    data: bid,
    isLoading,
    isError,
  } = useGetBidByIdQuery(bidId, {
    skip: !Number.isInteger(bidId) || bidId <= 0,
  });
  const { data: myVendor } = useGetMyVendorQuery(undefined, {
    skip: !isVendor,
  });

  const [updateBidStatus, { isLoading: isUpdating }] =
    useUpdateBidStatusMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const isOwnBid = isVendor && myVendor?.id === bid?.vendorId;
  const isTenderAdminOwner =
    isAdmin &&
    (bid?.tender?.createdBy === user?.id ||
      (bid?.tender as any)?.createdBy === user?.id);
  const canViewBidDocuments = isOwnBid || isTenderAdminOwner;

  const docState = useBidDocuments(bidId, canViewBidDocuments);

  async function handleStatusSave() {
    if (!editingStatus || !bid) return;
    try {
      await updateBidStatus({ id: bid.id, status: editingStatus }).unwrap();
      notifications.show({
        title: "Status updated",
        message: `Bid marked as ${editingStatus}.`,
        color: "green",
      });
      setEditingStatus(null);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update status.",
        color: "red",
      });
    }
  }

  async function handleDelete() {
    if (!bid) return;
    try {
      await deleteBid(bid.id).unwrap();
      notifications.show({
        title: "Bid deleted",
        message: "Your bid has been removed.",
        color: "green",
      });
      router.push(isVendor ? "/bids/my" : "/bids");
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete bid.",
        color: "red",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-14">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }
 

  if (isError || !bid) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-14">
          <IconAlertTriangle size={40} className="text-red-400" />
          <p className="text-sm text-red-400">
            Bid not found or failed to load.
          </p>
          <Link
            href={isVendor ? "/bids/my" : "/bids"}
            className="text-sm text-indigo-400"
          >
            ← Back to bids
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 mt-14 flex-1">
        <Link
          href={isVendor ? "/bids/my" : "/bids"}
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) mb-6"
        >
          <IconArrowLeft size={16} /> Back to bids
        </Link>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden mb-4">
          <BidHeaderCard
            bid={bid}
            isAdmin={isAdmin}
            isOwnBid={isOwnBid}
            editingStatus={editingStatus}
            setEditingStatus={setEditingStatus}
            onSaveStatus={handleStatusSave}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            onOpenDelete={() => setShowDelete(true)}
          />
          <BidStatsAndInfo bid={bid} />
        </div>

        {canViewBidDocuments && (
          <BidDocumentSection
            bidStatus={bid.bidStatus}
            isOwnBid={isOwnBid}
            setShowConfirm={docState.setShowConfirm}
            showConfirm={docState.showConfirm}
            isDeleting={docState.isDeletingDocument}
            bidDocuments={docState.bidDocuments}
            isUploadingDocument={docState.isUploadingDocument}
            onUploadDocument={docState.handleUpload}
            onDownloadDocument={docState.handleDownload}
            onDeleteDocument={docState.handleDelete}
            downloadingDocId={docState.downloadingDocId}
          />
        )}

        <TenderDescriptionCard description={bid.tender?.description} />
      </div>

      {showDelete && (
        <DeleteBidModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
