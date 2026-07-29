"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useCreateTenderMutation } from "@/src/store/api/tenderApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { IconArrowLeft } from "@tabler/icons-react";
import type { TenderStatus, FormState } from "@/src/types";
import { notifications } from "@mantine/notifications";

const STATUS_OPTIONS: { label: string; value: TenderStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Closed", value: "closed" },
  { label: "Awarded", value: "awarded" },
  { label: "Cancelled", value: "cancelled" },
];

export default function CreateTenderPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (user && user.role !== "Admin") router.push("/tender");
  }, [user, router]);

  const [createTender, { isLoading, error }] = useCreateTenderMutation();

  const [form, setForm] = React.useState<FormState>({
    title: "",
    name: "",
    description: "",
    status: "draft",
    closingDate: "",
    estimatedValue: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await createTender({
      title: form.title,
      name: form.name,
      description: form.description || undefined,
      status: form.status,
      closingDate: new Date(form.closingDate).toISOString(),
      estimatedValue: Number(form.estimatedValue),
    });
    if ("data" in result && result.data) {
      notifications.show({
        title: "Tender Created",
        message: `Tender has been created successfully.`,
        color: "green",
      });
      router.push(`/tender/${result.data.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-white flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex-1">
        <Link
          href="/tender"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <IconArrowLeft size={16} />
          Back to tenders
        </Link>

        <div className="bg-[#1c1a16] border border-[#2a2620] rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-[#2a2620]">
            <h1 className="text-lg font-bold text-white">Create Tender</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              A reference number will be generated automatically.
            </p>
          </div>

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
                Name{" "}
                <span className="text-xs text-gray-600 ml-1 font-normal">
                  (category / short label)
                </span>
                <span className="text-red-400"> *</span>
              </label>
              <select  onChange={handleChange} 
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

            {/* Error */}
            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5 space-y-1">
                {(() => {
                  // RTK Query wraps HTTP errors as { status, data }
                  const data = ("data" in error ? error.data : null) as {
                    message?: string | string[];
                  } | null;
                  const raw = data?.message;
                  const messages = Array.isArray(raw)
                    ? raw
                    : raw
                      ? [raw]
                      : ["Failed to create tender. Please try again."];
                  return messages.map((m, i) => <p key={i}>{m}</p>);
                })()}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/tender"
                className="flex-1 text-center py-2.5 rounded-lg border border-[#3a3630] text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create tender"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
