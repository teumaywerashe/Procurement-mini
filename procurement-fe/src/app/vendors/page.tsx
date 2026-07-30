"use client";

import React, {  useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { IconSearch, IconUsers, IconAlertTriangle } from "@tabler/icons-react";
import VendorCard from "@/src/components/vendors/VendorCard";
import { VendorLeftSidebar, VendorRightSidebar } from "@/src/components/vendors/VendorSidebars";

export default function VendorsPage() {
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState<"name" | "newest" | "oldest">("newest");

  

  const { data: vendors = [], isLoading, isError } = useGetVendorsQuery();
  console.log("vendors", vendors);

  const filtered = vendors
    .filter((v) => search ? (v.name ?? "").toLowerCase().includes(search.toLowerCase()) : true)
    .sort((a, b) => {
      if (sortBy === "name")   return (a.name ?? "").localeCompare(b.name ?? "");
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <VendorLeftSidebar vendors={vendors} sortBy={sortBy} search={search} onSortChange={setSortBy} onSearchChange={setSearch} />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-(--text-primary)">Vendors</h1>
                <p className="text-xs text-(--text-subtle) mt-0.5">
                  {isLoading ? "Loading..." : `${filtered.length} registered vendor${filtered.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 gap-2">
                <IconSearch size={14} className="text-(--text-faint) shrink-0" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company..."
                  className="bg-transparent text-sm text-(--text-primary) placeholder-(--text-faint) outline-none w-36 sm:w-44" />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-(--bg-surface) border border-(--border) rounded-xl animate-pulse" />)}</div>
            ) : isError ? (
              <div className="flex flex-col items-center py-16 gap-3"><IconAlertTriangle size={28} className="text-red-400" /><p className="text-sm text-red-400">Failed to load vendors.</p></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <div className="w-12 h-12 rounded-full bg-(--bg-elevated) flex items-center justify-center"><IconUsers size={22} className="text-(--text-faint)" /></div>
                <p className="text-sm text-(--text-subtle)">No vendors found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((v) => <VendorCard key={v.id} v={v} />)}
              </div>
            )}
          </div>
        </main>

        <VendorRightSidebar vendors={vendors} isLoading={isLoading} />
      </div>
    </div>
  );
}
