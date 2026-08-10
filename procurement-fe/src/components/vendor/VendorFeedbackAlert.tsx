"use client";

import React from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

interface VendorFeedbackAlertProps {
  feedback: {
    type: "success" | "error";
    message: string;
  } | null;
  onDismiss: () => void;
}

export default function VendorFeedbackAlert({
  feedback,
  onDismiss,
}: VendorFeedbackAlertProps) {
  if (!feedback) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        feedback.type === "success"
          ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
          : "bg-red-950/60 border-red-800 text-red-300"
      }`}
    >
      <div className="flex items-center gap-3">
        {feedback.type === "success" ? (
          <IconCheck size={20} />
        ) : (
          <IconX size={20} />
        )}
        <p className="text-sm font-medium">{feedback.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-xs text-zinc-400 hover:text-white transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}
