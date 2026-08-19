/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import {
  useCreateTenderMutation,
  useUploadTenderDocumentMutation,
} from "@/src/store/api/tenderApi";
import { IconArrowLeft, IconFileText } from "@tabler/icons-react";
import type { FormState } from "@/src/types";
import { notifications } from "@mantine/notifications";
import { FileInput, Text, Stack } from "@mantine/core";
import TenderFormFields from "@/src/components/shared/TenderFormFields";
import { tenderSchema } from "@/src/lib/schemas";

export default function CreateTenderPage() {
  const router = useRouter();

  const [createTender, { isLoading, error }] = useCreateTenderMutation();
  const [uploadDocument, { isLoading: isUploadingDocument }] =
    useUploadTenderDocumentMutation();
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
  const [uploadedDocument, setUploadedDocument] = React.useState<any>(null);
  const [isSuccessState, setIsSuccessState] = React.useState(false);

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

    // First create the tender
    const createResult = await createTender({
      title: parsed.data.title,
      name: parsed.data.name,
      description: parsed.data.description || undefined,
      status: parsed.data.status,
      closingDate: new Date(parsed.data.closingDate),
      estimatedValue: Number(parsed.data.estimatedValue),
    });

    if (!("data" in createResult) || !createResult.data) {
      if ("error" in createResult) {
        const err = createResult.error as any;
        const msgs = Array.isArray(err?.data?.message)
          ? err.data.message.map(String)
          : typeof err?.data?.message === "string"
            ? [err.data.message]
            : ["Failed to create tender."];
        setFormErrors({ _form: msgs[0] });
      }
      return;
    }

    // Then upload document if provided
    const tenderId = createResult.data.id;
    if (uploadedDocument) {
      try {
        await uploadDocument({
          tenderId,
          file: uploadedDocument,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Document uploaded successfully",
          color: "green",
        });
      } catch (uploadError: any) {
        notifications.show({
          title: "Warning",
          message:
            "Tender created but document upload failed: " +
            (uploadError?.data?.message || "Unknown error"),
          color: "orange",
        });
      }
    }

    notifications.show({
      title: "Tender Created",
      message: "Tender has been created successfully.",
      color: "green",
    });
    router.push(`/tenders/${tenderId}`);
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

            {/* Document Upload */}
            <div className="pt-4 border-t border-(--border)">
              <Text size="sm" fw={500} mb="sm">
                Upload Supporting Document (Optional)
              </Text>
              <FileInput
                label="Tender Document"
                placeholder="Select a document to upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                leftSection={<IconFileText size={18} />}
                disabled={isLoading || isUploadingDocument}
                onChange={(file) => {
                  if (file) {
                    setUploadedDocument(file);
                    setIsSuccessState(false);
                  }
                }}
              />
              {uploadedDocument && (
                <div className="mt-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-3 py-2 flex items-center gap-2">
                  <IconFileText size={14} />
                  <span className="truncate max-w-[200px]">
                    {uploadedDocument.name}
                  </span>
                </div>
              )}
            </div>

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
