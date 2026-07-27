"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/layout/Navbar"
    // import React, { useEffect, useState, useCallback } from "react";
    // import Navbar from "../../components/layout/Navbar"

import Link from "next/link";
import {
  IconSearch,
  IconAdjustments,
  IconBookmark,
  IconThumbDown,
  IconClock,
  IconCurrencyDollar,
  IconCircleCheck,
  IconUser,
  IconShieldCheck,
  IconStar,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";

// npm install react-hook-form zod @hookform/resolvers
// npm install @reduxjs/toolkit react-redux
// npm install react-hook-form zod @hookform/resolvers

type TenderStatus = "draft" | "published" | "closed" | "awarded" | "cancelled";

interface Tender {
  id: number;
  title: string;
  name: string;
  description?: string;
  status: TenderStatus;
  closingDate: string;
  referenceNumber: string;
  estimatedValue: number;
  createdAt: string;
  createdBy: number;
}

const STATUS_COLORS: Record<TenderStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: "bg-green-900/40", text: "text-green-400", dot: "bg-green-400" },
  draft:     { bg: "bg-gray-800",      text: "text-gray-400",  dot: "bg-gray-400"  },
  closed:    { bg: "bg-red-900/40",    text: "text-red-400",   dot: "bg-red-400"   },
  awarded:   { bg: "bg-indigo-900/40", text: "text-indigo-400",dot: "bg-indigo-400"},
  cancelled: { bg: "bg-orange-900/40", text: "text-orange-400",dot: "bg-orange-400"},
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days} day${days > 1 ? "s" : ""} ago`;
}

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days}d left`;
}

function TenderCard({ tender }: { tender: Tender }) {
  const status = STATUS_COLORS[tender.status] ?? STATUS_COLORS.draft;
  const closing = daysLeft(tender.closingDate);
  const isUrgent = closing !== "Closed" && parseInt(closing) <= 3;

  return (
    <Link
      href={`/tender/${tender.id}`}
      className="block border-b border-[#2a2620] hover:bg-[#1c1a16] transition-colors px-6 py-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5 flex-wrap">
            <span>{timeAgo(tender.createdAt)}</span>
            <span>·</span>
            <span className={`flex items-center gap-1 font-medium ${isUrgent && closing !== "Closed" ? "text-orange-400" : "text-gray-400"}`}>
              <IconClock size={12} />
              {closing}
            </span>
            <span>·</span>
            <span className="text-gray-500">{tender.referenceNumber}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1.5 leading-snug">
            {tender.title}
          </h3>

          {/* Sub-info row */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5 flex-wrap">
            <span className="flex items-center gap-1">
              <IconCurrencyDollar size={12} />
              Est.{" "}
              <span className="font-medium text-gray-300">
                ${tender.estimatedValue.toLocaleString()}
              </span>
            </span>
            <span>·</span>
            <span className="capitalize">{tender.name}</span>
          </div>

          {/* Description */}
          {tender.description && (
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3">
              {tender.description}
            </p>
          )}

          {/* Status badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex flex-col items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-full hover:bg-[#2a2620] text-gray-500 hover:text-gray-300 transition-colors"
            title="Not interested"
          >
            <IconThumbDown size={16} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-full hover:bg-[#2a2620] text-gray-500 hover:text-red-400 transition-colors"
            title="Save"
          >
            <IconBookmark size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}

function ProfileSidebar() {
  return (
    <aside className="w-72 shrink-0 space-y-4">
      {/* Profile card */}
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            JD
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm leading-tight">John Doe</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">Vendor · Infrastructure</p>
          </div>
        </div>

        {/* Profile completion */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Profile completeness</span>
            <span className="text-xs font-semibold text-green-400">78%</span>
          </div>
          <div className="w-full bg-[#2a2620] rounded-full h-1.5">
            <div className="bg-green-400 h-1.5 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>

        <Link
          href="/profile"
          className="block w-full text-center text-xs font-medium border border-[#3a3630] text-gray-300 hover:text-white hover:border-gray-400 py-2 rounded-lg transition-colors"
        >
          View profile
        </Link>
      </div>

      {/* Verification */}
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <IconShieldCheck size={18} className="text-indigo-400" />
          <span className="text-sm font-semibold text-white">Identity verification</span>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Increase your bid visibility in search results and win more contracts.
        </p>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
          Get verified <IconChevronRight size={13} />
        </button>
      </div>

      {/* Bid tokens */}
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <IconStar size={16} className="text-yellow-400" />
            Bid Tokens
          </span>
          <IconChevronDown size={16} className="text-gray-500" />
        </div>
        <p className="text-3xl font-bold text-white mt-2 mb-3">12</p>
        <button className="w-full py-2 rounded-lg bg-[#9fef00] hover:bg-[#8cd900] text-[#14120e] text-xs font-bold transition-colors">
          Buy Tokens
        </button>
        <button className="w-full py-2 mt-2 text-xs text-gray-400 hover:text-gray-300 transition-colors">
          View details
        </button>
      </div>

      {/* Active bids */}
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <IconCircleCheck size={16} className="text-green-400" />
            My Bids
          </span>
          <span className="text-xs text-gray-500">3 active</span>
        </div>
        <div className="space-y-2">
          {["Road Construction – Phase 2", "IT Infrastructure Upgrade", "Office Supplies Q4"].map((bid, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-400 truncate mr-2">{bid}</span>
              <span className="shrink-0 text-green-400 font-medium">Pending</span>
            </div>
          ))}
        </div>
        <Link href="/bids" className="block mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          View all bids →
        </Link>
      </div>

      {/* Account stats */}
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <IconUser size={16} className="text-gray-400" />
          <span className="text-sm font-semibold text-white">Account stats</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Bids won", value: "4" },
            { label: "Win rate", value: "44%" },
            { label: "Avg. value", value: "$82K" },
            { label: "Member since", value: "2024" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

const TABS = ["Best matches", "Most recent", "Saved tenders"];
const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Closing soon", value: "closing" },
  { label: "Awarded", value: "awarded" },
];

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTenders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("title", search);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/tender/all${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tenders");
      const data: Tender[] = await res.json();
      setTenders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchTenders, 400);
    return () => clearTimeout(timer);
  }, [fetchTenders]);

  const now = new Date().getTime();
  const filtered = tenders.filter((t) => {
    if (!statusFilter) return true;
    if (statusFilter === "closing") {
      const days = Math.ceil(
        (new Date(t.closingDate).getTime() - now) / 86_400_000
      );
      return days >= 0 && days <= 7;
    }
    return t.status === statusFilter;
  });

  const sorted =
    activeTab === 1
      ? [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : filtered;

  return (
    <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
      <Navbar />

      {/* Banner */}
      <div className="bg-[#1c1a16] border-b border-[#2a2620] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-linear-to-r from-[#2a2620] to-[#1c1a16] rounded-xl p-6 flex items-center justify-between gap-6 border border-[#3a3630]">
            <div>
              <p className="text-xs font-semibold text-[#9fef00] uppercase tracking-widest mb-1">
                Vendor Plus
              </p>
              <h2 className="text-xl font-bold text-white mb-1">
                Priority access to new tenders
              </h2>
              <p className="text-sm text-gray-400">
                Get notified first and increase your bid visibility across all categories.
              </p>
            </div>
            <button className="shrink-0 px-5 py-2.5 border border-gray-500 hover:border-white text-sm font-medium text-white rounded-lg transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 flex gap-6 items-start">
        {/* Left — tender list */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="flex items-center bg-[#1c1a16] border border-[#2a2620] rounded-xl px-4 py-2.5 gap-3 mb-4">
            <IconSearch size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenders by title or keyword..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
            />
          </div>

          {/* Tabs + Filters */}
          <div className="flex items-center justify-between mb-1 gap-4">
            <div className="flex items-center gap-0 border-b border-[#2a2620] w-full">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === i
                      ? "border-white text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="ml-auto pb-1">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    showFilters
                      ? "border-indigo-500 text-indigo-400 bg-indigo-900/20"
                      : "border-[#2a2620] text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <IconAdjustments size={15} />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Status filter pills */}
          {showFilters && (
            <div className="flex items-center gap-2 flex-wrap py-3 px-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    statusFilter === f.value
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-[#3a3630] text-gray-400 hover:border-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Tender list */}
          <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden mt-3">
            {loading ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                Loading tenders...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-400 text-sm">{error}</div>
            ) : sorted.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                No tenders found
              </div>
            ) : (
              sorted.map((t) => <TenderCard key={t.id} tender={t} />)
            )}
          </div>

          {/* Count */}
          {!loading && sorted.length > 0 && (
            <p className="text-xs text-gray-600 mt-3 px-1">
              {sorted.length} tender{sorted.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Right — profile sidebar */}
        <ProfileSidebar />
      </div>
    </div>
  );
}
