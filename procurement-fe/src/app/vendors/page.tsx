"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import {
  IconSearch,
  IconUsers,
  IconBuilding,
  IconChevronRight,
  IconAlertTriangle,
} from "@tabler/icons-react";

export default function VendorsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "admin";
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && !isAdmin) router.push("/dashboard");
  }, [user, isAdmin, router]);

  const { data: vendors = [], isLoading, isError } = useGetVendorsQuery();

  const filtered = vendors.filter((v) =>
    search
      ? v.companyName.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-[#0f0e0b] text-white flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">Vendors</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isLoading ? "Loading..." : `${filtered.length} registered vendor${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-[#161410] border border-[#2a2620] rounded-lg px-3 py-2 gap-2 max-w-sm mb-6">
          <IconSearch size={14} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name..."
            className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none flex-1"
          />
        </div>

        {/* Vendor grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#1c1a16] border border-[#2a2620] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <IconAlertTriangle size={28} className="text-red-400" />
            <p className="text-sm text-red-400">Failed to load vendors.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1e1c18] flex items-center justify-center">
              <IconUsers size={22} className="text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-500">No vendors found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <Link
                key={v.id}
                href={`/vendors/${v.id}`}
                className="group bg-[#1c1a16] border border-[#2a2620] rounded-xl p-5 hover:border-[#3a3630] hover:bg-[#201e1a] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950/60 flex items-center justify-center shrink-0">
                    <IconBuilding size={18} className="text-indigo-400" />
                  </div>
                  <IconChevronRight
                    size={15}
                    className="text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5"
                  />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {v.companyName}
                </p>
                {v.contactPhone && (
                  <p className="text-xs text-zinc-600 mt-1">{v.contactPhone}</p>
                )}
                {v.address && (
                  <p className="text-xs text-zinc-600 mt-0.5 truncate">{v.address}</p>
                )}
                <p className="text-[11px] text-zinc-700 mt-2">
                  Since {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
