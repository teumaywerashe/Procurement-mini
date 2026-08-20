/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Tabs, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconShieldCheck,
  IconUsers,
  IconPlus,
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

import StatCards from "./StatCards";
import AdminManagement from "./AdminManagement";
import UsersTable from "./UsersTable";
import VendorsTable from "./VendorsTable";
import TendersTable from "./TendersTable";

import CreateAdminModal from "./modals/CreateAdminModal";
import EditAdminRoleModal from "./modals/EditAdminRoleModal";
import DeleteAdminModal from "./modals/DeleteAdminModal";
import { notifications } from "@mantine/notifications";

interface SuperAdminDashboardProps {
  currentUser: { name?: string; email?: string } | null;
}

export default function SuperAdminDashboard({
  currentUser,
}: SuperAdminDashboardProps) {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: vendorsResult, isLoading: vendorsLoading } = useGetVendorsQuery(
    { limit: 100 },
  );
  const vendors = vendorsResult?.data ?? [];
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery(
    { limit: 100 },
  );
  const tenders = tendersResult?.data ?? [];

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();


  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [vendorSearch, setVendorSearch] = useState("");
  const [tenderSearch, setTenderSearch] = useState("");

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

  const editForm = useForm({
    initialValues: { role: "Admin" },
    validate: {
      role: (v: string) => (v ? null : "Role is required"),
    },
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<User | null>(null);

  const handleCreateAdmin = async (values: typeof createForm.values) => {
    try {
      await createUser(values).unwrap();
      notifications.show({
        title: "Admin created",
        message: `Admin account "${values.name}" created successfully!`,
        color:"green"
      });
      createForm.reset();
      setCreateModalOpen(false);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err?.data?.message || "Failed to create admin",
        color:"red"
      });
    }
  };

  const handleEditAdminRole = async (values: typeof editForm.values) => {
    if (!editingAdmin) return;
    try {
      await updateUserRole({ id: editingAdmin.id, role: values.role }).unwrap();
      notifications.show({
          title: "Admin role updated",
        message: `Admin account "${editingAdmin.name}" role updated to ${values.role}`,
        color:"green"
      });
      setEditingAdmin(null);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err?.data?.message || "Failed to update role",
        color:"red"
      });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    try {
      await deleteUser(deletingAdmin.id).unwrap();
      notifications.show({
        title: "Admin deleted",
        message: `Admin "${deletingAdmin.name}" has been deleted.`,
        color:"green"
      });
      setDeletingAdmin(null);
    } catch (err: any) {
        notifications.show({
        title: "Error",
        message: err?.data?.message || "Failed to delete admin",
        color:"red"
      });
    }
  };

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
        <div className=" flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-indigo-950/20 via-purple-950/20 to-(--bg-surface) p-6 rounded-2xl border border-indigo-900/50 shadow-xl">
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
           
            <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
              Logged-in / System Users ({users.length})
            </Tabs.Tab>
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
