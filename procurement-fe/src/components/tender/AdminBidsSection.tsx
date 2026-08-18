"use client";
import React from "react";
import Link from "next/link";
import { IconGavel, IconChevronRight } from "@tabler/icons-react";
import type { Bid } from "@/src/types";

interface Props {
  bids: Bid[];
}

export default function AdminBidsSection({ bids }: Props) {
  return (
    <div className="mt-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-8 py-4 border-b border-[var(--border)] flex items-center gap-2">
        <IconGavel size={15} className="text-indigo-400" />
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bids ({bids.length})</h2>
      </div>
      {bids.length === 0 ? (
        <div className="px-8 py-8 text-center"><p className="text-sm text-[var(--text-subtle)]">No bids have been submitted yet.</p></div>
      ) : (
        <div>
          {[...bids].sort((a, b) => Number(b.amount) - Number(a.amount)).map((bid, i) => (
            <Link key={bid.id} href={`/bids/${bid.id}`} className="flex items-center justify-between px-8 py-3.5 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--text-faint)] w-5 tabular-nums">#{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">${Number(bid.amount).toLocaleString()}</p>
                  <p className="text-[11px] text-[var(--text-faint)]">
                    Vendor #{bid.vendorId} · {new Date(bid.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${bid.bidStatus === "accepted" ? "bg-emerald-950/60 text-emerald-400" : bid.bidStatus === "rejected" ? "bg-red-950/60 text-red-400" : "bg-yellow-950/60 text-yellow-400"}`}>
                  {bid.bidStatus?.charAt(0).toUpperCase() + bid.bidStatus?.slice(1)}
                </span>
                <IconChevronRight size={16} className="text-[var(--text-faint)]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
