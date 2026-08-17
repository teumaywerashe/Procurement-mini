import React, { useState } from "react";
import { Tender } from "@/src/types";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconChevronRight, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useDeleteTenderMutation } from "@/src/store/api/tenderApi";

interface TendersTableProps {
  tenders: Tender[];
  tendersLoading: boolean;
  tenderSearch: string;
  setTenderSearch: (search: string) => void;
}

export function TendersTable({
  tenders,
  tendersLoading,
  tenderSearch,
  setTenderSearch,
}: TendersTableProps) {
  const [deleteTender] = useDeleteTenderMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const filteredTenders = tenders.filter(
    (t) =>
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(tenderSearch.toLowerCase()),
  );

  const handleDeleteTender = async (tender: Tender) => {
    const confirmed = window.confirm(
      `Delete tender "${tender.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(tender.id);
    try {
      await deleteTender(tender.id).unwrap();
      notifications.show({
        title: "Tender deleted",
        message: `Tender "${tender.title}" was deleted successfully.`,
        color: "green",
      });
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Failed to delete tender",
        color: "red",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-(--text-primary)">
            Platform Procurement Tenders
          </h2>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            Comprehensive overview of published and active tenders across the
            system.
          </p>
        </div>
        <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
          <IconSearch size={16} className="text-(--text-faint) shrink-0" />
          <input
            type="text"
            value={tenderSearch}
            onChange={(e) => setTenderSearch(e.target.value)}
            placeholder="Search tender title or ref..."
            className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
          />
        </div>
      </div>

      {tendersLoading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="p-12 text-center text-sm text-(--text-subtle)">
          No tenders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-(--text-primary)">
            <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
              <tr>
                <th className="px-6 py-3.5">Ref No.</th>
                <th className="px-6 py-3.5">Tender Title</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Closing Date</th>
                <th className="px-6 py-3.5">Est. Value</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {filteredTenders.map((tender) => (
                <tr
                  key={tender.id}
                  className="hover:bg-(--bg-elevated) transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-(--text-faint)">
                    {tender.referenceNumber}
                  </td>
                  <td className="px-6 py-4 font-semibold text-(--text-primary)">
                    {tender.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        tender.status === "published"
                          ? "bg-emerald-950/80 text-emerald-400"
                          : tender.status === "awarded"
                            ? "bg-indigo-950/80 text-indigo-400"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tender.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-(--text-subtle)">
                    {new Date(tender.closingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-(--text-primary)">
                    ${Number(tender.estimatedValue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/tenders/${tender.id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                      >
                        Details <IconChevronRight size={13} />
                      </Link>
                      <Button
                        size="compact-xs"
                        color="red"
                        variant="light"
                        leftSection={<IconTrash size={12} />}
                        loading={deletingId === tender.id}
                        onClick={() => handleDeleteTender(tender)}
                      >
                        Delete
                      </Button>
                    </div>
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

export default TendersTable;
