"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import {
  useGetTenderQuery,
  useUpdateTenderMutation,
} from "@/src/store/api/tenderApi";
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import type { Tender, FormState } from "@/src/types";
import { notifications } from "@mantine/notifications";
import TenderFormFields from "@/src/components/shared/TenderFormFields";
import { tenderSchema } from "@/src/lib/schemas";

function toFormState(tender: Tender): FormState {
  const d = new Date(tender.closingDate);
  // datetime-local input requires "YYYY-MM-DDTHH:mm"
  const closingDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return {
    title: tender.title,
    name: tender.name,
    description: tender.description ?? "",
    status: tender.status,
    closingDate,
    estimatedValue: String(tender.estimatedValue),
  };
}

function EditForm({
  tender,
  onSaved,
}: {
  tender: Tender;
  onSaved: () => void;
}) {
  const [updateTender, { isLoading, error }] = useUpdateTenderMutation();
  const [form, setForm] = React.useState<FormState>(() => toFormState(tender));
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    try {
      await updateTender({
        id: tender.id,
        title: parsed.data.title,
        name: parsed.data.name,
        description: parsed.data.description || undefined,
        status: parsed.data.status,
        closingDate: new Date(parsed.data.closingDate),
        estimatedValue: Number(parsed.data.estimatedValue),
      }).unwrap();
      notifications.show({
        title: "Tender updated",
        message: "Tender updated successfully.",
        color: "green",
      });
      onSaved();
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update tender.",
        color: "red",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
      <TenderFormFields
        form={form}
        onChange={handleChange}
        errors={formErrors}
      />
      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5">
          Failed to update tender.
        </p>
      )}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href={`/tender/${tender.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditTenderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // const user = useSelector((s: RootState) => s.auth.user);

  const { data: tender, isLoading } = useGetTenderQuery(Number(id));

  if (isLoading)
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-(--text-subtle) text-sm mt-14">
          Loading...
        </div>
      </div>
    );

  if (!tender)
    return (
      <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-sm mt-14">
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

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-6 py-8 mt-14 flex-1">
        <Link
          href={`/tender/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors mb-6"
        >
          <IconArrowLeft size={16} /> Back to tender
        </Link>
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-(--border)">
            <h1 className="text-lg font-bold text-(--text-primary)">
              Edit Tender
            </h1>
            <p className="text-xs text-(--text-subtle) mt-0.5">
              {tender.referenceNumber}
            </p>
          </div>
          <EditForm
            tender={tender}
            onSaved={() => router.push(`/tender/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
