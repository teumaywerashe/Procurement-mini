"use client";

import React from "react";
import Navbar from "@/src/components/layout/Navbar";
import SuperAdminDashboard from "@/src/components/superadmin/SuperAdminDashboard";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";

export default function UsersPage() {
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <SuperAdminDashboard currentUser={user} />
      </div>
    </div>
  );
}

