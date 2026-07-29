"use client";

import React from "react";
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
  IconClock,
  IconCurrencyDollar,
  IconHash,
  IconCalendar,
  IconUser,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
} from "@tabler/icons-react";
import type { TenderStatus } from "@/src/types";
import { Button } from "@mantine/core";
// import { Button, Notification } from "@mantine/core";

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
  const isAdmin = user?.role === "admin";

  const { data: tender, isLoading, isError } = useGetTenderQuery(Number(id));
  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();

  const [showConfirm, setShowConfirm] = React.useState(false);

  async function handleDelete() {
    try {
      const data = await deleteTender(Number(id)).unwrap();
      notifications.show({
       title: "Tender Deleted",
        message: `Tender has been deleted successfully.`,
        color: "green",
      });
      router.push("/tender");
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Failed to delete tender. Please try again.",
        color: "red",
      });
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Loading tender...
        </div>
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
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

  return (
    <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        {/* Back link */}
        <Link
          href="/tender"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <IconArrowLeft size={16} />
          Back to tenders
        </Link>

        {/* Card */}
        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#2a2620]">
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
                <h1 className="text-2xl font-bold text-white leading-snug mb-1">
                  {tender.title}
                </h1>
                <p className="text-sm text-gray-400">{tender.name}</p>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/tender/${tender.id}/edit`}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-[#3a3630] text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
                  >
                    <IconEdit size={15} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-red-800/60 cursor-pointer text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
                  >
                    <IconTrash size={15} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#2a2620]">
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
                        : "text-gray-400"
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
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                ),
              },
              {
                icon: <IconHash size={16} className="text-gray-400" />,
                label: "Reference",
                value: tender.referenceNumber,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="px-6 py-4 cursor-pointer border-r border-[#2a2620] last:border-r-0"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  {item.icon}
                  {item.label}
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-8 py-6 border-b border-[#2a2620]">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              Description
            </h2>
            {tender.description ? (
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                {tender.description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 italic">
                No description provided.
              </p>
            )}
          </div>

          {/* Footer meta */}
          <div className="px-8 py-4 flex items-center gap-2 text-xs text-gray-600">
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

        {/* Bid section placeholder */}
        <Button className="mt-6 bg-[#1c1a16] border border-[#2a2620] rounded-2xl px-8 py-6">
          <h2 className="text-sm font-semibold text-white mb-1">
            {isAdmin ? "View Tender's Bids" : "Submit a Bid"}
          </h2>
        </Button>
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1c1a16] border border-[#2a2620] rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                <IconTrash size={18} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-white text-base">
                Delete tender?
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              This will permanently delete{" "}
              <span className="text-white font-medium">{tender.title}</span>.
              This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-[#3a3630] text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
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
