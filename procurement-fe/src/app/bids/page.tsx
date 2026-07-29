"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import type { Bid } from "@/src/types";
import {
  IconGavel,
  IconCurrencyDollar,
  IconClock,
  IconAlertTriangle,
  IconFileText,
} from "@tabler/icons-react";

const BID_STATUS: Record<
  Bid["status"],
  { bg: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-yellow-950/60",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  accepted: {
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  rejected: { bg: "bg-red-950/60", text: "text-red-400", dot: "bg-red-400" },
};

export default function MyBidsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isVendor = user?.role === "vendor";

  // useEffect(() => {
  //   if (user && !isVendor) router.push("/dashboard");
  // }, [user, isVendor, router]);

  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, {
    skip: !isVendor,
  });
  const {
    data: bids = [],
    isLoading,
    isError,
  } = useGetBidsByVendorQuery(vendor?.id ?? 0, {
    skip: !vendor?.id,
  });

  const pending = bids.filter((b) => b.status === "pending").length;
  const accepted = bids.filter((b) => b.status === "accepted").length;
  const rejected = bids.filter((b) => b.status === "rejected").length;

  return (
    <div className="min-h-screen bg-[#0f0e0b] text-white flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-white">My Bids</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track the status of your submitted bids
          </p>
        </div>

        {/* Summary pills */}
        {!isLoading && bids.length > 0 && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1a16] border border-[#2a2620] rounded-lg">
              <span className="text-xs text-zinc-500">Total</span>
              <span className="text-xs font-bold text-white tabular-nums">
                {bids.length}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-950/30 border border-yellow-800/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">
                {pending} pending
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-800/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">
                {accepted} accepted
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-800/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs text-red-400 font-medium">
                {rejected} rejected
              </span>
            </div>
          </div>
        )}

        {/* Bid list */}
        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-3 border-b border-[#2a2620] text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
            <span>Tender</span>
            <span>Amount</span>
            <span>Submitted</span>
            <span>Status</span>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-[#14120e] rounded animate-pulse"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <IconAlertTriangle size={28} className="text-red-400" />
              <p className="text-sm text-red-400">Failed to load bids.</p>
            </div>
          ) : bids.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1e1c18] flex items-center justify-center">
                <IconGavel size={22} className="text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-500">
                You haven&apos;t submitted any bids yet.
              </p>
              <Link
                href="/tender"
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
              >
                <IconFileText size={13} />
                Browse tenders
              </Link>
            </div>
          ) : (
            bids.map((bid) => {
              const s = BID_STATUS[bid.status];
              return (
                <div
                  key={bid.id}
                  className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-4 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors items-center"
                >
                  <Link
                    href={`/tender/${bid.tenderId}`}
                    className="group min-w-0"
                  >
                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                      Tender #{bid.tenderId}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      Bid #{bid.id}
                    </p>
                  </Link>
                  <span className="flex items-center gap-1 text-sm font-semibold text-zinc-300">
                    <IconCurrencyDollar size={13} className="text-zinc-600" />
                    {Number(bid.amount).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <IconClock size={12} className="text-zinc-600" />
                    {new Date(bid.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
