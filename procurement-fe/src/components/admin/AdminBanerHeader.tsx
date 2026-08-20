/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { AdminDashboardProps } from "./AdminDashboard";

function AdminBanerHeader({ currentUser }: any ) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-(--bg-surface) p-6 rounded-2xl border border-indigo-900/40 shadow-xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge color="blue" variant="filled" size="sm">
            ADMIN CONTROL PANEL
          </Badge>
        </div>
        <h1 className="text-2xl font-extrabold text-(--text-primary) tracking-tight">
          Tender & Bid Operations
        </h1>
        <p className="text-sm text-(--text-subtle) mt-1">
          Welcome back,{" "}
          <span className="text-indigo-400 font-semibold">
            {currentUser?.name || "Admin"}
          </span>
          . Track and manage your created tenders and evaluate submitted vendor
          bids.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/tenders/create">
          <Button
            leftSection={<IconPlus size={16} />}
            color="indigo"
            radius="md"
            size="md"
          >
            Create New Tender
          </Button>
        </Link>
        <Link href="/tenders/manage">
          <Button variant="outline" color="indigo" radius="md" size="md">
            Manage Tenders
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AdminBanerHeader;
