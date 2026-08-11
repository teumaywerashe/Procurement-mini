import React from "react";
import { User } from "@/src/types";
import {
  Select,
  Group,
  ActionIcon,
  Button,
  Tooltip,
  Modal,
  Stack,
  Text,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconAlertTriangle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

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
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-(--border) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-(--text-primary)">
            All Registered System Users
          </h2>
          <p className="text-xs text-(--text-subtle) mt-0.5">
            View active system user accounts, their assigned roles, and
            registered emails.
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
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Registered Date</th>
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
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        u.role === "SuperAdmin"
                          ? "bg-red-950/80 text-red-400"
                          : u.role === "Admin"
                            ? "bg-indigo-950/80 text-indigo-400"
                            : "bg-emerald-950/80 text-emerald-400"
                      }`}
                    >
                      {u.role}
                    </span>
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
  );
}

export default UsersTable;
