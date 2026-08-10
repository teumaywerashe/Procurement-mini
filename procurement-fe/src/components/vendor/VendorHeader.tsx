"use client";

import React from "react";
import { Badge, Button } from "@mantine/core";
import { IconBuilding, IconGavel } from "@tabler/icons-react";

interface VendorHeaderProps {
  currentUser: { id?: number; name?: string; email?: string } | null;
  myVendor: { name: string } | null | undefined;
  onOpenVendorModal: () => void;
  onNavigateBids: () => void;
  bidsCount: number;
}

export default function VendorHeader({
  currentUser,
  myVendor,
  onOpenVendorModal,
  onNavigateBids,
  bidsCount,
}: VendorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-emerald-950/70 via-indigo-950/50 to-(--bg-surface) p-6 rounded-2xl border border-emerald-900/40 shadow-xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge color="emerald" variant="filled" size="sm">
            VENDOR PORTAL
          </Badge>
          {myVendor && (
            <Badge color="indigo" variant="outline" size="sm">
              {myVendor.name}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-(--text-primary) tracking-tight">
          Tender Marketplace & Bid Center
        </h1>
        <p className="text-sm text-(--text-subtle) mt-1">
          Welcome,{" "}
          <span className="text-emerald-400 font-semibold">
            {currentUser?.name || "Vendor"}
          </span>
          . Browse published tenders, submit proposals, and manage your active
          bids.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {!myVendor && (
          <Button
            leftSection={<IconBuilding size={16} />}
            color="emerald"
            radius="md"
            onClick={onOpenVendorModal}
          >
            Setup Vendor Profile
          </Button>
        )}
        <Button
          variant="outline"
          color="emerald"
          radius="md"
          onClick={onNavigateBids}
          leftSection={<IconGavel size={16} />}
        >
          My Bids ({bidsCount})
        </Button>
      </div>
    </div>
  );
}
