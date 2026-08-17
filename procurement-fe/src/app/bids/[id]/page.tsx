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
import {
  IconArrowLeft,
  IconGavel,
  IconCurrencyDollar,
  IconCalendar,
  IconHash,
  IconBuilding,
  IconFileText,
  IconTag,
  IconCheck,
  IconTrash,
  IconEdit,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";
import {
  BID_STATUS_STYLES,
  TENDER_STATUS_COLORS,
} from "@/src/components/shared/constants";
import { Button } from "@mantine/core";

const STATUS_OPTIONS = ["pending", "accepted", "rejected"] as const;

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-(--border) last:border-0">
      <span className="text-(--text-faint) mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-(--text-faint) uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="text-sm text-(--text-primary)">{children}</div>
      </div>
    </div>
  );
}

function DeleteModal({
  onConfirm,
  onCancel,
  isDeleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
            <IconTrash size={18} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-(--text-primary) text-base">
            Delete bid?
          </h3>
        </div>
        <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
          This will permanently remove your bid. This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            loading={isDeleting}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            Delete bid
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";

  const [editingStatus, setEditingStatus] = useState<
    (typeof STATUS_OPTIONS)[number] | null
  >(null);
  const [showDelete, setShowDelete] = useState(false);

  const { data: bid, isLoading, isError } = useGetBidByIdQuery(Number(id));
  const { data: myVendor } = useGetMyVendorQuery(undefined, {
    skip: !isVendor,
  });

  const [updateBidStatus, { isLoading: isUpdating }] =
    useUpdateBidStatusMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const isOwnBid = isVendor && myVendor?.id === bid?.vendorId;

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
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-sm text-(--text-subtle)">Loading bid…</p>
          </div>
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
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to bids
          </Link>
        </div>
      </div>
    );
  }

  const bidStyle = BID_STATUS_STYLES[bid.bidStatus];
  const tender = bid.tender;
  const tenderStyle = tender
    ? (TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft)
    : null;

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 mt-14 flex-1">
        {/* Back link */}
        <Link
          href={isVendor ? "/bids/my" : "/bids"}
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={16} /> Back to bids
        </Link>

        {/*  Header card  */}
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden mb-4">
          <div className="px-6 sm:px-8 py-6 border-b border-(--border)">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 flex items-center justify-center shrink-0">
                  <IconGavel size={24} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-(--text-faint) mb-1">
                    Bid Reference
                  </p>
                  <h1 className="text-base sm:text-lg font-bold text-(--text-primary) leading-tight">
                    {bid.referenceNumber}
                  </h1>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Bid #{bid.id}
                  </p>
                </div>
              </div>

              {/* Status badge / edit control */}
              <div className="flex items-center gap-2 flex-wrap">
                {isAdmin && editingStatus ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editingStatus}
                      onChange={(e) =>
                        setEditingStatus(
                          e.target.value as (typeof STATUS_OPTIONS)[number],
                        )
                      }
                      className="bg-(--bg-input) border border-(--border-strong) rounded-lg px-3 py-1.5 text-sm text-(--text-primary) outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleStatusSave}
                      disabled={isUpdating}
                      loading={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    >
                      <IconCheck size={14} />
                      Save
                    </Button>
                    <button
                      onClick={() => setEditingStatus(null)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-lg border  border-(--border-strong) text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${bidStyle.bg} ${bidStyle.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${bidStyle.dot}`}
                      />
                      {bid.bidStatus.charAt(0).toUpperCase() +
                        bid.bidStatus.slice(1)}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => setEditingStatus(bid.bidStatus)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
                      >
                        <IconEdit size={14} /> Edit status
                      </button>
                    )}
                    {isOwnBid && (
                      <Button
                        disabled={isDeleting}
                        loading={isDeleting}
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-800/60 text-sm text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
                      >
                        <IconTrash size={14} /> Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/*  Stats strip  */}
          <div className="grid grid-cols-2 sm:grid-cols-3 border-b border-(--border)">
            {[
              {
                icon: (
                  <IconCurrencyDollar size={15} className="text-emerald-400" />
                ),
                label: "Bid Amount",
                value: `$${Number(bid.amount).toLocaleString()}`,
                highlight: true,
              },
              {
                icon: <IconCalendar size={15} className="text-indigo-400" />,
                label: "Submitted",
                value: new Date(bid.submittedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
              },
              {
                icon: <IconClock size={15} className="text-(--text-subtle)" />,
                label: "Time",
                value: new Date(bid.submittedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="px-5 sm:px-6 py-4 border-r border-(--border) last:border-r-0"
              >
                <div className="flex items-center gap-1.5 text-xs text-(--text-subtle) mb-1">
                  {item.icon}
                  {item.label}
                </div>
                <p
                  className={`text-sm font-semibold truncate ${item.highlight ? "text-emerald-400 text-base" : "text-(--text-primary)"}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/*  Detail rows  */}
          <div className="px-6 sm:px-8 py-2">
            <InfoRow icon={<IconHash size={15} />} label="Bid Reference">
              <span className="font-mono text-xs bg-(--bg-elevated) px-2 py-0.5 rounded">
                {bid.referenceNumber}
              </span>
            </InfoRow>

            <InfoRow icon={<IconBuilding size={15} />} label="Vendor ID">
              Vendor #{bid.vendorId}
            </InfoRow>

            <InfoRow icon={<IconFileText size={15} />} label="Tender">
              {tender ? (
                <Link
                  href={`/tenders/${tender.id}`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  {tender.title}
                </Link>
              ) : (
                <span className="text-(--text-subtle)">
                  Tender #{bid.tenderId}
                </span>
              )}
            </InfoRow>

            {tender && (
              <InfoRow icon={<IconTag size={15} />} label="Category">
                <span className="capitalize">{tender.name}</span>
              </InfoRow>
            )}

            {tender && (
              <InfoRow
                icon={<IconCurrencyDollar size={15} />}
                label="Tender Estimated Value"
              >
                <span>${Number(tender.estimatedValue).toLocaleString()}</span>
              </InfoRow>
            )}

            {tender && tenderStyle && (
              <InfoRow icon={<IconFileText size={15} />} label="Tender Status">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${tenderStyle.bg} ${tenderStyle.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${tenderStyle.dot}`}
                  />
                  {tender.status.charAt(0).toUpperCase() +
                    tender.status.slice(1)}
                </span>
              </InfoRow>
            )}
          </div>
        </div>

        {/*  Tender description card  */}
        {tender?.description && (
          <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden mb-4">
            <div className="px-6 sm:px-8 py-4 border-b border-(--border)">
              <h2 className="text-sm font-semibold text-(--text-muted)">
                Tender Description
              </h2>
            </div>
            <div className="px-6 sm:px-8 py-5">
              <p className="text-sm text-(--text-subtle) leading-relaxed whitespace-pre-wrap">
                {tender.description}
              </p>
            </div>
          </div>
        )}

        {/*  Vendor-only notice  */}
        {isVendor && !isOwnBid && bid && (
          <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl px-5 py-4 flex items-start gap-3">
            <IconAlertTriangle
              size={16}
              className="text-yellow-400 shrink-0 mt-0.5"
            />
            <p className="text-xs text-yellow-400">
              You can only delete bids that belong to your vendor account.
            </p>
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
