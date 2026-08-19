"use client";
import React from "react";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface DeleteBidModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteBidModal({
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteBidModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
            <IconTrash size={18} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-(--text-primary) text-base">
            Delete bid?
          </h3>
        </div>
        <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
          This will permanently remove your bid. This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 cursor-pointer rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            // loading={isDeleting}
            className="flex-1 py-2.5 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            Delete bid
          </button>
        </div>
      </div>
    </div>
  );
}
