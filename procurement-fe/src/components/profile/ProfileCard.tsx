/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  IconEdit,
  IconCheck,
  IconX,
  IconShield,
  IconUser,
  IconMail,
  IconCalendar,
  IconLock,
} from "@tabler/icons-react";
import { useUpdateUserMutation } from "@/src/store/api/userApi";
import { useDispatch } from "react-redux";
import { logIn } from "@/src/store/auth/authSlice";
import { notifications } from "@mantine/notifications";
import { updateUserSchema } from "@/src/lib/schemas";

import type { User } from "@/src/types";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-(--text-faint) mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] text-(--text-faint) uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm text-(--text-primary)">{value}</p>
      </div>
    </div>
  );
}

export default function ProfileCard({ user }: { user: User }) {
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  async function handleSaveName() {
    const parsed = updateUserSchema.safeParse({ name });
    if (!parsed.success) {
      setNameError(parsed.error.issues[0].message);
      return;
    }
    setNameError(null);
    try {
      const res = await updateUser({ id: user.id, name }).unwrap();
      const updatedUser = (res as any).updated ?? res;
      dispatch(logIn(updatedUser));
      notifications.show({
        title: "Profile updated",
        message: "Your name has been updated.",
        color: "green",
      });
      setEditingName(false);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update profile.",
        color: "red",
      });
    }
  }

  async function handleSavePassword() {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError(null);
    try {
      const res = await updateUser({
        id: user.id,
        password: newPassword,
      }).unwrap();
      const updatedUser = (res as any).updated ?? res;
      dispatch(logIn(updatedUser));
      notifications.show({
        title: "Password updated",
        message: "Your password has been changed.",
        color: "green",
      });
      setEditingPassword(false);
      setNewPassword("");
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Failed to update password.",
        color: "red",
      });
    }
  }

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden mb-4">
      <div className="px-8 py-6 border-b border-(--border) flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(null);
                  }}
                  autoFocus
                  className={`flex-1 bg-(--bg-input) border rounded-lg px-3 py-1.5 text-sm text-(--text-primary) outline-none focus:border-indigo-500 ${nameError ? "border-red-500" : "border-(--border-strong)"}`}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isLoading}
                  className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
                >
                  <IconCheck size={15} />
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setName(user.name ?? "");
                    setNameError(null);
                  }}
                  className="p-1.5 rounded-md border border-(--border) text-(--text-subtle) hover:text-(--text-primary) transition-colors"
                >
                  <IconX size={15} />
                </button>
              </div>
              {nameError && <p className="text-xs text-red-400">{nameError}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-(--text-primary)">
                {user.name}
              </h1>
              <button
                onClick={() => setEditingName(true)}
                className="p-1 cursor-pointer rounded text-(--text-faint) hover:text-(--text-primary) transition-colors"
                title="Edit name"
              >
                <IconEdit size={14} />
              </button>
            </div>
          )}
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 capitalize">
            <IconShield size={11} />
            {user.role}
          </span>
        </div>
      </div>
      <div className="px-8 py-6 space-y-6">
        <InfoRow
          icon={<IconUser size={15} />}
          label="Full name"
          value={user.name ?? "—"}
        />
        <InfoRow
          icon={<IconMail size={15} />}
          label="Email"
          value={user.email ?? "—"}
        />
        <InfoRow
          icon={<IconCalendar size={15} />}
          label="Member since"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"
          }
        />

        {/* Password Change Section */}
        <div className="pt-6 border-t border-(--border)">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
              <IconLock size={16} /> Change Password
            </h3>
            {!editingPassword ? (
              <button
                onClick={() => setEditingPassword(true)}
                className="text-xs cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Update Password
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingPassword(false);
                  setNewPassword("");
                  setPasswordError(null);
                }}
                className="text-xs text-(--text-subtle) hover:text-(--text-primary)"
              >
                Cancel
              </button>
            )}
          </div>

          {editingPassword ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(null);
                }}
                className={`w-full bg-(--bg-input) border rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-indigo-500 ${passwordError ? "border-red-500" : "border-(--border-strong)"}`}
              />
              {passwordError && (
                <p className="text-xs text-red-400">{passwordError}</p>
              )}
              <button
                onClick={handleSavePassword}
                disabled={isLoading || !newPassword}
                className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save New Password
              </button>
            </div>
          ) : (
            <p className="text-xs text-(--text-faint)">
              Click &#34;Update Password&#34; to change your account password.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
