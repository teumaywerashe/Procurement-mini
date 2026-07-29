import React from "react";
import Link from "next/link";
import {
  IconFileText,
  IconUsers,
  IconGavel,
  IconClock,
  IconChevronRight,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";

interface MainDashboardContentProps {
  user: { name?: string; role?: string } | null;
  isAdmin: boolean;
  isVendor: boolean;
  tenders: any[];
  tendersLoading: boolean;
  published: any[];
  closingSoon: any[];
  recentTenders: any[];
  vendors: any[];
  vendorsLoading: boolean;
  myBids: any[];
  bidsLoading: boolean;
  pendingBids: any[];
  acceptedBids: any[];
}

function MainDashboardContent({
  user,
  isAdmin,
  isVendor,
  tenders,
  tendersLoading,
  published,
  closingSoon,
  recentTenders,
  vendors,
  vendorsLoading,
  myBids,
  bidsLoading,
  pendingBids,
  acceptedBids,
}: MainDashboardContentProps) {
  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] ?? "User"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1 capitalize">
            {user?.role} account
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatusCard
            icon={<IconFileText size={18} className="text-indigo-400" />}
            label="Total Tenders"
            value={tendersLoading ? "—" : tenders.length}
            sub={`${published.length} active`}
            color="bg-indigo-950/60"
          />
          <StatusCard
            icon={<IconClock size={18} className="text-orange-400" />}
            label="Closing Soon"
            value={tendersLoading ? "—" : closingSoon.length}
            sub="Within 7 days"
            color="bg-orange-950/60"
          />
          {isAdmin ? (
            <StatusCard
              icon={<IconUsers size={18} className="text-emerald-400" />}
              label="Registered Vendors"
              value={vendorsLoading ? "—" : vendors.length}
              color="bg-emerald-950/60"
            />
          ) : (
            <StatusCard
              icon={<IconGavel size={18} className="text-yellow-400" />}
              label="My Bids"
              value={bidsLoading ? "—" : myBids.length}
              sub={`${pendingBids.length} pending`}
              color="bg-yellow-950/60"
            />
          )}
          <StatusCard
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

        {/* Recent tenders */}
        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Tenders</h2>
            <Link
              href="/tender"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <IconChevronRight size={13} />
            </Link>
          </div>
          <div>
            {tendersLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-[#14120e] rounded animate-pulse"
                  />
                ))}
              </div>
            ) : recentTenders.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-600">
                No tenders yet.
              </div>
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
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {t.referenceNumber}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                      t.status === "published"
                        ? "bg-emerald-950/60 text-emerald-400"
                        : t.status === "awarded"
                          ? "bg-indigo-950/60 text-indigo-400"
                          : t.status === "closed"
                            ? "bg-red-950/60 text-red-400"
                            : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
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

        {/* Vendor: recent bids */}
        {isVendor && (
          <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#2a2620] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                My Recent Bids
              </h2>
              <Link
                href="/bids/my"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <IconChevronRight size={13} />
              </Link>
            </div>
            <div>
              {bidsLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-[#14120e] rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : myBids.length === 0 ? (
                <div className="px-5 py-6 text-center text-xs text-zinc-600">
                  No bids submitted yet.
                </div>
              ) : (
                myBids.slice(0, 3).map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between px-5 py-3 border-b border-[#1e1c18]"
                  >
                    <div>
                      <p className="text-xs font-medium text-white">
                        Tender #{bid.tenderId}
                      </p>
                      <p className="text-[11px] text-zinc-600">
                        ${Number(bid.amount).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        bid.bidStatus === "accepted"
                          ? "bg-emerald-950/60 text-emerald-400"
                          : bid.bidStatus === "rejected"
                            ? "bg-red-950/60 text-red-400"
                            : "bg-yellow-950/60 text-yellow-400"
                      }`}
                    >
                      {bid.bidStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MainDashboardContent;
