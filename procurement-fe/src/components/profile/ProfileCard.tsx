"use client";
import React, { useState } from "react";
import { IconEdit, IconCheck, IconX, IconShield, IconUser, IconMail, IconCalendar } from "@tabler/icons-react";
import { useUpdateUserMutation } from "@/src/store/api/userApi";
import { useDispatch } from "react-redux";
import { logIn } from "@/src/store/auth/authSlice";
import { notifications } from "@mantine/notifications";

interface User { id: number; name?: string; email?: string; role?: string; createdAt?: string; }

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[var(--text-faint)] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

export default function ProfileCard({ user }: { user: User }) {
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(user.name ?? "");

  const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  async function handleSave() {
    try {
      const updated = await updateUser({ id: user.id, name }).unwrap();
      dispatch(logIn(updated));
      notifications.show({ title: "Profile updated", message: "Your name has been updated.", color: "green" });
      setEditing(false);
    } catch {
      notifications.show({ title: "Error", message: "Failed to update profile.", color: "red" });
    }
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden mb-4">
      <div className="px-8 py-6 border-b border-[var(--border)] flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shrink-0">{initials}</div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500" />
              <button onClick={handleSave} disabled={isLoading} className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"><IconCheck size={15} /></button>
              <button onClick={() => { setEditing(false); setName(user.name ?? ""); }} className="p-1.5 rounded-md border border-[var(--border)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"><IconX size={15} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">{user.name}</h1>
              <button onClick={() => setEditing(true)} className="p-1 rounded text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors" title="Edit name"><IconEdit size={14} /></button>
            </div>
          )}
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 capitalize">
            <IconShield size={11} />{user.role}
          </span>
        </div>
      </div>
      <div className="px-8 py-6 space-y-4">
        <InfoRow icon={<IconUser size={15} />}     label="Full name"    value={user.name ?? "—"} />
        <InfoRow icon={<IconMail size={15} />}     label="Email"        value={user.email ?? "—"} />
        <InfoRow icon={<IconCalendar size={15} />} label="Member since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
      </div>
    </div>
  );
}
