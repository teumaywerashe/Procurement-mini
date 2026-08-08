"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Modal,
  Button,
  TextInput,
  PasswordInput,
  Select,
  Group,
  Stack,
  Text,
  Badge,
  Paper,
  Tabs,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBuildingStore,
  IconShieldCheck,
  IconUsers,
  IconFileText,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconChevronRight,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import StatusCard from "@/src/components/cards/StatusCard";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/src/store/api/userApi";
import { useGetVendorsQuery } from "@/src/store/api/vendorApi";
import { useGetTendersQuery } from "@/src/store/api/tenderApi";
import type { User, Vendor, Tender } from "@/src/types";

interface SuperAdminDashboardProps {
  currentUser: { name?: string; email?: string } | null;
}

export default function SuperAdminDashboard({ currentUser }: SuperAdminDashboardProps) {
  // Queries
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: vendorsResult, isLoading: vendorsLoading } = useGetVendorsQuery({ limit: 100 });
  const vendors = vendorsResult?.data ?? [];
  const { data: tendersResult, isLoading: tendersLoading } = useGetTendersQuery({ limit: 100 });
  const tenders = tendersResult?.data ?? [];

  // Mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [vendorSearch, setVendorSearch] = useState("");
  const [tenderSearch, setTenderSearch] = useState("");

  // Create Admin Form
  const createForm = useForm({
    initialValues: { name: "", email: "", password: "", role: "Admin" },
    validate: {
      name: (v) => (v.trim().length >= 2 ? null : "Name must be at least 2 characters"),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email address"),
      password: (v) => (v.length >= 6 ? null : "Password must be at least 6 characters"),
    },
  });

  // Edit Admin Form
  const editForm = useForm({
    initialValues: { name: "", email: "", password: "", role: "Admin" },
    validate: {
      name: (v) => (v.trim().length >= 2 ? null : "Name must be at least 2 characters"),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email address"),
      password: (v) => (!v || v.length >= 6 ? null : "Password must be at least 6 characters"),
    },
  });

  // Handlers
  const handleCreateAdmin = async (values: typeof createForm.values) => {
    try {
      await createUser(values).unwrap();
      setFeedback({ type: "success", message: `Admin account "${values.name}" created successfully!` });
      createForm.reset();
      setCreateModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to create admin" });
    }
  };

  const openEditModal = (admin: User) => {
    setEditingAdmin(admin);
    editForm.setValues({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role || "Admin",
    });
  };

  const handleEditAdmin = async (values: typeof editForm.values) => {
    if (!editingAdmin) return;
    try {
      const payload: Partial<User> & { password?: string } = {
        name: values.name,
        email: values.email,
      };
      if (values.password && values.password.trim().length > 0) {
        payload.password = values.password;
      }
      await updateUser({ id: editingAdmin.id, ...payload }).unwrap();
      if (values.role !== editingAdmin.role) {
        await updateUserRole({ id: editingAdmin.id, role: values.role }).unwrap();
      }
      setFeedback({ type: "success", message: `Admin account "${values.name}" updated successfully!` });
      setEditingAdmin(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to update admin" });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    try {
      await deleteUser(deletingAdmin.id).unwrap();
      setFeedback({ type: "success", message: `Admin "${deletingAdmin.name}" has been deleted.` });
      setDeletingAdmin(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.data?.message || "Failed to delete admin" });
    }
  };

  // Filtered lists
  const adminsList = users.filter(
    (u) =>
      u.role === "Admin" &&
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      (v.email && v.email.toLowerCase().includes(vendorSearch.toLowerCase()))
  );

  const filteredTenders = tenders.filter(
    (t) =>
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(tenderSearch.toLowerCase())
  );

  const totalAdmins = users.filter((u) => u.role === "Admin").length;

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-(--bg-base)">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-(--bg-surface) p-6 rounded-2xl border border-indigo-900/50 shadow-xl">
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
              Welcome back, <span className="text-indigo-400 font-semibold">{currentUser?.name ?? "SuperAdmin"}</span>. Manage admins, view vendors, monitor users, and inspect tenders.
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
              {feedback.type === "success" ? <IconCheck size={20} /> : <IconX size={20} />}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon={<IconBuildingStore size={20} className="text-emerald-400" />}
            label="Registered Vendors"
            value={vendorsLoading ? "—" : vendors.length}
            sub="Active vendors list"
            color="bg-emerald-950/60"
          />
          <StatusCard
            icon={<IconShieldCheck size={20} className="text-indigo-400" />}
            label="System Admins"
            value={usersLoading ? "—" : totalAdmins}
            sub="Platform administrators"
            color="bg-indigo-950/60"
          />
          <StatusCard
            icon={<IconUsers size={20} className="text-purple-400" />}
            label="Total Logged-in Users"
            value={usersLoading ? "—" : users.length}
            sub="Registered accounts"
            color="bg-purple-950/60"
          />
          <StatusCard
            icon={<IconFileText size={20} className="text-amber-400" />}
            label="System Tenders"
            value={tendersLoading ? "—" : tenders.length}
            sub="Procurement tenders"
            color="bg-amber-950/60"
          />
        </div>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="vendors" variant="outline" radius="md">
          <Tabs.List className="border-b border-(--border) mb-6">
            <Tabs.Tab value="vendors" leftSection={<IconBuildingStore size={16} />}>
              Vendors List ({vendors.length})
            </Tabs.Tab>
            <Tabs.Tab value="admins" leftSection={<IconShieldCheck size={16} />}>
              Admin Management ({totalAdmins})
            </Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
              Logged-in / System Users ({users.length})
            </Tabs.Tab>
            <Tabs.Tab value="tenders" leftSection={<IconFileText size={16} />}>
              Tenders List ({tenders.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: VENDORS LIST */}
          <Tabs.Panel value="vendors">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">Registered Vendors</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Overview of all vendor companies registered on ProcureHub
                  </p>
                </div>
                <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
                  <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search vendor company..."
                    className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                  />
                </div>
              </div>

              {vendorsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="p-12 text-center text-sm text-(--text-subtle)">
                  No vendors found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-(--text-primary)">
                    <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                      <tr>
                        <th className="px-6 py-3.5">Company Name</th>
                        <th className="px-6 py-3.5">Email</th>
                        <th className="px-6 py-3.5">Registration No.</th>
                        <th className="px-6 py-3.5">Phone Number</th>
                        <th className="px-6 py-3.5">Bids Count</th>
                        <th className="px-6 py-3.5">Joined Date</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--border-subtle)">
                      {filteredVendors.map((vendor: Vendor) => (
                        <tr key={vendor.id} className="hover:bg-(--bg-elevated) transition-colors">
                          <td className="px-6 py-4 font-semibold text-indigo-400">
                            {vendor.name}
                          </td>
                          <td className="px-6 py-4 text-(--text-subtle)">{vendor.email || "—"}</td>
                          <td className="px-6 py-4 font-mono text-(--text-faint)">
                            {(vendor as any).registrationNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-(--text-subtle)">
                            {vendor.phoneNumber || "—"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge color="yellow" variant="light">
                              {vendor.bids?.length ?? 0} Bids
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-(--text-faint)">
                            {new Date(vendor.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/vendors`}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                            >
                              View Detail <IconChevronRight size={13} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* TAB 2: ADMIN MANAGEMENT */}
          <Tabs.Panel value="admins">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm space-y-4">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">Admin Accounts Management</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    SuperAdmin privileges: Create new admin accounts, edit details, or remove administrative access.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-60">
                    <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search admin name or email..."
                      className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                    />
                  </div>
                  <Button
                    leftSection={<IconPlus size={15} />}
                    color="indigo"
                    size="xs"
                    onClick={() => {
                      createForm.reset();
                      setCreateModalOpen(true);
                    }}
                  >
                    Add Admin
                  </Button>
                </div>
              </div>

              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : adminsList.length === 0 ? (
                <div className="p-12 text-center text-sm text-(--text-subtle)">
                  No Admin accounts found. Click &quot;Add Admin&quot; to create one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-(--text-primary)">
                    <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                      <tr>
                        <th className="px-6 py-3.5">ID</th>
                        <th className="px-6 py-3.5">Admin Name</th>
                        <th className="px-6 py-3.5">Email Address</th>
                        <th className="px-6 py-3.5">Role</th>
                        <th className="px-6 py-3.5">Created At</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--border-subtle)">
                      {adminsList.map((admin: User) => (
                        <tr key={admin.id} className="hover:bg-(--bg-elevated) transition-colors">
                          <td className="px-6 py-4 font-mono text-(--text-faint)">#{admin.id}</td>
                          <td className="px-6 py-4 font-semibold text-(--text-primary)">{admin.name}</td>
                          <td className="px-6 py-4 text-(--text-subtle)">{admin.email}</td>
                          <td className="px-6 py-4">
                            <Badge color="blue" variant="light">
                              {admin.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-(--text-faint)">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Group justify="flex-end" gap="xs">
                              <Tooltip label="Edit Admin">
                                <ActionIcon
                                  variant="subtle"
                                  color="blue"
                                  onClick={() => openEditModal(admin)}
                                >
                                  <IconEdit size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete Admin">
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  onClick={() => setDeletingAdmin(admin)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* TAB 3: LOGGED-IN / SYSTEM USERS */}
          <Tabs.Panel value="users">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">All Registered System Users</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    View active system user accounts, their assigned roles, and registered emails.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    size="xs"
                    value={roleFilter}
                    onChange={(v) => setRoleFilter(v || "ALL")}
                    data={[
                      { value: "ALL", label: "All Roles" },
                      { value: "SuperAdmin", label: "SuperAdmin" },
                      { value: "Admin", label: "Admin" },
                      { value: "Vendor", label: "Vendor" },
                    ]}
                    className="w-36"
                  />
                  <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-56">
                    <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-sm text-(--text-subtle)">
                  No system users matching search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-(--text-primary)">
                    <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                      <tr>
                        <th className="px-6 py-3.5">User ID</th>
                        <th className="px-6 py-3.5">Full Name</th>
                        <th className="px-6 py-3.5">Email</th>
                        <th className="px-6 py-3.5">Assigned Role</th>
                        <th className="px-6 py-3.5">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--border-subtle)">
                      {filteredUsers.map((u: User) => (
                        <tr key={u.id} className="hover:bg-(--bg-elevated) transition-colors">
                          <td className="px-6 py-4 font-mono text-(--text-faint)">#{u.id}</td>
                          <td className="px-6 py-4 font-semibold text-(--text-primary)">{u.name}</td>
                          <td className="px-6 py-4 text-(--text-subtle)">{u.email}</td>
                          <td className="px-6 py-4">
                            <Badge
                              color={
                                u.role === "SuperAdmin"
                                  ? "red"
                                  : u.role === "Admin"
                                  ? "blue"
                                  : "emerald"
                              }
                              variant="light"
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-(--text-faint)">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* TAB 4: TENDERS LIST */}
          <Tabs.Panel value="tenders">
            <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">Platform Procurement Tenders</h2>
                  <p className="text-xs text-(--text-subtle) mt-0.5">
                    Comprehensive overview of published and active tenders across the system.
                  </p>
                </div>
                <div className="flex items-center bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-1.5 gap-2 w-full sm:w-64">
                  <IconSearch size={16} className="text-(--text-faint) shrink-0" />
                  <input
                    type="text"
                    value={tenderSearch}
                    onChange={(e) => setTenderSearch(e.target.value)}
                    placeholder="Search tender title or ref..."
                    className="bg-transparent text-xs text-(--text-primary) placeholder-(--text-faint) outline-none w-full"
                  />
                </div>
              </div>

              {tendersLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredTenders.length === 0 ? (
                <div className="p-12 text-center text-sm text-(--text-subtle)">
                  No tenders found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-(--text-primary)">
                    <thead className="bg-(--bg-elevated) text-(--text-subtle) font-semibold border-b border-(--border)">
                      <tr>
                        <th className="px-6 py-3.5">Ref No.</th>
                        <th className="px-6 py-3.5">Tender Title</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Closing Date</th>
                        <th className="px-6 py-3.5">Est. Value</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--border-subtle)">
                      {filteredTenders.map((tender: Tender) => (
                        <tr key={tender.id} className="hover:bg-(--bg-elevated) transition-colors">
                          <td className="px-6 py-4 font-mono text-(--text-faint)">
                            {tender.referenceNumber}
                          </td>
                          <td className="px-6 py-4 font-semibold text-(--text-primary)">
                            {tender.title}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                                tender.status === "published"
                                  ? "bg-emerald-950/80 text-emerald-400"
                                  : tender.status === "awarded"
                                  ? "bg-indigo-950/80 text-indigo-400"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {tender.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-(--text-subtle)">
                            {new Date(tender.closingDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-(--text-primary)">
                            ${Number(tender.estimatedValue || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/tenders/${tender.id}`}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                            >
                              Details <IconChevronRight size={13} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tabs.Panel>
        </Tabs>

        {/* MODAL 1: CREATE ADMIN */}
        <Modal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title={<Text fw={700}>Create New Admin Account</Text>}
          centered
          radius="md"
        >
          <form onSubmit={createForm.onSubmit(handleCreateAdmin)}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="e.g. Alex Smith"
                required
                {...createForm.getInputProps("name")}
              />
              <TextInput
                label="Email Address"
                placeholder="alex@procurehub.com"
                required
                type="email"
                {...createForm.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="At least 6 characters"
                required
                {...createForm.getInputProps("password")}
              />
              <Select
                label="Assigned Role"
                data={[
                  { value: "Admin", label: "Admin" },
                  { value: "SuperAdmin", label: "SuperAdmin" },
                ]}
                {...createForm.getInputProps("role")}
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="indigo" loading={isCreating}>
                  Create Admin
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* MODAL 2: EDIT ADMIN */}
        <Modal
          opened={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
          title={<Text fw={700}>Edit Admin: {editingAdmin?.name}</Text>}
          centered
          radius="md"
        >
          <form onSubmit={editForm.onSubmit(handleEditAdmin)}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Full Name"
                required
                {...editForm.getInputProps("name")}
              />
              <TextInput
                label="Email Address"
                placeholder="Email Address"
                required
                type="email"
                {...editForm.getInputProps("email")}
              />
              <PasswordInput
                label="New Password (optional)"
                placeholder="Leave empty to keep current password"
                {...editForm.getInputProps("password")}
              />
              <Select
                label="Role"
                data={[
                  { value: "Admin", label: "Admin" },
                  { value: "SuperAdmin", label: "SuperAdmin" },
                  { value: "Vendor", label: "Vendor" },
                ]}
                {...editForm.getInputProps("role")}
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setEditingAdmin(null)}>
                  Cancel
                </Button>
                <Button type="submit" color="indigo" loading={isUpdating}>
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* MODAL 3: DELETE CONFIRMATION */}
        <Modal
          opened={!!deletingAdmin}
          onClose={() => setDeletingAdmin(null)}
          title={
            <Group gap="xs">
              <IconAlertTriangle color="red" size={20} />
              <Text fw={700} c="red">
                Confirm Admin Deletion
              </Text>
            </Group>
          }
          centered
          radius="md"
        >
          <Stack gap="md">
            <Text size="sm">
              Are you sure you want to delete admin account{" "}
              <span className="font-semibold text-white">{deletingAdmin?.name}</span> ({deletingAdmin?.email})?
              This action cannot be undone.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setDeletingAdmin(null)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteAdmin} loading={isDeleting}>
                Delete Admin
              </Button>
            </Group>
          </Stack>
        </Modal>
      </div>
    </main>
  );
}
