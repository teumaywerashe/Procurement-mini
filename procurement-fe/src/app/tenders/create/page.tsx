"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import { useCreateTenderMutation } from "@/src/store/api/tenderApi";
import { IconArrowLeft } from "@tabler/icons-react";
import type { FormState } from "@/src/types";
import { notifications } from "@mantine/notifications";
import TenderFormFields from "@/src/components/shared/TenderFormFields";
import { tenderSchema } from "@/src/lib/schemas";

export default function CreateTenderPage() {
  const router = useRouter();

  const [createTender, { isLoading, error }] = useCreateTenderMutation();
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [form, setForm] = React.useState<FormState>({
    title: "",
    name: "Infrastructure",
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
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = tenderSchema.safeParse({
      ...form,
      closingDate: form.closingDate
        ? new Date(form.closingDate).toISOString()
        : "",
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const result = await createTender({
      title: parsed.data.title,
      name: parsed.data.name,
      description: parsed.data.description || undefined,
      status: parsed.data.status,
      closingDate: new Date(parsed.data.closingDate),
      estimatedValue: Number(parsed.data.estimatedValue),
    });
    if ("data" in result && result.data) {
      notifications.show({
        title: "Tender Created",
        message: "Tender has been created successfully.",
        color: "green",
      });
      router.push(`/tenders/${result.data.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-6 py-8 mt-14 flex-1">
        <Link
          href="/tenders"
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={16} /> Back to tenders
        </Link>
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-(--border)">
            <h1 className="text-lg font-bold text-(--text-primary)">
              Create Tender
            </h1>
            <p className="text-xs text-(--text-subtle) mt-0.5">
              A reference number will be generated automatically.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            <TenderFormFields
              form={form}
              onChange={handleChange}
              errors={formErrors}
            />
            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5">
                {(() => {
                  const data = ("data" in error ? error.data : null) as {
                    message?: unknown;
                  } | null;
                  const raw = data?.message;
                  const msgs = Array.isArray(raw)
                    ? raw.map(String)
                    : typeof raw === "string"
                      ? [raw]
                      : ["Failed to create tender."];
                  return msgs.map((m, i) => <p key={i}>{m}</p>);
                })()}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/tenders"
                className="flex-1 text-center py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) hover:border-(--border-strong) transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
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
