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

interface Props {
  userId: number;
  isVendor: boolean;
}

export default function TenderBidsSidebar({ userId, isVendor }: Props) {
  // 1. Fetch vendor data if user is a vendor
  const { data: vendor } = useGetVendorQuery(userId, { skip: !isVendor });

  // 2. Fetch vendor-specific bids if user is a vendor
  const { data: bids = [], isLoading: isVendorLoading } =
    useGetBidsByVendorQuery(undefined, { skip: !isVendor || !vendor?.id });

  // 3. Fetch all bids if user is an admin
  const { data: allBids = [], isLoading: isAllBidsLoading } =
    useGetAllBidsQuery(undefined, { skip: isVendor });

  // 4. Determine which list to show based on role
  const displayBids = isVendor ? bids.slice(0, 5) : allBids.slice(0, 5);
  const totalCount = isVendor ? bids.length : allBids.length;
  const isLoading = isVendor ? isVendorLoading : isAllBidsLoading;

  return (
    <aside
      className="hidden fixed xl:flex right-0 flex-col shrink-0 border-l border-[#1e1c18] bg-[#0f0e0b] top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      style={{ width: "20%" }}
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <IconGavel size={15} className="text-indigo-400" />
            <p className="text-xs font-semibold text-white">
              {isVendor ? "My RecentBids" : "Recent Bids"}
            </p>
          </div>
          {totalCount > 0 && (
            <span className="text-[10px] font-semibold bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full tabular-nums">
              {totalCount}
            </span>
          )}
        </div>
        <div className="h-px bg-[#1e1c18]" />

        {/* Content Body */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-1.5 px-1">
                <div className="h-2.5 bg-[#1e1c18] rounded w-3/4" />
                <div className="h-2 bg-[#1e1c18] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayBids.length === 0 ? (
          <div className="px-1 py-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1e1c18] flex items-center justify-center mx-auto">
              <IconGavel size={18} className="text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500">No bids submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayBids.map((bid) => {
              const colors = BID_STATUS_STYLES[bid.bidStatus];
              return (
                <div
                  key={bid.id}
                  className="px-3 py-3 rounded-lg bg-[#161410] border border-[#1e1c18] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-600 font-medium">
                      Tender #{bid.tenderId}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors?.bg ?? "bg-zinc-800"} ${colors?.text ?? "text-zinc-400"}`}
                    >
                      {bid.bidStatus.charAt(0).toUpperCase() +
                        bid.bidStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    ${Number(bid.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-600">
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
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-[#2a2620] text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
        >
          {isVendor ? "My Bids" : "View all bids"} <IconArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
