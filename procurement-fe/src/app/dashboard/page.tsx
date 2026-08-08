"use client";

import React from "react";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import {
  useGetVendorsQuery,
  useGetMyVendorQuery,
} from "@/src/store/api/vendorApi";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";

import DashboardLeftSidebar from "@/src/components/layout/DashboardLeftsidebar";
import MainDashboardContent from "@/src/components/layout/MainDashboardContent";
import DashboardRightSidebar from "@/src/components/layout/DashboardRightSidebar";
import SuperAdminDashboard from "@/src/components/superadmin/SuperAdminDashboard";
import AdminDashboard from "@/src/components/admin/AdminDashboard";

const now = Date.now();

export default function DashboardPage() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const isSuperAdmin = user?.role === "SuperAdmin";

  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery(
    { limit: 100 },
  );
  const tenders = tendersResult?.data ?? [];
  const { data: vendorsResult, isLoading: vendorsLoading } = useGetVendorsQuery(
    { limit: 100 },
    { skip: !isSuperAdmin },
  );
  const vendors = vendorsResult?.data ?? [];
  const { data: vendor } = useGetMyVendorQuery(undefined, {
    skip: !isVendor,
  });
  const { data: myBids = [], isLoading: bidsLoading } = useGetBidsByVendorQuery(
    undefined,
    { skip: !isVendor },
  );
  const published = tenders.filter((t) => t.status === "published");

  const closingSoon = tenders.filter((t) => {
    const d = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000);
    return d >= 0 && d <= 7 && t.status === "published";
  });
  const recentTenders = [...tenders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 7);

  const pendingBids = myBids.filter((b) => b.bidStatus === "pending");
  const acceptedBids = myBids.filter((b) => b.bidStatus === "accepted");

  if (isSuperAdmin) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full overflow-hidden">
          <SuperAdminDashboard currentUser={user} />
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full overflow-hidden">
          <AdminDashboard currentUser={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar ── */}

        <DashboardLeftSidebar
          tendersLoading={tendersLoading}
          tenders={tenders}
          isVendor={isVendor}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          closingSoon={closingSoon}
          bidsLoading={bidsLoading}
          myBids={myBids}
          vendorsLoading={vendorsLoading}
          vendors={vendors}
          published={published}
        />
        {/* ── Main content ── */}

        <MainDashboardContent
          user={user}
          isAdmin={isAdmin}
          isVendor={isVendor}
          isSuperAdmin={isSuperAdmin}
          tenders={tenders}
          tendersLoading={tendersLoading}
          published={published}
          closingSoon={closingSoon}
          recentTenders={recentTenders}
          vendors={vendors}
          vendorsLoading={vendorsLoading}
          myBids={myBids}
          bidsLoading={bidsLoading}
          pendingBids={pendingBids}
          acceptedBids={acceptedBids}
        />

        {/* ── Right sidebar: Tender stats ── */}
        <DashboardRightSidebar
          tenders={tenders}
          tendersLoading={tendersLoading}
          published={published}
          closingSoon={closingSoon}
          isVendor={isVendor}
          myBids={myBids}
        />
      </div>
    </div>
  );
}
