import React, { useState } from "react";
import { User } from "@/src/types";
import { Button, Select, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconShieldCheck, IconTrash } from "@tabler/icons-react";
import {
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/src/store/api/userApi";

interface UsersTableProps {
  users: User[];
  usersLoading: boolean;
  userSearch: string;
  setUserSearch: (search: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
}

export function UsersTable({
  users,
  usersLoading,
  userSearch,
  setUserSearch,
  roleFilter,
  setRoleFilter,
}: UsersTableProps) {
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User>({
    name: "",
    email: "",
    id: 0,
    role: "Vendor",
    createdAt: "",
  });
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (user: User, newRole: string | null) => {
    if (!newRole || newRole === user.role) return;

    setUpdatingId(user.id);
    try {
      await updateUserRole({ id: user.id, role: newRole }).unwrap();
      notifications.show({
        title: "Success",
        message: `Role for user "${user.name}" successfully updated to ${newRole}.`,
        color: "green",
      });
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message:
          err instanceof Error ? err.message : "Failed to update user role",
        color: "red",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    setDeletingId(user.id);
    try {
      await deleteUser(user.id).unwrap();
      notifications.show({
        title: "User deleted",
        message: `User "${user.name}" was deleted successfully.`,
        color: "green",
      });
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Failed to delete user",
        color: "red",
      });
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
              <IconTrash size={18} className="text-red-400" />
            </div>
            <h3 className="font-semibold text-(--text-primary) text-base">
              Delete User?
            </h3>
          </div>
          <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
            This will permanently delete{" "}
            <span className="text-red-400 font-bold">
             user {deletingUser.name}
            </span>
            . This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className="flex-1 py-2.5 cursor-pointer rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={() => {
                handleDeleteUser(deletingUser);
                // setShowConfirm(false);
              }}
              disabled={isLoading}
              loading={isLoading}
              color="red"
              className="flex-1 py-2.5 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
             Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-(--text-primary)">
              All Registered System Users
            </h2>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 flex items-center gap-1">
              <IconShieldCheck size={12} /> SuperAdmin Editable Roles
            </span>
          </div>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            View active user accounts and change their assigned roles directly.
            Only SuperAdmin can modify user roles.
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

      {/* Users Table Content */}
      {usersLoading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-(--bg-elevated) rounded-lg animate-pulse"
            />
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
                <th className="px-6 py-3.5">Assigned Role (Editable)</th>
                <th className="px-6 py-3.5">Registered Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-(--bg-elevated) transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-(--text-faint)">
                    #{u.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-(--text-primary)">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 text-(--text-subtle)">{u.email}</td>
                  <td className="px-6 py-4">
                    {updatingId === u.id ? (
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium py-1">
                        <Loader size="xs" color="indigo" />
                        <span>Updating role...</span>
                      </div>
                    ) : (
                      <Select
                        size="xs"
                        value={u.role}
                        onChange={(v) => handleRoleChange(u, v)}
                        data={[
                          { value: "SuperAdmin", label: "SuperAdmin" },
                          { value: "Admin", label: "Admin" },
                          { value: "Vendor", label: "Vendor" },
                        ]}
                        className="w-36"
                        variant="filled"
                        styles={{
                          input: {
                            backgroundColor:
                              u.role === "SuperAdmin"
                                ? "rgba(127, 29, 29, 5)"
                                : u.role === "Admin"
                                  ? "rgba(49, 46, 129, 5)"
                                  : "rgba(6, 78, 59, 5)",
                            color:
                              u.role === "SuperAdmin"
                                ? "#f87171"
                                : u.role === "Admin"
                                  ? "#818cf8"
                                  : "#34d399",
                            borderColor:
                              u.role === "SuperAdmin"
                                ? "rgba(239, 68, 68, 0.3)"
                                : u.role === "Admin"
                                  ? "rgba(99, 102, 241, 1)"
                                  : "rgba(16, 185, 129, 0)",
                            fontWeight: 600,
                            fontSize: "11px",
                            borderRadius: "9999px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                          },
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-(--text-faint)">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="compact-xs"
                      color="red"
                      variant="light"
                      leftSection={<IconTrash size={12} />}
                      loading={deletingId === u.id}
                      onClick={() => {
                        setDeletingUser(u);
                        setShowConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersTable;
