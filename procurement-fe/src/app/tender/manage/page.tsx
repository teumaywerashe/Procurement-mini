"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetTendersQuery, useDeleteTenderMutation } from "@/src/store/api/tenderApi";
import type { Tender, TenderStatus } from "@/src/types";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFileText,
  IconAlertTriangle,
  IconChevronRight,
} from "@tabler/icons-react";

const STATUS_COLORS: Record<TenderStatus, { bg: string; text: string }> = {
  published: { bg: "bg-emerald-950/60", text: "text-emerald-400" },
  draft:     { bg: "bg-zinc-800/80",    text: "text-zinc-400"    },
  closed:    { bg: "bg-red-950/60",     text: "text-red-400"     },
  awarded:   { bg: "bg-indigo-950/60",  text: "text-indigo-400"  },
  cancelled: { bg: "bg-orange-950/60",  text: "text-orange-400"  },
};

function DeleteModal({
  tender,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  tender: Tender;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1c1a16] border border-[#2a2620] rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
            <IconTrash size={18} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-white">Delete tender?</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          This will permanently delete <span className="text-white font-medium">{tender.title}</span>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg border border-[#3a3630] text-sm text-zinc-300 hover:text-white hover:border-zinc-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageTendersPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "">("");
  const [toDelete, setToDelete] = useState<Tender | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/tender");
  }, [user, router]);

  const { data: tenders = [], isLoading, isError } = useGetTendersQuery(
    search ? { title: search } : {}
  );
  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();

  const filtered = tenders.filter((t) =>
    statusFilter ? t.status === statusFilter : true
  );

  async function handleDelete() {
    if (!toDelete) return;
    await deleteTender(toDelete.id);
    setToDelete(null);
  }

  return (
    <div className="min-h-screen bg-[#0f0e0b] text-white flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">Manage Tenders</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isLoading ? "Loading..." : `${filtered.length} tender${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/tender/create"
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <IconPlus size={15} />
            New Tender
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center flex-1 max-w-sm bg-[#161410] border border-[#2a2620] rounded-lg px-3 py-2 gap-2">
            <IconSearch size={14} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none flex-1"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TenderStatus | "")}
            className="bg-[#161410] border border-[#2a2620] text-xs text-zinc-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_140px_160px_120px] gap-4 px-5 py-3 border-b border-[#2a2620] text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
            <span>Tender</span>
            <span>Status</span>
            <span>Value</span>
            <span>Closing Date</span>
            <span className="text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-[#14120e] rounded animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <IconAlertTriangle size={28} className="text-red-400" />
              <p className="text-sm text-red-400">Failed to load tenders.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <IconFileText size={28} className="text-zinc-600" />
              <p className="text-sm text-zinc-500">No tenders found.</p>
            </div>
          ) : (
            filtered.map((t) => {
              const s = STATUS_COLORS[t.status] ?? STATUS_COLORS.draft;
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-[1fr_140px_140px_160px_120px] gap-4 px-5 py-4 border-b border-[#1e1c18] hover:bg-[#161410] transition-colors items-center"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{t.title}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{t.referenceNumber}</p>
                  </div>
                  <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                  <span className="text-sm text-zinc-300 font-medium">
                    ${Number(t.estimatedValue).toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(t.closingDate).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/tender/${t.id}`}
                      className="p-1.5 text-zinc-600 hover:text-zinc-300 rounded hover:bg-white/5 transition-colors"
                      title="View"
                    >
                      <IconChevronRight size={15} />
                    </Link>
                    <Link
                      href={`/tender/${t.id}/edit`}
                      className="p-1.5 text-zinc-600 cursor-pointer hover:text-indigo-400 rounded hover:bg-indigo-950/30 transition-colors"
                      title="Edit"
                    >
                      <IconEdit size={15} />
                    </Link>
                    <button
                      onClick={() => setToDelete(t)}
                      className="p-1.5 text-zinc-600 cursor-pointer hover:text-red-400 rounded hover:bg-red-950/30 transition-colors"
                      title="Delete"
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {toDelete && (
        <DeleteModal
          tender={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
