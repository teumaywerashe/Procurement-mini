import React from "react";
import {
  IconBuildingStore,
  IconShieldCheck,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import LoadingSpan from "@/src/utilis/LoadingSpan";

interface StatCardsProps {
  vendorsCount: number;
  vendorsLoading: boolean;
  totalAdmins: number;
  usersCount: number;
  usersLoading: boolean;
  tendersCount: number;
  tendersLoading: boolean;
}

export function StatCards({
  vendorsCount,
  vendorsLoading,
  totalAdmins,
  usersCount,
  usersLoading,
  tendersCount,
  tendersLoading,
}: StatCardsProps) {
  return (
    <div className=" grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        icon={<IconBuildingStore size={20} className="text-emerald-400" />}
        label="Registered Vendors"
        value={vendorsLoading ? <LoadingSpan /> : vendorsCount}
        sub="Active vendors list"
        color="bg-emerald-950/60"
      />
      <StatusCard
        icon={<IconShieldCheck size={20} className="text-indigo-400" />}
        label="System Admins"
        value={usersLoading ? <LoadingSpan /> : totalAdmins}
        sub="Platform administrators"
        color="bg-indigo-950/60"
      />
      <StatusCard
        icon={<IconUsers size={20} className="text-purple-400" />}
        label="Total Logged-in Users"
        value={usersLoading ? <LoadingSpan /> : usersCount}
        sub="Registered accounts"
        color="bg-purple-950/60"
      />
      <StatusCard
        icon={<IconFileText size={20} className="text-amber-400" />}
        label="System Tenders"
        value={tendersLoading ? <LoadingSpan /> : tendersCount}
        sub="Procurement tenders"
        color="bg-amber-950/60"
      />
    </div>
  );
}

export default StatCards;
