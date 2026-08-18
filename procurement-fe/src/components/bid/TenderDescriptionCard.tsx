"use client";
import React from "react";

export function TenderDescriptionCard({ description }: { description?: string }) {
  if (!description) return null;

  return (
    <div className="bg-(--bg-surface) mt-10 border border-(--border) rounded-2xl overflow-hidden mb-4">
      <div className="px-6 sm:px-8 py-4 border-b border-(--border)">
        <h2 className="text-sm font-semibold text-(--text-muted)">
          Tender Description
        </h2>
      </div>
      <div className="px-6 sm:px-8 py-5">
        <p className="text-sm text-(--text-subtle) leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
}
