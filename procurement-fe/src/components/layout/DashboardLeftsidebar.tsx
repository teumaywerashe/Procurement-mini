/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  IconFileText,
  IconGavel,
  IconLayoutDashboard,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

function DashboardLeftSidebar({
  tendersLoading,
  tenders,
  closingSoon,
  isAdmin,
  isVendor,
  bidsLoading,
  myBids,
  vendorsLoading,
  vendors,
  published,
}: {
  tendersLoading: boolean;
  tenders: any[];
  closingSoon: any[];
  isAdmin: boolean;
  isVendor: boolean;
  bidsLoading: boolean;
  myBids: any[];
  vendorsLoading: boolean;
  vendors: any[];
  published: any[];
}) {
  const quickLinks = [
    {
      href: "/tenders",
      icon: <IconFileText size={15} />,
      label: "Browse tenders",
      color: "text-indigo-400",
      always: true,
    },
    {
      href: "/bids/my",
      icon: <IconGavel size={15} />,
      label: "My bids",
      color: "text-yellow-400",
      always: false,
      vendorOnly: true,
    },
    {
      href: "/tender/create",
      icon: <IconPlus size={15} />,
      label: "Create tender",
      color: "text-emerald-400",
      always: false,
      adminOnly: true,
    },
    {
      href: "/tender/manage",
      icon: <IconFileText size={15} />,
      label: "Manage tenders",
      color: "text-orange-400",
      always: false,
      adminOnly: true,
    },
    {
      href: "/vendors",
      icon: <IconUsers size={15} />,
      label: "Manage vendors",
      color: "text-purple-400",
      always: false,
      adminOnly: true,
    },
  ].filter(
    (l) => l.always || (l.adminOnly && isAdmin) || (l.vendorOnly && isVendor),
  );
  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-r border-(--border) bg-(--bg-base) sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      style={{ width: "20%" }}
    >
      <div className="p-4 space-y-6">
        {/* Overview stats */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider px-2 mb-2">
            Overview
          </p>
          {[
            {
              label: "Total tenders",
              value: tendersLoading ? "—" : tenders.length,
            },
            {
              label: "Active",
              value: tendersLoading ? "—" : published.length,
            },
            {
              label: "Closing soon",
              value: tendersLoading ? "—" : closingSoon.length,
            },
            ...(isAdmin
              ? [
                  {
                    label: "Vendors",
                    value: vendorsLoading ? "—" : vendors.length,
                  },
                ]
              : []),
            ...(isVendor
              ? [
                  {
                    label: "My bids",
                    value: bidsLoading ? "—" : myBids.length,
                  },
                ]
              : []),
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between px-2 py-1.5"
            >
              <span className="text-xs text-(--text-subtle)">{s.label}</span>
              <span className="text-xs font-semibold text-(--text-primary) tabular-nums">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-(--border)" />

        {/* Quick Actions nav */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-2">
            <IconLayoutDashboard size={12} className="text-(--text-faint)" />
            <p className="text-[10px] font-semibold text-(--text-faint) uppercase tracking-wider">
              Quick Actions
            </p>
          </div>
          <nav className="space-y-0.5">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-xs text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className={l.color}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default DashboardLeftSidebar;
