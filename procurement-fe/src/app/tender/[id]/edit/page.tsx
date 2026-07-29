"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetTenderQuery,
  useUpdateTenderMutation,
} from "@/src/store/api/tenderApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import type { Tender, TenderStatus } from "@/src/types";
import type { FormState } from "@/src/types";
import { notifications } from "@mantine/notifications";

const STATUS_OPTIONS: { label: string; value: TenderStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Closed", value: "closed" },
  { label: "Awarded", value: "awarded" },
  { label: "Cancelled", value: "cancelled" },
];

function toFormState(tender: Tender): FormState {
  return {
    title: tender.title,
    name: tender.name,
    description: tender.description ?? "",
    status: tender.status,
    closingDate: tender.closingDate
      ? new Date(tender.closingDate).toISOString().slice(0, 16)
      : "",
    estimatedValue: String(tender.estimatedValue),
  };
}

// Inner component — mounts only after tender is loaded, so initial state is correct
function EditForm({
  tender,
  onSaved,
}: {
  tender: Tender;
  onSaved: () => void;
}) {
  const [updateTender, { isLoading: isSaving, error }] =
    useUpdateTenderMutation();
  const [form, setForm] = React.useState<FormState>(() => toFormState(tender));

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateTender({
        id: tender.id,
        title: form.title,
        name: form.name,
        description: form.description || undefined,
        status: form.status,
        closingDate: new Date(form.closingDate).toISOString(),
        estimatedValue: Number(form.estimatedValue),
      }).unwrap();

      notifications.show({
        title: "tender updated",
        message: "tender updated successfully",
        color: "green",
      });
      onSaved();
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Failed to update tender. Please try again.",
        color: "red",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Construction of New Office Building"
          className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Name <span className="text-red-400">*</span>
        </label>
        <select
          onChange={handleChange}
          className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
          name="name"
          value={form.name}
          id=""
        >
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="Infrastructure"
          >
            Infrastructure
          </option>
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="Logistic"
          >
            Logistic
          </option>
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="Education"
          >
            Education
          </option>
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="HealthCare"
          >
            HealthCare
          </option>
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="Technology"
          >
            Technology
          </option>
          <option
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
            value="Environment"
          >
            Environment
          </option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the tender scope and requirements..."
          className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Closing Date + Estimated Value */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Closing Date <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            name="closingDate"
            value={form.closingDate}
            onChange={handleChange}
            required
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Estimated Value ($) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="estimatedValue"
            value={form.estimatedValue}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
            placeholder="e.g. 1000000"
            className="w-full bg-[#14120e] border border-[#3a3630] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5">
          Failed to update tender. Please try again.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Link
          href={`/tender/${tender.id}`}
          className="flex-1 text-center cursor-pointer py-2.5 rounded-lg border border-[#3a3630] text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 py-2.5 rounded-lg  cursor-pointer bg-indigo-600 hover:bg-indigo-900 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditTenderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (user && user.role !== "admin") router.push(`/tender/${id}`);
  }, [user, id, router]);

  const { data: tender, isLoading } = useGetTenderQuery(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-sm">
          <IconAlertTriangle size={40} className="text-red-400" />
          <p className="text-red-400">Tender not found.</p>
          <Link
            href="/tender"
            className="text-indigo-400 hover:text-indigo-300"
          >
            ← Back to tenders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex-1">
        <Link
          href={`/tender/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <IconArrowLeft size={16} />
          Back to tender
        </Link>

        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-[#2a2620]">
            <h1 className="text-lg font-bold text-white">Edit Tender</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {tender.referenceNumber}
            </p>
          </div>

          {/* EditForm mounts with tender data as initial state — no effect needed */}
          <EditForm
            tender={tender}
            onSaved={() => router.push(`/tender/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
