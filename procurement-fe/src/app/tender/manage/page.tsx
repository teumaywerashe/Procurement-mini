"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import {
  useGetTendersQuery,
  useDeleteTenderMutation,
} from "@/src/store/api/tenderApi";
import type { Tender, TenderStatus } from "@/src/types";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFileText,
  IconAlertTriangle,
  IconChevronRight,
  IconChartBar,
  IconClock,
  IconCircleCheck,
  IconBan,
  IconPencil,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const STATUS_COLORS: Record<
  TenderStatus,
  { bg: string; text: string; dot: string }
> = {
  published: {
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  draft: { bg: "bg-zinc-800/80", text: "text-zinc-400", dot: "bg-zinc-400" },
  closed: { bg: "bg-red-950/60", text: "text-red-400", dot: "bg-red-400" },
  awarded: {
    bg: "bg-indigo-950/60",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  cancelled: {
    bg: "bg-orange-950/60",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
};

const STATUS_FILTERS: {
  label: string;
  value: TenderStatus | "";
  icon: React.ReactNode;
}[] = [
  { label: "All", value: "", icon: <IconFileText size={14} /> },
  {
    label: "Published",
    value: "published",
    icon: <IconCircleCheck size={14} />,
  },
  { label: "Draft", value: "draft", icon: <IconPencil size={14} /> },
  { label: "Closed", value: "closed", icon: <IconBan size={14} /> },
  { label: "Awarded", value: "awarded", icon: <IconChartBar size={14} /> },
  { label: "Cancelled", value: "cancelled", icon: <IconBan size={14} /> },
];

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
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
            <IconTrash size={18} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            Delete tender?
          </h3>
        </div>
        <p className="text-sm text-[var(--text-subtle)] mb-5 leading-relaxed">
          This will permanently delete{" "}
          <span className="text-[var(--text-primary)] font-medium">
            {tender.title}
          </span>
          . This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-subtle)] transition-colors"
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

function daysLeft(dateStr: string, now: number) {
  const diff = new Date(dateStr).getTime() - now;
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Today";
  return `${days}d`;
}

export default function ManageTendersPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "">("");
  const [toDelete, setToDelete] = useState<Tender | null>(null);

  useEffect(() => {
    if (user && user.role !== "Admin") router.push("/tender");
  }, [user, router]);

  const {
    data: tenders = [],
    isLoading,
    isError,
  } = useGetTendersQuery(search ? { title: search } : {});
  const [deleteTender, { isLoading: isDeleting }] = useDeleteTenderMutation();

  const now = React.useMemo(() => Date.now(), []);

  const filtered = tenders.filter((t) =>
    statusFilter ? t.status === statusFilter : true,
  );

  const stats = {
    total: tenders.length,
    published: tenders.filter((t) => t.status === "published").length,
    draft: tenders.filter((t) => t.status === "draft").length,
    closed: tenders.filter((t) => t.status === "closed").length,
    awarded: tenders.filter((t) => t.status === "awarded").length,
    cancelled: tenders.filter((t) => t.status === "cancelled").length,
    closingSoon: tenders.filter((t) => {
      const d = Math.ceil(
        (new Date(t.closingDate).getTime() - now) / 86_400_000,
      );
      return d >= 0 && d <= 7 && t.status === "published";
    }).length,
    totalValue: tenders.reduce((sum, t) => sum + Number(t.estimatedValue), 0),
  };

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteTender(toDelete.id).unwrap();
      notifications.show({
        title: "Deleted",
        message: `"${toDelete.title}" has been deleted.`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete tender.",
        color: "red",
      });
    }
    setToDelete(null);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* ── Left sidebar: Status filter ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "18%" }}
        >
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider px-2 mb-2">
                Filter by status
              </p>
              <nav className="space-y-0.5">
                {STATUS_FILTERS.map((f) => {
                  const count =
                    f.value === ""
                      ? tenders.length
                      : tenders.filter((t) => t.status === f.value).length;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`w-full flex cursor-pointer items-center justify-between px-2 py-2 rounded-md text-xs transition-colors ${
                        statusFilter === f.value
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={
                            statusFilter === f.value
                              ? "text-indigo-400"
                              : "text-[var(--text-faint)]"
                          }
                        >
                          {f.icon}
                        </span>
                        {f.label}
                      </span>
                      <span
                        className={`text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${
                          statusFilter === f.value
                            ? "bg-indigo-600/30 text-indigo-300"
                            : "bg-[var(--bg-elevated)] text-[var(--text-faint)]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Quick create */}
            <Link
              href="/tender/create"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              <IconPlus size={13} />
              New Tender
            </Link>
          </div>
        </aside>

        {/* ── Center: Table ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">
                  Manage Tenders
                </h1>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                  {isLoading
                    ? "Loading..."
                    : `${filtered.length} tender${filtered.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 gap-2">
                  <IconSearch
                    size={14}
                    className="text-[var(--text-faint)] shrink-0"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none w-36"
                  />
                </div>
                <Link
                  href="/tender/create"
                  className="hidden lg:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
                >
                  <IconPlus size={14} />
                  New
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_130px_120px_130px_110px] gap-3 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                <span>Tender</span>
                <span>Status</span>
                <span>Value</span>
                <span>Closing</span>
                <span className="text-center">Actions</span>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-[var(--bg-elevated)] rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <IconAlertTriangle size={28} className="text-red-400" />
                  <p className="text-sm text-red-400">
                    Failed to load tenders.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <IconFileText
                    size={28}
                    className="text-[var(--text-faint)]"
                  />
                  <p className="text-sm text-[var(--text-subtle)]">
                    No tenders found.
                  </p>
                </div>
              ) : (
                filtered.map((t) => {
                  const s = STATUS_COLORS[t.status] ?? STATUS_COLORS.draft;
                  const closing = daysLeft(t.closingDate, now);
                  const isUrgent =
                    closing !== "Closed" &&
                    closing !== "Today" &&
                    parseInt(closing) <= 3;
                  return (
                    <div
                      key={t.id}
                      className="grid grid-cols-[1fr_130px_120px_130px_110px] gap-3 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                          {t.referenceNumber}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${s.bg} ${s.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>

                      <span className="text-sm font-medium text-[var(--text-muted)]">
                        ${Number(t.estimatedValue).toLocaleString()}
                      </span>

                      <span
                        className={`flex items-center gap-1 text-xs ${
                          closing === "Closed"
                            ? "text-[var(--text-faint)]"
                            : isUrgent
                              ? "text-orange-400"
                              : "text-[var(--text-subtle)]"
                        }`}
                      >
                        <IconClock size={12} />
                        {closing === "Closed" ? "Closed" : `${closing} left`}
                      </span>

                      {/* Action buttons - clearly visible */}
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/tender/${t.id}`}
                          className="p-2 text-[var(--text-subtle)] hover:text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border)] transition-all"
                          title="View tender"
                        >
                          <IconChevronRight size={14} />
                        </Link>
                        <Link
                          href={`/tender/${t.id}/edit`}
                          className="p-2 text-indigo-400 hover:text-indigo-300 rounded-md hover:bg-indigo-950/40 border border-indigo-800/30 hover:border-indigo-600/50 transition-all"
                          title="Edit tender"
                        >
                          <IconEdit size={14} />
                        </Link>
                        <button
                          onClick={() => setToDelete(t)}
                          className="p-2 text-red-400 hover:text-red-300 cursor-pointer rounded-md hover:bg-red-950/40 border border-red-800/30 hover:border-red-600/50 transition-all"
                          title="Delete tender"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* ── Right sidebar: Stats ── */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-[var(--border)] bg-[var(--bg-base)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ width: "20%" }}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconChartBar size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Tender Stats
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  {
                    label: "Total",
                    value: stats.total,
                    color: "text-[var(--text-primary)]",
                  },
                  {
                    label: "Published",
                    value: stats.published,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Draft",
                    value: stats.draft,
                    color: "text-zinc-400",
                  },
                  {
                    label: "Awarded",
                    value: stats.awarded,
                    color: "text-indigo-400",
                  },
                  {
                    label: "Closed",
                    value: stats.closed,
                    color: "text-red-400",
                  },
                  {
                    label: "Cancelled",
                    value: stats.cancelled,
                    color: "text-orange-400",
                  },
                  {
                    label: "Closing soon",
                    value: stats.closingSoon,
                    color: "text-orange-300",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]"
                  >
                    <span className="text-xs text-[var(--text-subtle)]">
                      {stat.label}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}

                <div className="px-3 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                  <p className="text-[10px] text-[var(--text-faint)] mb-0.5">
                    Total estimated value
                  </p>
                  <p className="text-sm font-bold text-purple-400">
                    ${stats.totalValue.toLocaleString()}
                  </p>
                </div>

                {/* Status breakdown bar */}
                {stats.total > 0 && (
                  <div className="px-3 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--text-faint)] mb-2">
                      Distribution
                    </p>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      {stats.published > 0 && (
                        <div
                          className="bg-emerald-500"
                          style={{
                            width: `${(stats.published / stats.total) * 100}%`,
                          }}
                        />
                      )}
                      {stats.draft > 0 && (
                        <div
                          className="bg-zinc-500"
                          style={{
                            width: `${(stats.draft / stats.total) * 100}%`,
                          }}
                        />
                      )}
                      {stats.awarded > 0 && (
                        <div
                          className="bg-indigo-500"
                          style={{
                            width: `${(stats.awarded / stats.total) * 100}%`,
                          }}
                        />
                      )}
                      {stats.closed > 0 && (
                        <div
                          className="bg-red-500"
                          style={{
                            width: `${(stats.closed / stats.total) * 100}%`,
                          }}
                        />
                      )}
                      {stats.cancelled > 0 && (
                        <div
                          className="bg-orange-500"
                          style={{
                            width: `${(stats.cancelled / stats.total) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
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
