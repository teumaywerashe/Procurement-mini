import React from "react";
import { Vendor } from "@/src/types";
import { IconSearch, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

interface VendorsTableProps {
  vendors: Vendor[];
  vendorsLoading: boolean;
  vendorSearch: string;
  setVendorSearch: (search: string) => void;
}

export function VendorsTable({
  vendors,
  vendorsLoading,
  vendorSearch,
  setVendorSearch,
}: VendorsTableProps) {
  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      (v.email && v.email.toLowerCase().includes(vendorSearch.toLowerCase())),
  );

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-(--text-primary)">
            Registered Vendors
          </h2>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            Overview of all vendor companies registered on ProcureHub
          </p>
        </div>
        <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
          <IconSearch size={16} className="text-(--text-faint) shrink-0" />
          <input
            type="text"
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            placeholder="Search vendor company..."
            className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
          />
        </div>
      </div>

      {vendorsLoading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="p-12 text-center text-sm text-(--text-subtle)">
          No vendors found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-(--text-primary)">
            <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
              <tr>
                <th className="px-6 py-3.5">Company Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Registration No.</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Bids Count</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {filteredVendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-(--bg-elevated) transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-indigo-400">
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 text-(--text-subtle)">
                    {vendor.email || "—"}
                  </td>
                  <td className="px-6 py-4 font-mono text-(--text-faint)">
                    {vendor.registrationNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-(--text-subtle)">
                    {vendor.phoneNumber || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-yellow-950/80 text-yellow-400">
                      {vendor.bids?.length ?? 0} Bids
                    </span>
                  </td>
                  <td className="px-6 py-4 text-(--text-faint)">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/vendors`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      View Detail <IconChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendorsTable;
