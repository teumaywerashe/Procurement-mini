"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { IconSearch } from "@tabler/icons-react";
import { EntityTable } from "@/src/components/shared/EntityTable";
import { useCollectionQuery } from "@/src/hooks/useCollectionQuery";
import type { Vendor } from "@/src/types";
import type { DataTableColumn } from "mantine-datatable";
import {
  VendorLeftSidebar,
  VendorRightSidebar,
} from "@/src/components/vendors/VendorSidebars";

const COLUMNS: DataTableColumn<Vendor>[] = [
  {
    accessor: "name",
    title: "Company",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-(--text-primary)">{v.name}</span>
    ),
  },
  { accessor: "email", title: "Email", sortable: true },
  { accessor: "registrationNumber", title: "Reg. No." },
  {
    accessor: "phoneNumber",
    title: "Phone",
    render: (v) => v.phoneNumber ?? "—",
  },
  { accessor: "bids", title: "Bids", render: (v) => v.bids?.length ?? 0 },
  {
    accessor: "createdAt",
    title: "Joined",
    sortable: true,
    render: (v) =>
      new Date(v.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];

export default function VendorsPage() {
  return (
    <Suspense>
      <VendorsContent />
    </Suspense>
  );
}

function VendorsContent() {
  const router = useRouter();
  const { query, setQuery } = useCollectionQuery({
    defaultSortBy: "createdAt",
  });
  const { data: result, isLoading, isError } = useGetVendorsQuery(query);
  const vendors = result?.data ?? [];

  return (
    <div className="h-screen bg-(--bg-base) text-(--text-primary) flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <VendorLeftSidebar
          vendors={vendors}
          sortBy={query.sortDir === "asc" ? "oldest" : "newest"}
          search={query.q ?? ""}
          onSortChange={(s) =>
            setQuery({ sortDir: s === "oldest" ? "asc" : "desc" })
          }
          onSearchChange={(q) => setQuery({ q })}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="sticky top-0 z-30 bg-(--bg-base) border-b border-(--border) px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-sm font-semibold text-(--text-primary)">
                Vendors
              </h1>
              <p className="text-xs text-(--text-faint) mt-0.5">
                {isLoading
                  ? "Loading..."
                  : `${result?.total ?? 0} registered vendor${result?.total !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 gap-2">
              <IconSearch size={14} className="text-(--text-faint) shrink-0" />
              <input
                type="text"
                value={query.q ?? ""}
                onChange={(e) => setQuery({ q: e.target.value || undefined })}
                placeholder="Search by company or email..."
                className="bg-transparent text-sm text-(--text-primary) placeholder-(--text-faint) outline-none w-44 sm:w-56"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
            {isError ? (
              <p className="text-sm text-red-400 py-8 text-center">
                Failed to load vendors.
              </p>
            ) : (
              <EntityTable<Vendor>
                result={result}
                isLoading={isLoading}
                columns={COLUMNS}
                query={query}
                onQueryChange={setQuery}
                onRowClick={(v) => router.push(`/vendors/${v.id}`)}
              />
            )}
          </div>
        </main>

        <VendorRightSidebar vendors={vendors} isLoading={isLoading} />
      </div>
    </div>
  );
}
