"use client";
import React from "react";
import Link from "next/link";
import {
  IconClock,
  IconEdit,
  IconTrash,
  IconCurrencyDollar,
  IconCalendar,
  IconHash,
} from "@tabler/icons-react";
import { TENDER_STATUS_COLORS } from "@/src/components/shared/constants";
import type { Tender } from "@/src/types";

interface Props {
  tender: Tender;
  closing: string;
  isAdmin: boolean;
  onDelete: () => void;
}

export default function TenderDetailHeader({
  tender,
  closing,
  isAdmin,
  onDelete,
}: Props) {
  const status =
    TENDER_STATUS_COLORS[tender.status] ?? TENDER_STATUS_COLORS.draft;
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;

  return (
    <div className="bg-(--bg-surface) border border-(--border)  rounded-2xl overflow-hidden">
      <div className="px-8 py-6 border-b border-(--border) ">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </span>
              {isUrgent && closing !== "Closed" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-400 bg-orange-900/30 px-2.5 py-1 rounded-full">
                  <IconClock size={11} /> Urgent
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-(--text-primary)  leading-snug mb-1">
              {tender.title}
            </h1>
            <p className="text-sm text-(--text-subtle) ">{tender.name}</p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/tenders/${tender.id}/edit`}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-(--border-strong)  text-(--text-muted)  hover:text-(--text-primary)  transition-colors"
              >
                <IconEdit size={15} /> Edit
              </Link>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-red-800/60 cursor-pointer text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
              >
                <IconTrash size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-(--border) ">
        {[
          {
            icon: <IconCurrencyDollar size={16} className="text-green-400" />,
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
                    : "text-(--text-subtle) "
                }
              />
            ),
            label: "Closing",
            value: closing,
          },
          {
            icon: <IconCalendar size={16} className="text-indigo-400" />,
            label: "Closing Date",
            value: new Date(tender.closingDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          },
          {
            icon: <IconHash size={16} className="text-(--text-subtle) " />,
            label: "Reference",
            value: tender.referenceNumber,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="px-6 py-4 border-r border-(--border)  last:border-r-0"
          >
            <div className="flex items-center gap-1.5 text-xs text-(--text-subtle)  mb-1">
              {item.icon}
              {item.label}
            </div>
            <p className="text-sm font-semibold text-(--text-primary)  truncate">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-8 py-6 border-b border-(--border) ">
        <h2 className="text-sm font-semibold text-(--text-muted)  mb-3">
          Description
        </h2>
        {tender.description ? (
          <p className="text-sm text-(--text-subtle)  leading-relaxed whitespace-pre-wrap">
            {tender.description}
          </p>
        ) : (
          <p className="text-sm text-(--text-faint)  italic">
            No description provided.
          </p>
        )}
      </div>
    </div>
  );
}
