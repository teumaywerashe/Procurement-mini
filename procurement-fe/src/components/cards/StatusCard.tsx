/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

function StatusCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode | any;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-(--text-primary) tabular-nums">
        {value}
      </div>
      <span className="mt-0.5 block text-xs text-(--text-muted)">{label}</span>
      {sub && <p className="text-[11px] text-(--text-subtle) mt-1">{sub}</p>}
    </div>
  );
}
export default StatusCard;
