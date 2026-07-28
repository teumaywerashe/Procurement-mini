"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { useGetBidsByVendorQuery } from "@/src/store/api/bidApi";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import {
  IconFileText,
  IconUsers,
  IconGavel,
  IconClock,
  IconChevronRight,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-zinc-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";
  const now = React.useMemo(() => Date.now(), []);

  const { data: tenders = [], isLoading: tendersLoading } = useGetTendersQuery({});
  const { data: vendors = [], isLoading: vendorsLoading } = useGetVendorsQuery(undefined, { skip: !isAdmin });
  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, { skip: !isVendor });
  const { data: myBids = [], isLoading: bidsLoading } = useGetBidsByVendorQuery(vendor?.id ?? 0, {
    skip: !vendor?.id,
  });

  const published = tenders.filter((t) => t.status === "published");
  const closingSoon = tenders.filter((t) => {
    const d = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000);
    return d >= 0 && d <= 7 && t.status === "published";
  });
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingBids = myBids.filter((b) => b.status === "pending");
  const acceptedBids = myBids.filter((b) => b.status === "accepted");

  return (
    <div className="min-h-screen bg-[#0f0e0b] text-white flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] ?? "User"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1 capitalize">{user?.role} account</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<IconFileText size={18} className="text-indigo-400" />}
            label="Total Tenders"
            value={tendersLoading ? "—" : tenders.length}
            sub={`${published.length} active`}
            color="bg-indigo-950/60"
          />
          <StatCard
            icon={<IconClock size={18} className="text-orange-400" />}
            label="Closing Soon"
            value={tendersLoading ? "—" : closingSoon.length}
            sub="Within 7 days"
            color="bg-orange-950/60"
          />
          {isAdmin ? (
            <StatCard
              icon={<IconUsers size={18} className="text-emerald-400" />}
              label="Registered Vendors"
              value={vendorsLoading ? "—" : vendors.length}
              color="bg-emerald-950/60"
            />
          ) : (
            <StatCard
              icon={<IconGavel size={18} className="text-yellow-400" />}
              label="My Bids"
              value={bidsLoading ? "—" : myBids.length}
              sub={`${pendingBids.length} pending`}
              color="bg-yellow-950/60"
            />
          )}
          <StatCard
            icon={<IconTrendingUp size={18} className="text-purple-400" />}
            label={isAdmin ? "Awarded" : "Accepted Bids"}
            value={
              isAdmin
                ? tenders.filter((t) => t.status === "awarded").length
                : acceptedBids.length
            }
            color="bg-purple-950/60"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent tenders */}
          <div className="lg:col-span-2 bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recent Tenders</h2>
              <Link href="/tender" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <IconChevronRight size={13} />
              </Link>
            </div>
            <div>
              {tendersLoading ? (
                <div className="p-5 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-[#14120e] rounded animate-pulse" />
                  ))}
                </div>
              ) : recentTenders.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-600">No tenders yet.</div>
              ) : (
                recentTenders.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tender/${t.id}`}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                        {t.title}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">{t.referenceNumber}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                      t.status === "published" ? "bg-emerald-950/60 text-emerald-400"
                      : t.status === "awarded"  ? "bg-indigo-950/60 text-indigo-400"
                      : t.status === "closed"   ? "bg-red-950/60 text-red-400"
                      : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {t.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
            {isAdmin && (
              <div className="px-5 py-3 border-t border-[#2a2620]">
                <Link
                  href="/tender/create"
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <IconPlus size={13} /> Create new tender
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions / bids summary */}
          <div className="space-y-4">
            <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2a2620]">
                <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="p-3 space-y-1">
                <Link href="/tender" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#14120e] transition-colors group">
                  <IconFileText size={16} className="text-indigo-400 shrink-0" />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Browse tenders</span>
                </Link>
                {isVendor && (
                  <Link href="/bids/my" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#14120e] transition-colors group">
                    <IconGavel size={16} className="text-yellow-400 shrink-0" />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">My bids</span>
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link href="/tender/create" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#14120e] transition-colors group">
                      <IconPlus size={16} className="text-emerald-400 shrink-0" />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Create tender</span>
                    </Link>
                    <Link href="/tender/manage" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#14120e] transition-colors group">
                      <IconFileText size={16} className="text-orange-400 shrink-0" />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Manage tenders</span>
                    </Link>
                    <Link href="/vendors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#14120e] transition-colors group">
                      <IconUsers size={16} className="text-purple-400 shrink-0" />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Manage vendors</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Vendor: recent bids */}
            {isVendor && (
              <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">My Recent Bids</h2>
                  <Link href="/bids/my" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View all <IconChevronRight size={13} />
                  </Link>
                </div>
                <div>
                  {bidsLoading ? (
                    <div className="p-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-8 bg-[#14120e] rounded animate-pulse" />
                      ))}
                    </div>
                  ) : myBids.length === 0 ? (
                    <div className="px-5 py-6 text-center text-xs text-zinc-600">No bids submitted yet.</div>
                  ) : (
                    myBids.slice(0, 3).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between px-5 py-3 border-b border-[#1e1c18]">
                        <div>
                          <p className="text-xs font-medium text-white">Tender #{bid.tenderId}</p>
                          <p className="text-[11px] text-zinc-600">${Number(bid.amount).toLocaleString()}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          bid.status === "accepted" ? "bg-emerald-950/60 text-emerald-400"
                          : bid.status === "rejected" ? "bg-red-950/60 text-red-400"
                          : "bg-yellow-950/60 text-yellow-400"
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
