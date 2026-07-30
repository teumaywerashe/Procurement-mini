"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useGetTendersQuery, useDeleteTenderMutation } from "@/src/store/api/tenderApi";
import type { Tender, TenderStatus } from "@/src/types";
import { IconPlus, IconSearch, IconFileText, IconAlertTriangle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import ManageTenderRow from "@/src/components/tender/ManageTenderRow";
import { ManageLeftSidebar, ManageRightSidebar } from "@/src/components/tender/ManageTenderSidebars";
import DeleteModal from "@/src/components/tender/DeleteModal";

const now = Date.now();

export default function ManageTendersPage() {
  const router = useRouter();
  const user   = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "">("");
  const [toDelete, setToDelete]       = useState<Tender | null>(null);

  useEffect(() => {
    if (user && user.role !== "Admin") router.push("/tender");
  }, [user, router]);

  const { data: tenders = [], isLoading, isError } = useGetTendersQuery(search ? { title: search } : {});
  const [deleteTender, { isLoading: isDeleting }]  = useDeleteTenderMutation();

  const filtered = tenders.filter((t) => statusFilter ? t.status === statusFilter : true);

  const stats = {
    total: tenders.length,
    published:  tenders.filter((t) => t.status === "published").length,
    draft:      tenders.filter((t) => t.status === "draft").length,
    closed:     tenders.filter((t) => t.status === "closed").length,
    awarded:    tenders.filter((t) => t.status === "awarded").length,
    cancelled:  tenders.filter((t) => t.status === "cancelled").length,
    closingSoon: tenders.filter((t) => { const d = Math.ceil((new Date(t.closingDate).getTime() - now) / 86_400_000); return d >= 0 && d <= 7 && t.status === "published"; }).length,
    totalValue: tenders.reduce((sum, t) => sum + Number(t.estimatedValue), 0),
  };

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteTender(toDelete.id).unwrap();
      notifications.show({ title: "Deleted", message: `"${toDelete.title}" has been deleted.`, color: "green" });
    } catch {
      notifications.show({ title: "Error", message: "Failed to delete tender.", color: "red" });
    }
    setToDelete(null);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden mt-14">
        <ManageLeftSidebar tenders={tenders} statusFilter={statusFilter} onStatusChange={setStatusFilter} />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">Manage Tenders</h1>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">{isLoading ? "Loading..." : `${filtered.length} tender${filtered.length !== 1 ? "s" : ""}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 gap-2">
                  <IconSearch size={14} className="text-[var(--text-faint)] shrink-0" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                    className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none w-36" />
                </div>
                <Link href="/tender/create" className="hidden lg:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0">
                  <IconPlus size={14} /> New
                </Link>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_130px_120px_130px_110px] gap-3 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                <span>Tender</span><span>Status</span><span>Value</span><span>Closing</span><span className="text-center">Actions</span>
              </div>
              {isLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-[var(--bg-elevated)] rounded animate-pulse" />)}</div>
              ) : isError ? (
                <div className="flex flex-col items-center py-16 gap-3"><IconAlertTriangle size={28} className="text-red-400" /><p className="text-sm text-red-400">Failed to load tenders.</p></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3"><IconFileText size={28} className="text-[var(--text-faint)]" /><p className="text-sm text-[var(--text-subtle)]">No tenders found.</p></div>
              ) : filtered.map((t) => <ManageTenderRow key={t.id} tender={t} now={now} onDelete={setToDelete} />)}
            </div>
          </div>
        </main>

        <ManageRightSidebar stats={stats} isLoading={isLoading} />
      </div>

      {toDelete && <DeleteModal tender={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} isDeleting={isDeleting} />}
    </div>
  );
}
