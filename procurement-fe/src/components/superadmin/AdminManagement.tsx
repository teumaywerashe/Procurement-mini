/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { User } from "@/src/types";
import { Button, Group, ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

interface AdminManagementProps {
  admins: User[];
  usersLoading: boolean;
  userSearch: string;
  setUserSearch: (search: string) => void;
  totalAdmins: number;
  onAddAdmin: () => void;
  onEditRole: (admin: User) => void;
  onDeleteAdmin: (admin: User) => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  editingAdmin: User | null;
  setEditingAdmin: (admin: User | null) => void;
  deletingAdmin: User | null;
  setDeletingAdmin: (admin: User | null) => void;
  createForm: any;
  editForm: any;
  handleCreateAdmin: (values: any) => Promise<void>;
  handleEditAdminRole: (values: any) => Promise<void>;
  handleDeleteAdmin: () => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function AdminManagement({
  admins,
  usersLoading,
  userSearch,
  setUserSearch,

  onAddAdmin,
  onEditRole,
  onDeleteAdmin,
}: AdminManagementProps) {
  return (
    <div className="space-y-4">
      {/* Admin Table Section */}
      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-(--text-primary)">
              Admin Accounts Management
            </h2>
            <p className="text-xs text-(--text-subtle) mt-0.5">
              SuperAdmin privileges: Create new admin accounts and assign roles
              only. Admin names, emails, and passwords cannot be edited here.
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
              onClick={onAddAdmin}
            >
              Add Admin
            </Button>
          </div>
        </div>

        {usersLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-sm text-(--text-subtle)">
            No Admin accounts found. Click Add Admin to create one.
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
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-(--bg-elevated) transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-(--text-faint)">
                      #{admin.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-(--text-primary)">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-(--text-subtle)">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-5 py-2 text-[11px] font-semibold rounded-sm bg-indigo-950/80 text-indigo-100">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-(--text-faint)">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Group justify="flex-end" gap="xs">
                        <Tooltip label="Edit Role Only">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => onEditRole(admin)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Admin">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => onDeleteAdmin(admin)}
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
    </div>
  );
}

export default AdminManagement;
