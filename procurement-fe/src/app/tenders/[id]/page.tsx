/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetTenderQuery,
  useDeleteTenderMutation,
} from "@/src/store/api/tenderApi";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import type { RootState } from "@/src/store/store";
import {
  IconArrowLeft,
  IconAlertTriangle,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { daysLeft } from "@/src/components/shared/constants";
import TenderDetailHeader from "@/src/components/tender/TenderDetailHeader";
import VendorBidSection from "@/src/components/tender/VendorBidSection";
import AdminBidsSection from "@/src/components/tender/AdminBidsSection";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  const { data: tender, isLoading, isError } = useGetTenderQuery(Number(id));
  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const isSuperAdmin = user?.role === "SuperAdmin";
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const isAdminOwner =
    isAdmin && (tender?.createdBy === user?.id || (tender as any)?.createdBy === user?.id);

  async function handleDelete() {
    try {
      await deleteTender(Number(id)).unwrap();
      notifications.show({
        title: "Tender Deleted",
        message: "Tender has been deleted successfully.",
        color: "green",
      });
      router.push("/tenders");
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete tender.",
        color: "red",
      });
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-(--text-subtle) text-sm">
          Loading tender...
        </div>
      </div>
    );

  if (isError || !tender)
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-sm">
          <IconAlertTriangle size={40} className="text-red-400" />
          <p className="text-red-400">Tender not found or failed to load.</p>
          <Link
            href="/tenders"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to tenders
          </Link>
        </div>
      </div>
    );

  const closing = daysLeft(tender.closingDate);

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-6 py-8 mt-14 flex-1">
        <Link
          href="/tenders"
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={16} /> Back to tenders
        </Link>

        <TenderDetailHeader
          tender={tender}
          closing={closing}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          onDelete={() => setShowConfirm(true)}
        />

        <div className="px-8 py-4 bg-(--bg-surface) border border-(--border) rounded-b-2xl -mt-px flex items-center gap-2 text-xs text-(--text-faint)">
          <IconUser size={13} />
          {tender.user ? (
            <>
              Created by{" "}
              <span className="text-(--text-subtle) font-medium">
                {tender.user.name}
              </span>
              <span className="text-(--text-faint)">·</span>
              <span>{tender.user.email}</span>
              <span className="text-(--text-faint)">·</span>
            </>
          ) : (
            <>Created </>
          )}
          {new Date(tender.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {isVendor && <VendorBidSection tender={tender} closing={closing} />}
        {isAdminOwner && <AdminBidsSection bids={tender.bids ?? []} />}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                <IconTrash size={18} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-(--text-primary) text-base">
                Delete tender?
              </h3>
            </div>
            <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
              This will permanently delete{" "}
              <span className="text-(--text-primary) font-medium">
                {tender.title}
              </span>
              . This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
