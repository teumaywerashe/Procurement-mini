"use client";
import React from "react";
import Link from "next/link";
import { IconBuilding, IconPhone, IconMapPin, IconCalendar, IconChevronRight } from "@tabler/icons-react";

interface Vendor {
  id: number;
  companyName: string;
  contactPhone?: string | null;
  address?: string | null;
  createdAt: string;
}

export default function VendorCard({ v }: { v: Vendor }) {
  return (
    <Link href={`/vendors/${v.id}`} className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 hover:border-indigo-500/40 hover:bg-[var(--bg-elevated)] transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-indigo-950/60 flex items-center justify-center shrink-0">
          <IconBuilding size={18} className="text-indigo-400" />
        </div>
        <IconChevronRight size={15} className="text-[var(--text-faint)] group-hover:text-indigo-400 transition-colors mt-0.5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-indigo-300 transition-colors leading-snug">{v.companyName}</p>
        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">Vendor ID: {v.id}</p>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <IconPhone size={12} className="text-[var(--text-faint)] shrink-0" />
          <span className={`text-xs ${v.contactPhone ? "text-[var(--text-muted)]" : "text-[var(--text-faint)] italic"}`}>{v.contactPhone ?? "No phone"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconMapPin size={12} className="text-[var(--text-faint)] shrink-0" />
          <span className={`text-xs truncate ${v.address ? "text-[var(--text-muted)]" : "text-[var(--text-faint)] italic"}`}>{v.address ?? "No address"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCalendar size={12} className="text-[var(--text-faint)] shrink-0" />
          <span className="text-xs text-[var(--text-faint)]">Since {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </Link>
  );
}
