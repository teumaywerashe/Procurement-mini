"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetVendorQuery } from "@/src/store/api/vendorApi";
import {
  IconArrowLeft,
  IconBuilding,
  IconPhone,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import ProfileCard from "@/src/components/profile/ProfileCard";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-(--text-faint) mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] text-(--text-faint) uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm text-(--text-primary)">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isVendor = user?.role === "Vendor";
  const { data: vendor } = useGetVendorQuery(user?.id ?? 0, {
    skip: !isVendor,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 mt-14 flex-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={16} /> Back to dashboard
        </Link>

        <ProfileCard user={user} />

        {isVendor && vendor && (
          <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
            <div className="px-8 py-4 border-b border-(--border)">
              <h2 className="text-sm font-semibold text-(--text-primary)">
                Company Information
              </h2>
            </div>
            <div className="px-8 py-6 space-y-4">
              <InfoRow
                icon={<IconBuilding size={15} />}
                label="Company name"
                value={vendor.companyName}
              />
              {vendor.contactPhone && (
                <InfoRow
                  icon={<IconPhone size={15} />}
                  label="Phone"
                  value={vendor.contactPhone}
                />
              )}
              {vendor.address && (
                <InfoRow
                  icon={<IconMapPin size={15} />}
                  label="Address"
                  value={vendor.address}
                />
              )}
              <InfoRow
                icon={<IconCalendar size={15} />}
                label="Registered"
                value={new Date(vendor.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
