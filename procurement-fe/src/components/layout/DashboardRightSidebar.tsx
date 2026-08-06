import React from "react";
import Link from "next/link";
import { IconTrendingUp } from "@tabler/icons-react";
import type { Bid, Tender } from "@/src/types";

interface Props {
  tenders: Tender[];
  tendersLoading: boolean;
  published: Tender[];
  closingSoon: Tender[];
  isVendor: boolean;
  myBids: Bid[];
}

function DashboardRightSidebar({
  tenders,
  tendersLoading,
  published,
  closingSoon,
  isVendor,
  myBids,
}: Props) {
  return (
    <aside
      className="hidden xl:flex flex-col shrink-0 border-l border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      style={{ width: "20%" }}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <IconTrendingUp size={14} className="text-indigo-400" />
          <p className="text-xs font-semibold text-(--text-primary)">
            Tender Overview
          </p>
        </div>

        <div className="h-px bg-(--border)" />

        {tendersLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-(--bg-elevated) rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[
              {
                label: "Total tenders",
                value: tenders.length,
                color: "text-(--text-primary)",
              },
              {
                label: "Published",
                value: published.length,
                color: "text-emerald-400",
              },
              {
                label: "Closing soon",
                value: closingSoon.length,
                color: "text-orange-400",
              },
              {
                label: "Awarded",
                value: tenders.filter((t) => t.status === "awarded").length,
                color: "text-indigo-400",
              },
              {
                label: "Closed",
                value: tenders.filter((t) => t.status === "closed").length,
                color: "text-red-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-(--bg-surface) border border-(--border)"
              >
                <span className="text-xs text-(--text-subtle)">
                  {stat.label}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums ${stat.color}`}
                >
                  {stat.value}
                </span>
              </div>
            ))}

            {tenders.length > 0 && (
              <div className="px-3 py-3 rounded-lg bg-(--bg-surface) border border-(--border)">
                <p className="text-[10px] text-(--text-faint) mb-2">
                  Distribution
                </p>
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                  {published.length > 0 && (
                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${(published.length / tenders.length) * 100}%`,
                      }}
                    />
                  )}
                  {tenders.filter((t) => t.status === "draft").length > 0 && (
                    <div
                      className="bg-zinc-500"
                      style={{
                        width: `${(tenders.filter((t) => t.status === "draft").length / tenders.length) * 100}%`,
                      }}
                    />
                  )}
                  {tenders.filter((t) => t.status === "awarded").length > 0 && (
                    <div
                      className="bg-indigo-500"
                      style={{
                        width: `${(tenders.filter((t) => t.status === "awarded").length / tenders.length) * 100}%`,
                      }}
                    />
                  )}
                  {tenders.filter((t) => t.status === "closed").length > 0 && (
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${(tenders.filter((t) => t.status === "closed").length / tenders.length) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  {[
                    { label: "Published", color: "bg-emerald-500" },
                    { label: "Draft", color: "bg-zinc-500" },
                    { label: "Awarded", color: "bg-indigo-500" },
                    { label: "Closed", color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.color}`}
                      />
                      <span className="text-[10px] text-(--text-faint)">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isVendor && (
              <>
                <div className="h-px bg-(--border)" />
                <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider px-1">
                  My Bids
                </p>
                {[
                  {
                    label: "Total bids",
                    value: myBids.length,
                    color: "text-(--text-primary)",
                  },
                  {
                    label: "Pending",
                    value: myBids.filter((b) => b.bidStatus === "pending")
                      .length,
                    color: "text-yellow-400",
                  },
                  {
                    label: "Accepted",
                    value: myBids.filter((b) => b.bidStatus === "accepted")
                      .length,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Rejected",
                    value: myBids.filter((b) => b.bidStatus === "rejected")
                      .length,
                    color: "text-red-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-(--bg-surface) border border-(--border)"
                  >
                    <span className="text-xs text-(--text-subtle)">
                      {stat.label}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <Link
          href="/tenders"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-(--border) text-xs font-medium text-(--text-subtle) hover:text-(--text-primary) hover:border-(--border-strong) transition-colors"
        >
          Browse tenders
        </Link>
      </div>
    </aside>
  );
}

export default DashboardRightSidebar;
