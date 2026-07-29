import React from "react";
import {
  IconFileText,
  IconBuildingSkyscraper,
  IconTruck,
  IconDeviceDesktop,
  IconMedicalCross,
  IconSchool,
  IconLeaf,
} from "@tabler/icons-react";
import type { Bid, TenderStatus } from "@/src/types";

export const BID_STATUS_STYLES: Record<
  Bid["bidStatus"],
  { bg: string; text: string; dot: string }
> = {
  pending:  { bg: "bg-yellow-950/60",  text: "text-yellow-400",  dot: "bg-yellow-400"  },
  accepted: { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-950/60",     text: "text-red-400",     dot: "bg-red-400"     },
};

export const TENDER_STATUS_COLORS: Record<
  TenderStatus,
  { bg: string; text: string; dot: string }
> = {
  published: { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  draft:     { bg: "bg-zinc-800/80",    text: "text-zinc-400",    dot: "bg-zinc-400"    },
  closed:    { bg: "bg-red-950/60",     text: "text-red-400",     dot: "bg-red-400"     },
  awarded:   { bg: "bg-indigo-950/60",  text: "text-indigo-400",  dot: "bg-indigo-400"  },
  cancelled: { bg: "bg-orange-950/60",  text: "text-orange-400",  dot: "bg-orange-400"  },
};

export const CATEGORIES = [
  { label: "All Categories", value: "",              icon: React.createElement(IconFileText, { size: 14 }) },
  { label: "Infrastructure", value: "infrastructure", icon: React.createElement(IconBuildingSkyscraper, { size: 14 }) },
  { label: "Logistics",      value: "logistics",      icon: React.createElement(IconTruck, { size: 14 }) },
  { label: "Technology",     value: "technology",     icon: React.createElement(IconDeviceDesktop, { size: 14 }) },
  { label: "Healthcare",     value: "healthcare",     icon: React.createElement(IconMedicalCross, { size: 14 }) },
  { label: "Education",      value: "education",      icon: React.createElement(IconSchool, { size: 14 }) },
  { label: "Environment",    value: "environment",    icon: React.createElement(IconLeaf, { size: 14 }) },
];

export const STATUS_OPTIONS: { label: string; value: TenderStatus }[] = [
  { label: "Draft",     value: "draft"     },
  { label: "Published", value: "published" },
  { label: "Closed",    value: "closed"    },
  { label: "Awarded",   value: "awarded"   },
  { label: "Cancelled", value: "cancelled" },
];

export function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

export function daysLeftShort(dateStr: string, now: number) {
  const diff = new Date(dateStr).getTime() - now;
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Today";
  return `${days}d`;
}

export function timeAgo(dateStr: string, now: number) {
  const diff = now - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
