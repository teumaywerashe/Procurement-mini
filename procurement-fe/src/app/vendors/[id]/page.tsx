"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import {
  IconArrowLeft,
  IconBuilding,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconAlertTriangle,
  IconHash,
} from "@tabler/icons-react";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: vendor, isLoading, isError } = useGetVendorQuery(Number(id));
  // console.log("vendor", vendor);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-(--text-subtle) text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <IconAlertTriangle size={36} className="text-red-400" />
          <p className="text-sm text-red-400">Vendor not found.</p>
          <Link
            href="/vendors"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  const details = [
    {
      icon: <IconHash size={15} className="text-(--text-faint)" />,
      label: "Vendor ID",
      value: `#${vendor.id}`,
    },
    {
      icon: <IconBuilding size={15} className="text-(--text-faint)" />,
      label: "Company",
      value: vendor.name,
    },
    {
      icon: <IconPhone size={15} className="text-(--text-faint)" />,
      label: "Phone",
      value: vendor.phoneNumber ?? "—",
    },
    {
      icon: <IconMapPin size={15} className="text-(--text-faint)" />,
      label: "Address",
      value: vendor.email ?? "—",
    },
    {
      icon: <IconCalendar size={15} className="text-(--text-faint)" />,
      label: "Registered",
      value: new Date(vendor.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex-1">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={15} />
          Back to vendors
        </Link>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-(--border) flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-950/60 flex items-center justify-center shrink-0">
              <IconBuilding size={26} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-(--text-primary)">{vendor.name}</h1>
              <p className="text-xs text-(--text-faint) mt-0.5">Vendor profile</p>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-(--border-subtle)">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-4 px-8 py-4">
                {d.icon}
                <span className="text-xs text-(--text-subtle) w-24 shrink-0">
                  {d.label}
                </span>
                <span className="text-sm text-(--text-muted)">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
