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
  value: string | number;
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
      <p className="text-2xl font-bold text-(--text-primary) tabular-nums">{value}</p>
      <p className="text-xs text-(--text-muted) mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-(--text-subtle) mt-1">{sub}</p>}
    </div>
  );
}
export default StatusCard;
