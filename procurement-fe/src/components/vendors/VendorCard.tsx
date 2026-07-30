"use client";
import React from "react";
import Link from "next/link";
import { IconBuilding, IconPhone, IconMapPin, IconCalendar, IconChevronRight } from "@tabler/icons-react";
import { Vendor } from "@/src/types";



export default function VendorCard({ v }: { v: Vendor }) {
  return (
    <Link href={`/vendors/${v.id}`} className="group bg-(--bg-surface) border border-(--border) rounded-xl p-5 hover:border-indigo-500/40 hover:bg-(--bg-elevated) transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-indigo-950/60 flex items-center justify-center shrink-0">
          <IconBuilding size={18} className="text-indigo-400" />
        </div>
        <IconChevronRight size={15} className="text-(--text-faint) group-hover:text-indigo-400 transition-colors mt-0.5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-(--text-primary) group-hover:text-indigo-300 transition-colors leading-snug">{v.name}</p>
        <p className="text-[11px] text-(--text-faint) mt-0.5">Vendor ID: {v.id}</p>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <IconPhone size={12} className="text-(--text-faint) shrink-0" />
          <span className={`text-xs ${v.phoneNumber ? "text-(--text-muted)" : "text-(--text-faint) italic"}`}>{v.phoneNumber ?? "No phone"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconMapPin size={12} className="text-(--text-faint) shrink-0" />
          <span className={`text-xs truncate ${v.email ? "text-(--text-muted)" : "text-(--text-faint) italic"}`}>{v.email ?? "No email"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCalendar size={12} className="text-(--text-faint) shrink-0" />
          <span className="text-xs text-(--text-faint)">Since {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </Link>
  );
}
