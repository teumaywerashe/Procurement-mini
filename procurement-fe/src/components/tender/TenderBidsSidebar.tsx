"use client";
import React from "react";
import Link from "next/link";
import { IconGavel, IconArrowRight } from "@tabler/icons-react";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import {
  useGetAllBidsQuery,
  useGetBidsByVendorQuery,
} from "@/src/store/api/bidApi";
import { BID_STATUS_STYLES } from "@/src/components/shared/constants";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
  isVendor: boolean;
}

export default function TenderBidsSidebar({ userId, isVendor }: Props) {
  const { data: vendor } = useGetVendorQuery(userId, { skip: !isVendor });

  const { data: bids = [], isLoading: isVendorLoading } =
    useGetBidsByVendorQuery(undefined, { skip: !isVendor || !vendor?.id });

  const route = useRouter();
  const { data: allBids = [], isLoading: isAllBidsLoading } =
    useGetAllBidsQuery(undefined, { skip: isVendor });
  console.log(bids);

  const displayBids = isVendor ? bids.slice(0, 5) : allBids.slice(0, 5);
  const totalCount = isVendor ? bids.length : allBids.length;
  const isLoading = isVendor ? isVendorLoading : isAllBidsLoading;

  return (
    <aside
      className="hidden xl:flex flex-col shrink-0 border-l border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      style={{ width: "20%" }}
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <IconGavel size={15} className="text-indigo-400" />
            <p className="text-xs font-semibold text-(--text-primary)">
              {isVendor ? "My Recent Bids" : "Recent Bids"}
            </p>
          </div>
          {totalCount > 0 && (
            <span className="text-[10px] font-semibold bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full tabular-nums">
              {totalCount}
            </span>
          )}
        </div>
        <div className="h-px bg-(--border)" />

        {/* Content Body */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-1.5 px-1">
                <div className="h-2.5 bg-(--bg-elevated) rounded w-3/4" />
                <div className="h-2 bg-(--bg-elevated) rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayBids.length === 0 ? (
          <div className="px-1 py-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-(--bg-elevated) flex items-center justify-center mx-auto">
              <IconGavel size={18} className="text-(--text-faint)" />
            </div>
            <p className="text-xs text-(--text-subtle)">
              No bids submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayBids.map((bid) => {
              const colors = BID_STATUS_STYLES[bid.bidStatus];
              return (
                <div
                  onClick={() => {
                    route.push(`/bids/${bid.id}`);
                  }}
                  key={bid.id}
                  className="px-3 py-3 cursor-pointer rounded-lg bg-(--bg-elevated) border border-(--border) space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-(--text-faint) font-medium truncate">
                      {bid.tender?.title ?? `Tender #${bid.tenderId}`}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors?.bg ?? "bg-zinc-800"} ${colors?.text ?? "text-zinc-400"}`}
                    >
                      {bid.bidStatus.charAt(0).toUpperCase() +
                        bid.bidStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-(--text-primary)">
                    ${Number(bid.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-(--text-faint)">
                    {new Date(bid.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Link */}
        <Link
          href={isVendor ? "/bids/my" : "/bids"}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-(--border) text-xs font-medium text-(--text-subtle) hover:text-(--text-primary) hover:border-(--border-strong) transition-colors"
        >
          {isVendor ? "My Bids" : "View all bids"} <IconArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
