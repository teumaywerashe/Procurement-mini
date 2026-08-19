/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FileInput, Text, Stack, Button, Group } from "@mantine/core";
import { IconFileText, IconTrash } from "@tabler/icons-react";

interface BidDocumentSectionProps {
  bidStatus: string;
  isOwnBid: boolean;
  bidDocuments?: any[];
  isUploadingDocument: boolean;
  isDeleting: boolean;
  onUploadDocument: (file: File) => void;
  onDownloadDocument: (docId: number) => void;
  onDeleteDocument: (docId: number) => void;
  downloadingDocId: number | null;
  showConfirm:boolean,
  setShowConfirm:(value: boolean) => void;
}

export function BidDocumentSection({
  bidStatus,
  isOwnBid,
  bidDocuments,
  isUploadingDocument,
  isDeleting,
  onUploadDocument,
  showConfirm,
  setShowConfirm,
  onDownloadDocument,
  onDeleteDocument,
  downloadingDocId,
}: BidDocumentSectionProps) {
  const [deletingDocId, setDeletingDocId] = useState<number>(0);

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
              <IconTrash size={18} className="text-red-400" />
            </div>
            <h3 className="font-semibold text-(--text-primary) text-base">
              Delete Document?
            </h3>
          </div>
          <p className="text-sm text-(--text-subtle) mb-5 leading-relaxed">
            This will permanently delete{" "}
            <span className="text-(--text-primary) font-medium">
              this document
            </span>
            . This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="flex-1 py-2.5 cursor-pointer rounded-lg border border-(--border-strong) text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDeleteDocument(deletingDocId);
                // setShowConfirm(false);
              }}
              disabled={isDeleting}
              className="flex-1 py-2.5 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <Text size="sm" fw={500} mb="sm">
        Bid Documents
      </Text>
      <Stack gap="md">
        {isOwnBid && bidStatus === "pending" && (
          <FileInput
            label={isUploadingDocument ? "Uploading..." : "Upload Document"}
            placeholder="Select a document to upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            leftSection={<IconFileText size={18} />}
            disabled={isUploadingDocument}
            onChange={(file) => {
              if (file) onUploadDocument(file);
            }}
          />
        )}

        {bidDocuments && bidDocuments.length > 0 ? (
          <div className="space-y-3">
            {bidDocuments.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-(--bg-surface) border border-(--border) rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-(--bg-elevated) flex items-center justify-center text-xl shrink-0">
                    {doc.mimeType?.includes("pdf")
                      ? "📄"
                      : doc.mimeType?.includes("word")
                        ? "📝"
                        : "📊"}
                  </div>
                  <Stack gap="2" className="min-w-0">
                    <Text fw={500} className="truncate max-w-50">
                      {doc.fileName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {doc.fileSize < 1024
                        ? `${doc.fileSize} B`
                        : doc.fileSize < 1024 * 1024
                          ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                          : `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                    </Text>
                  </Stack>
                </div>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="default"
                    loading={downloadingDocId === doc.id}
                    disabled={downloadingDocId === doc.id}
                    onClick={() => onDownloadDocument(doc.id)}
                  >
                    View File
                  </Button>
                  {isOwnBid && (
                    <button
                      // size="xs"
                      color="red"
                      className="flex-1 cursor-pointer w-20 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors disabled:opacity-50"
                      onClick={() => {
                        setShowConfirm(true);
                        setDeletingDocId(doc.id);
                      }}
                      disabled={isUploadingDocument}
                    >
                      Delete
                    </button>
                  )}
                </Group>
              </div>
            ))}
          </div>
        ) : (
          !isOwnBid && (
            <Text size="xs" c="dimmed">
              No documents attached to this bid.
            </Text>
          )
        )}
      </Stack>
    </div>
  );
}
