/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import {
  IconCurrencyDollar,
  IconCalendar,
  IconClock,
  IconHash,
  IconBuilding,
  IconFileText,
  IconTag,
} from "@tabler/icons-react";
import { TENDER_STATUS_COLORS } from "@/src/components/shared/constants";

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

export function BidStatsAndInfo({ bid }: { bid: any }) {
  const tender = bid.tender;
  const tenderStyle = tender
    ? (TENDER_STATUS_COLORS[tender.status as keyof typeof TENDER_STATUS_COLORS] ?? TENDER_STATUS_COLORS.draft)
    : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 border-b border-(--border)">
        {[
          {
            icon: <IconCurrencyDollar size={15} className="text-emerald-400" />,
            label: "Bid Amount",
            value: `${Number(bid.amount).toLocaleString()}`,
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
            <span className="text-(--text-subtle)">Tender #{bid.tenderId}</span>
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
              <span className={`w-1.5 h-1.5 rounded-full ${tenderStyle.dot}`} />
              {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
            </span>
          </InfoRow>
        )}
      </div>
    </>
  );
}
