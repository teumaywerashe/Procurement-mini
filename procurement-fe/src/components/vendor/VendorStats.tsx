"use client";
import React from "react";
import {
  IconFileText,
  IconClock,
  IconX,
  IconGavel,
  IconTrendingUp,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import LoadingSpan from "@/src/utilis/LoadingSpan";

interface VendorStatsProps {
  tendersLoading: boolean;
  bidsLoading: boolean;
  publishedTendersCount: number;
  myBidsCount: number;
  acceptedBidsCount: number;
  pendingBidsCount: number;
  rejectedBidsCount: number;
}

export default function VendorStats({
  tendersLoading,
  bidsLoading,
  publishedTendersCount,
  myBidsCount,
  acceptedBidsCount,
  pendingBidsCount,
  rejectedBidsCount,
}: VendorStatsProps) {
  const loadingSpan = (
    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
  );
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatusCard
        icon={<IconFileText size={20} className="text-emerald-400" />}
        label="Available Tenders"
        value={tendersLoading ? <LoadingSpan /> : publishedTendersCount}
        sub="Open for bidding"
        color="bg-emerald-950/60"
      />
      <StatusCard
        icon={<IconGavel size={20} className="text-indigo-400" />}
        label="My Submitted Bids"
        value={bidsLoading ? <LoadingSpan /> : myBidsCount}
        sub="Total bids placed"
        color="bg-indigo-950/60"
      />
      <StatusCard
        icon={<IconTrendingUp size={20} className="text-emerald-400" />}
        label="Accepted / Won Bids"
        value={bidsLoading ? <LoadingSpan /> : acceptedBidsCount}
        sub="Successful bids"
        color="bg-emerald-950/60"
      />
      <StatusCard
        icon={<IconClock size={20} className="text-amber-400" />}
        label="Pending Review"
        value={bidsLoading ? <LoadingSpan /> : pendingBidsCount}
        sub="Awaiting admin evaluation"
        color="bg-amber-950/60"
      />
      <StatusCard
        icon={<IconX size={20} className="text-red-400" />}
        label="Rejected Bids"
        value={bidsLoading ? <LoadingSpan /> : rejectedBidsCount}
        sub="Bids that were not accepted"
        color="bg-red-950/60"
      />
    </div>
  );
}
