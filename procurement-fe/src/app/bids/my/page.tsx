"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { Bid } from "@/src/types";
import {
  IconGavel,
  IconFileText,
  IconAlertTriangle,
} from "@tabler/icons-react";
import SidebarCategoryFilter from "@/src/components/shared/SidebarCategoryFilter";
import BidStatsRow from "@/src/components/bids/BidStatsRow";
import BidTableRow from "@/src/components/bids/BidTableRow";
import MyBidsRightSidebar from "@/src/components/bids/MyBidsRightSidebar";

export default function MyBidsPage() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isVendor = user?.role === "Vendor";

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bid["bidStatus"] | "">("");

  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, {
    skip: !isVendor,
  });
  const {
    data: bids = [],
    isLoading,
    isError,
  } = useGetBidsByVendorQuery(undefined, { skip: !vendor?.id });
  const { data: tenders = [] } = useGetTendersQuery({});

  const tenderMap = React.useMemo(() => {
    const m: Record<number, (typeof tenders)[0]> = {};
    tenders.forEach((t) => {
      m[t.id] = t;
    });
    return m;
  }, [tenders]);

  const filtered = bids.filter((b) => {
    const tender = tenderMap[b.tenderId];
    const matchCat = categoryFilter
      ? tender?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchStatus = statusFilter ? b.bidStatus === statusFilter : true;
    return matchCat && matchStatus;
  });

  const pending = bids.filter((b) => b.bidStatus === "pending").length;
  const accepted = bids.filter((b) => b.bidStatus === "accepted").length;
  const rejected = bids.filter((b) => b.bidStatus === "rejected").length;

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <SidebarCategoryFilter
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            <div className="mb-5">
              <h1 className="text-lg font-bold text-(--text-primary)]">
                {isVendor ? "My Bids" : "Bids"}
              </h1>
              <p className="text-xs text-(--text-subtle) mt-0.5">
                Track the status of your submitted bids
              </p>
            </div>

            {!isLoading && bids.length > 0 && (
              <BidStatsRow
                total={bids.length}
                pending={pending}
                accepted={accepted}
                rejected={rejected}
              />
            )}

            <div className="bg-(--bg-surface) border border-(--border) rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_130px_160px_120px] gap-4 px-5 py-3 border-b border-(--border) text-[11px] font-semibold text-(--text-faint) uppercase tracking-wider">
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
                      className="h-14 bg-(--bg-elevated) rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <IconAlertTriangle size={28} className="text-red-400" />
                  <p className="text-sm text-red-400">Failed to load bids.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-full bg-(--bg-elevated) flex items-center justify-center">
                    <IconGavel size={22} className="text-(--text-faint)]" />
                  </div>
                  <p className="text-sm text-(--text-subtle)]">
                    {bids.length === 0
                      ? "You haven't submitted any bids yet."
                      : "No bids match the filter."}
                  </p>
                  {bids.length === 0 && (
                    <Link
                      href="/tender"
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
                    >
                      <IconFileText size={13} /> Browse tenders
                    </Link>
                  )}
                </div>
              ) : (
                filtered.map((bid) => (
                  <BidTableRow
                    key={bid.id}
                    bid={bid}
                    tender={tenderMap[bid.tenderId]}
                  />
                ))
              )}
            </div>
          </div>
        </main>

        <MyBidsRightSidebar bids={bids} isLoading={isLoading} />
      </div>
    </div>
  );
}
