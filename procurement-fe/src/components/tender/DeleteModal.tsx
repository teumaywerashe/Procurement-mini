"use client";
import React from "react";
import { IconTrash } from "@tabler/icons-react";
import type { Tender } from "@/src/types";

interface Props {
  tender: Tender;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteModal({ tender, onConfirm, onCancel, isDeleting }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
            <IconTrash size={18} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Delete tender?</h3>
        </div>
        <p className="text-sm text-[var(--text-subtle)] mb-5 leading-relaxed">
          This will permanently delete <span className="text-[var(--text-primary)] font-medium">{tender.title}</span>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isDeleting} className="flex-1 py-2.5 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50">
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
