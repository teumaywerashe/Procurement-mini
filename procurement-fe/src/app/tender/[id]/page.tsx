"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetTenderQuery,
  useDeleteTenderMutation,
} from "@/src/store/api/tenderApi";
import {
  useGetBidsByVendorQuery,
  useGetBidsByTenderQuery,
  useCreateBidMutation,
} from "@/src/store/api/bidApi";
import {
  useGetMyVendorQuery,
  useCreateVendorMutation,
} from "@/src/store/api/vendorApi";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import type { RootState } from "@/src/store/store";
import {
  IconArrowLeft,
  IconClock,
  IconCurrencyDollar,
  IconHash,
  IconCalendar,
  IconUser,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconGavel,
  IconCheck,
} from "@tabler/icons-react";
import type { TenderStatus } from "@/src/types";

const STATUS_COLORS: Record<
  TenderStatus,
  { bg: string; text: string; dot: string }
> = {
  published: {
    bg: "bg-green-900/40",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  draft: { bg: "bg-gray-800", text: "text-gray-400", dot: "bg-gray-400" },
  closed: { bg: "bg-red-900/40", text: "text-red-400", dot: "bg-red-400" },
  awarded: {
    bg: "bg-indigo-900/40",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  cancelled: {
    bg: "bg-orange-900/40",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
};

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";

  const { data: tender, isLoading, isError } = useGetTenderQuery(Number(id));
  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Vendor: get own vendor profile and bids for this tender
  const {
    data: vendor,
    isLoading: vendorLoading,
    isError: vendorError,
  } = useGetMyVendorQuery(undefined, { skip: !isVendor });
  const { data: myBids = [], isLoading: myBidsLoading } =
    useGetBidsByVendorQuery(vendor?.id ?? 0, { skip: !vendor?.id });
  const hasAlreadyBid = myBids.some((b) => b.tenderId === Number(id));
  const hasVendorProfile = !!vendor && !vendorError;

  // Vendor creation state
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    phoneNumber: "",
  });
  const [createVendor, { isLoading: isCreatingVendor }] =
    useCreateVendorMutation();

  // Admin: get all bids for this tender
  const { data: tenderBids = [] } = useGetBidsByTenderQuery(Number(id), {
    skip: !isAdmin,
  });

  // Bid submission state
  const [bidAmount, setBidAmount] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const [createBid, { isLoading: isSubmitting }] = useCreateBidMutation();

  async function handleDelete() {
    try {
      await deleteTender(Number(id)).unwrap();
      notifications.show({
        title: "Tender Deleted",
        message: "Tender has been deleted successfully.",
        color: "green",
      });
      router.push("/tender");
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete tender. Please try again.",
        color: "red",
      });
    }
  }

  async function handleSubmitBid(e: React.FormEvent) {
    e.preventDefault();
    if (!vendor?.id) return;
    try {
      await createBid({
        tenderId: Number(id),
        vendorId: vendor.id,
        amount: Number(bidAmount),
      }).unwrap();
      notifications.show({
        title: "Bid Submitted",
        message: "Your bid has been submitted successfully.",
        color: "green",
      });
      setBidAmount("");
      console.log("bid submitted");
      setShowBidForm(false);
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Failed to submit bid. Please try again.",
        color: "red",
      });
    }
  }

  async function handleCreateVendor(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createVendor({
        name: vendorForm.name,
        registrationNumber: vendorForm.registrationNumber,
        email: vendorForm.email || undefined,
        phoneNumber: vendorForm.phoneNumber || undefined,
      }).unwrap();
      notifications.show({
        title: "Vendor Created",
        message: "Your vendor profile is ready. You can now submit bids.",
        color: "green",
      });
      setShowVendorForm(false);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to create vendor profile. Please try again.",
        color: "red",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-[var(--text-subtle)] text-sm">
          Loading tender...
        </div>
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-sm">
          <IconAlertTriangle size={40} className="text-red-400" />
          <p className="text-red-400">Tender not found or failed to load.</p>
          <Link
            href="/tender"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to tenders
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_COLORS[tender.status] ?? STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;
  const canBid =
    isVendor && tender.status === "published" && closing !== "Closed";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        <Link
          href="/tender"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <IconArrowLeft size={16} />
          Back to tenders
        </Link>

        {/* Main card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[var(--border)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                    />
                    {tender.status.charAt(0).toUpperCase() +
                      tender.status.slice(1)}
                  </span>
                  {isUrgent && closing !== "Closed" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-400 bg-orange-900/30 px-2.5 py-1 rounded-full">
                      <IconClock size={11} /> Urgent
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-snug mb-1">
                  {tender.title}
                </h1>
                <p className="text-sm text-[var(--text-subtle)]">
                  {tender.name}
                </p>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/tender/${tender.id}/edit`}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-subtle)] transition-colors"
                  >
                    <IconEdit size={15} /> Edit
                  </Link>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-red-800/60 cursor-pointer text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
                  >
                    <IconTrash size={15} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--border)]">
            {[
              {
                icon: (
                  <IconCurrencyDollar size={16} className="text-green-400" />
                ),
                label: "Estimated Value",
                value: `$${Number(tender.estimatedValue).toLocaleString()}`,
              },
              {
                icon: (
                  <IconClock
                    size={16}
                    className={
                      isUrgent && closing !== "Closed"
                        ? "text-orange-400"
                        : "text-[var(--text-subtle)]"
                    }
                  />
                ),
                label: "Closing",
                value: closing,
              },
              {
                icon: <IconCalendar size={16} className="text-indigo-400" />,
                label: "Closing Date",
                value: new Date(tender.closingDate).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "short", day: "numeric" },
                ),
              },
              {
                icon: (
                  <IconHash size={16} className="text-[var(--text-subtle)]" />
                ),
                label: "Reference",
                value: tender.referenceNumber,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="px-6 py-4 border-r border-[var(--border)] last:border-r-0"
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] mb-1">
                  {item.icon}
                  {item.label}
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-8 py-6 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
              Description
            </h2>
            {tender.description ? (
              <p className="text-sm text-[var(--text-subtle)] leading-relaxed whitespace-pre-wrap">
                {tender.description}
              </p>
            ) : (
              <p className="text-sm text-[var(--text-faint)] italic">
                No description provided.
              </p>
            )}
          </div>

          {/* Footer meta */}
          <div className="px-8 py-4 flex items-center gap-2 text-xs text-[var(--text-faint)]">
            <IconUser size={13} />
            <span>
              Created{" "}
              {new Date(tender.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ── Vendor: Bid section ── */}
        {isVendor && (
          <div className="mt-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-8 py-5">
              {vendorLoading || myBidsLoading ? (
                /* Loading */
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-[var(--bg-elevated)] rounded animate-pulse" />
                    <div className="h-2.5 w-48 bg-[var(--bg-elevated)] rounded animate-pulse" />
                  </div>
                </div>
              ) : !hasVendorProfile ? (
                /* No vendor profile — prompt to create one */
                showVendorForm ? (
                  <form onSubmit={handleCreateVendor} className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                        Create Vendor Profile
                      </h2>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                        You need a vendor profile before you can submit bids.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">
                          Company name <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          value={vendorForm.name}
                          onChange={(e) =>
                            setVendorForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Acme Corporation"
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">
                          Registration number{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          value={vendorForm.registrationNumber}
                          onChange={(e) =>
                            setVendorForm((f) => ({
                              ...f,
                              registrationNumber: e.target.value,
                            }))
                          }
                          placeholder="REG-123456"
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">
                          Email{" "}
                          <span className="text-[var(--text-faint)]">
                            (optional)
                          </span>
                        </label>
                        <input
                          type="email"
                          value={vendorForm.email}
                          onChange={(e) =>
                            setVendorForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          placeholder="vendor@company.com"
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">
                          Phone{" "}
                          <span className="text-[var(--text-faint)]">
                            (optional)
                          </span>
                        </label>
                        <input
                          value={vendorForm.phoneNumber}
                          onChange={(e) =>
                            setVendorForm((f) => ({
                              ...f,
                              phoneNumber: e.target.value,
                            }))
                          }
                          placeholder="+1 234 567 8900"
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={isCreatingVendor}
                        className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
                      >
                        {isCreatingVendor
                          ? "Creating..."
                          : "Create Vendor Profile"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVendorForm(false)}
                        className="px-4 py-2.5 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-950/60 flex items-center justify-center shrink-0">
                        <IconGavel size={18} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          Vendor profile required
                        </p>
                        <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                          You need a vendor profile to submit bids on tenders.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowVendorForm(true)}
                      className="flex items-center cursor-pointer gap-1.5 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-semibold text-white transition-colors shrink-0"
                    >
                      Create Vendor Profile
                    </button>
                  </div>
                )
              ) : hasAlreadyBid ? (
                // Already submitted
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/60 flex items-center justify-center">
                    <IconCheck size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">
                      Bid Submitted
                    </p>
                    <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                      You have already submitted a bid for this tender.{" "}
                      <Link
                        href="/bids/my"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        View my bids →
                      </Link>
                    </p>
                  </div>
                </div>
              ) : !canBid ? (
                // Not open for bidding
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                    <IconGavel size={18} className="text-[var(--text-faint)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-subtle)]">
                      Bidding not available
                    </p>
                    <p className="text-xs text-[var(--text-faint)] mt-0.5">
                      This tender is {tender.status} and is not accepting bids.
                    </p>
                  </div>
                </div>
              ) : showBidForm ? (
                // Bid form
                <form onSubmit={handleSubmitBid}>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                    Submit Your Bid
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 gap-2 focus-within:border-indigo-500 transition-colors">
                      <IconCurrencyDollar
                        size={15}
                        className="text-[var(--text-faint)] shrink-0"
                      />
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        min={1}
                        step="0.01"
                        required
                        className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none flex-1"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !bidAmount}
                      className="px-5 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Bid"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="px-4 py-2.5 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // CTA to open form
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-950/60 flex items-center justify-center">
                      <IconGavel size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Submit a Bid
                      </p>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                        Estimated value: $
                        {Number(tender.estimatedValue).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors"
                  >
                    <IconGavel size={15} />
                    Place Bid
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Admin: View bids for this tender ── */}
        {isAdmin && (
          <div className="mt-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-8 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconGavel size={15} className="text-indigo-400" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Bids ({tenderBids.length})
                </h2>
              </div>
            </div>
            {tenderBids.length === 0 ? (
              <div className="px-8 py-8 text-center">
                <p className="text-sm text-[var(--text-subtle)]">
                  No bids have been submitted for this tender yet.
                </p>
              </div>
            ) : (
              <div>
                {tenderBids
                  .slice()
                  .sort((a, b) => Number(b.amount) - Number(a.amount))
                  .map((bid, i) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between px-8 py-3.5 border-b border-[var(--border-subtle)] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[var(--text-faint)] w-5 tabular-nums">
                          #{i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            ${Number(bid.amount).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-[var(--text-faint)]">
                            Vendor #{bid.vendorId} ·{" "}
                            {new Date(bid.submittedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                          bid?.bidStatus === "accepted"
                            ? "bg-emerald-950/60 text-emerald-400"
                            : bid?.bidStatus === "rejected"
                              ? "bg-red-950/60 text-red-400"
                              : "bg-yellow-950/60 text-yellow-400"
                        }`}
                      >
                        {bid?.bidStatus?.charAt(0).toUpperCase() +
                          bid?.bidStatus?.slice(1)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                <IconTrash size={18} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] text-base">
                Delete tender?
              </h3>
            </div>
            <p className="text-sm text-[var(--text-subtle)] mb-5 leading-relaxed">
              This will permanently delete{" "}
              <span className="text-[var(--text-primary)] font-medium">
                {tender.title}
              </span>
              . This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-subtle)] transition-colors"
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
