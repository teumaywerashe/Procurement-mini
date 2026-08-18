/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { FileInput, Text, Stack, Button, Group } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";

interface BidDocumentSectionProps {
  bidStatus: string;
  isOwnBid: boolean;
  bidDocuments?: any[];
  isUploadingDocument: boolean;
  onUploadDocument: (file: File) => void;
  onDownloadDocument: (docId: number) => void;
  onDeleteDocument: (docId: number) => void;
  downloadingDocId: number | null;
}

export function BidDocumentSection({
  bidStatus,
  isOwnBid,
  bidDocuments,
  isUploadingDocument,
  onUploadDocument,
  onDownloadDocument,
  onDeleteDocument,
  downloadingDocId,
}: BidDocumentSectionProps) {
  return (
    <div className="mt-6">
      <Text size="sm" fw={500} mb="sm">
        Bid Documents
      </Text>
      <Stack gap="md">
        {isOwnBid && bidStatus === "pending" && (
          <FileInput
            label="Upload Document"
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
                    <Button
                      size="xs"
                      color="red"
                      variant="default"
                      onClick={() => onDeleteDocument(doc.id)}
                      disabled={isUploadingDocument}
                    >
                      Delete
                    </Button>
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
