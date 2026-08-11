"use client";

import React, { useState } from "react";
import { Button, Tabs, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBuildingStore,
  IconShieldCheck,
  IconUsers,
  IconFileText,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/src/store/api/userApi";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { User } from "@/src/types";

// New Components
import StatCards from "./StatCards";
import AdminManagement from "./AdminManagement";
import UsersTable from "./UsersTable";
import VendorsTable from "./VendorsTable";
import TendersTable from "./TendersTable";

// Modals
import CreateAdminModal from "./modals/CreateAdminModal";
import EditAdminRoleModal from "./modals/EditAdminRoleModal";
import DeleteAdminModal from "./modals/DeleteAdminModal";

interface SuperAdminDashboardProps {
  currentUser: { name?: string; email?: string } | null;
}

export default function SuperAdminDashboard({
  currentUser,
}: SuperAdminDashboardProps) {
  // Queries
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: vendorsResult, isLoading: vendorsLoading } = useGetVendorsQuery(
    { limit: 100 },
  );
  const vendors = vendorsResult?.data ?? [];
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery(
    { limit: 100 },
  );
  const tenders = tendersResult?.data ?? [];

  // Mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  // Feedback state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [vendorSearch, setVendorSearch] = useState("");
  const [tenderSearch, setTenderSearch] = useState("");

  // Create Admin Form
  const createForm = useForm({
    initialValues: { name: "", email: "", password: "", role: "Admin" },
    validate: {
      name: (v: string) =>
        v.trim().length >= 2 ? null : "Name must be at least 2 characters",
      email: (v: string) =>
        /^\S+@\S+$/.test(v) ? null : "Invalid email address",
      password: (v: string) =>
        v.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  // Edit Admin Form - Role Only
  const editForm = useForm({
    initialValues: { role: "Admin" },
    validate: {
      role: (v: string) => (v ? null : "Role is required"),
    },
  });

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<User | null>(null);

  // Handlers
  const handleCreateAdmin = async (values: typeof createForm.values) => {
    try {
      await createUser(values).unwrap();
      setFeedback({
        type: "success",
        message: `Admin account "${values.name}" created successfully!`,
      });
      createForm.reset();
      setCreateModalOpen(false);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to create admin",
      });
    }
  };

  const handleEditAdminRole = async (values: typeof editForm.values) => {
    if (!editingAdmin) return;
    try {
      await updateUserRole({ id: editingAdmin.id, role: values.role }).unwrap();
      setFeedback({
        type: "success",
        message: `Admin account "${editingAdmin.name}" role updated to ${values.role}`,
      });
      setEditingAdmin(null);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update role",
      });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    try {
      await deleteUser(deletingAdmin.id).unwrap();
      setFeedback({
        type: "success",
        message: `Admin "${deletingAdmin.name}" has been deleted.`,
      });
      setDeletingAdmin(null);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete admin",
      });
    }
  };

  // Filtered lists
  const adminsList = users.filter(
    (u) =>
      u.role === "Admin" &&
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())),
  );

  const totalAdmins = users.filter((u) => u.role === "Admin").length;

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        {/* Banner / Header */}
        <div className=" flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-indigo-950/70 via-purple-950/40 to-(--bg-surface) p-6 rounded-2xl border border-indigo-900/50 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge color="indigo" variant="filled" size="sm">
                SUPERADMIN CONTROL PANEL
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-(--text-primary) tracking-tight">
              System Operations & Management
            </h1>
            <p className="text-sm text-(--text-subtle) mt-1">
              Welcome back,{" "}
              <span className="text-indigo-400 font-semibold">
                {currentUser?.name ?? "SuperAdmin"}
              </span>
              . Manage admins, view vendors, monitor users, and inspect tenders.
            </p>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            color="indigo"
            radius="md"
            size="md"
            onClick={() => {
              createForm.reset();
              setCreateModalOpen(true);
            }}
          >
            Create New Admin
          </Button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
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
              onClick={() => setFeedback(null)}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <StatCards
          vendorsCount={vendors.length}
          vendorsLoading={vendorsLoading}
          totalAdmins={totalAdmins}
          usersCount={users.length}
          usersLoading={usersLoading}
          tendersCount={tenders.length}
          tendersLoading={tendersLoading}
        />

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="vendors" variant="outline" radius="md">
          <Tabs.List className="border-b border-(--border) mb-6">
           <Tabs.Tab
              value="admins"
              leftSection={<IconShieldCheck size={16} />}
            >
              Admin Management ({totalAdmins})
            </Tabs.Tab> 
             {/* <Tabs.Tab
              value="vendors"
              leftSection={<IconBuildingStore size={16} />}
            >
              Vendors List ({vendors.length})
            </Tabs.Tab> */}
           
            <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
              Logged-in / System Users ({users.length})
            </Tabs.Tab>
            {/* <Tabs.Tab value="tenders" leftSection={<IconFileText size={16} />}>
              Tenders List ({tenders.length})
            </Tabs.Tab> */}
          </Tabs.List>

          {/* TAB 1: VENDORS LIST */}
          <Tabs.Panel value="vendors">
            <VendorsTable
              vendors={vendors}
              vendorsLoading={vendorsLoading}
              vendorSearch={vendorSearch}
              setVendorSearch={setVendorSearch}
            />
          </Tabs.Panel>

          {/* TAB 2: ADMIN MANAGEMENT */}
          <Tabs.Panel value="admins">
            <AdminManagement
              admins={adminsList}
              usersLoading={usersLoading}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              totalAdmins={totalAdmins}
              onAddAdmin={() => {
                createForm.reset();
                setCreateModalOpen(true);
              }}
              onEditRole={(admin) => {
                setEditingAdmin(admin);
                editForm.setValues({
                  role: admin.role || "Admin",
                });
              }}
              onDeleteAdmin={(admin) => setDeletingAdmin(admin)}
              createModalOpen={createModalOpen}
              setCreateModalOpen={setCreateModalOpen}
              editingAdmin={editingAdmin}
              setEditingAdmin={setEditingAdmin}
              deletingAdmin={deletingAdmin}
              setDeletingAdmin={setDeletingAdmin}
              createForm={createForm}
              editForm={editForm}
              handleCreateAdmin={handleCreateAdmin}
              handleEditAdminRole={handleEditAdminRole}
              handleDeleteAdmin={handleDeleteAdmin}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          </Tabs.Panel>

          {/* TAB 3: LOGGED-IN / SYSTEM USERS */}
          <Tabs.Panel value="users">
            <UsersTable
              users={users}
              usersLoading={usersLoading}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />
          </Tabs.Panel>

          {/* TAB 4: TENDERS LIST */}
          <Tabs.Panel value="tenders">
            <TendersTable
              tenders={tenders}
              tendersLoading={tendersLoading}
              tenderSearch={tenderSearch}
              setTenderSearch={setTenderSearch}
            />
          </Tabs.Panel>
        </Tabs>

        {/* MODALS */}
        <CreateAdminModal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          createForm={createForm}
          handleCreateAdmin={handleCreateAdmin}
          isCreating={isCreating}
        />

        <EditAdminRoleModal
          opened={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
          admin={editingAdmin}
          editForm={editForm}
          handleEditAdminRole={handleEditAdminRole}
          isUpdating={isUpdating}
        />

        <DeleteAdminModal
          opened={!!deletingAdmin}
          onClose={() => setDeletingAdmin(null)}
          admin={deletingAdmin}
          handleDeleteAdmin={handleDeleteAdmin}
          isDeleting={isDeleting}
        />
      </div>
    </main>
  );
}
