import React, { useState } from "react";
import { Group, Text, Stack, Button, ActionIcon, Badge } from "@mantine/core";
import { IconDownload, IconTrash, IconFileText } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import type { Document } from "@/src/types";

interface DocumentListProps {
  documents: Document[];
  canDelete?: boolean;
  onDelete?: (docId: number) => Promise<void> | void;
  showUploadSection?: boolean;
  onUploadClick?: () => void;
  uploadButton?: React.ReactNode;
  tenderId?: number;
  tenderOwnerId?: number;
  bidId?: number;
  isUploading?: boolean;
}

export default function DocumentList({
  documents,
  canDelete = false,
  onDelete,
  showUploadSection = false,
  onUploadClick,
  uploadButton,
  tenderOwnerId,
  isUploading,
}: DocumentListProps) {
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdminOwner =
    user?.role === "Admin" &&
    (tenderOwnerId === undefined || user?.id === tenderOwnerId);
  const canShowUpload = showUploadSection && isAdminOwner;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMimeIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || mimeType.includes("doc")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("csv")) return "📊";
    return "📄";
  };

  const handleDownload = async (doc: Document) => {
    try {
      setDownloadingDocId(doc.id);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/documents/${doc.id}/url`, {
        credentials: "include",
      });
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to generate download URL",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to download document",
        color: "red",
      });
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      await onDelete?.(docId);
      notifications.show({
        title: "Success",
        message: "Document deleted successfully",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete document",
        color: "red",
      });
    }
  };

  return (
    <Stack gap="md">
      {canShowUpload && (
        <div className="flex items-center gap-3 p-4 border border-dashed border-(--border) rounded-xl bg-(--bg-elevated)">
          {uploadButton ? (
            uploadButton
          ) : (
            <Button
              onClick={onUploadClick}
              disabled={isUploading}
              loading={isUploading}
              variant="default"
              className="flex items-center gap-2"
            >
              <IconFileText size={18} />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          )}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 text-(--text-subtle)">
          <IconFileText size={48} className="mx-auto mb-3 opacity-30" />
          <Text size="sm">No documents uploaded yet</Text>
        </div>
      ) : (
        <Stack gap="sm">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-(--bg-surface) border border-(--border) rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-(--bg-elevated) flex items-center justify-center text-2xl shrink-0">
                  {getMimeIcon(doc.mimeType)}
                </div>
                <Stack gap="2" className="min-w-0">
                  <Text fw={500} className="truncate max-w-[250px]">
                    {doc.fileName}
                  </Text>
                  <Group gap="md" className="text-xs text-(--text-subtle)">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <Badge variant="light" size="xs">
                      {doc.mimeType.split("/")[1] || "file"}
                    </Badge>
                    {doc.uploadedByUser && (
                      <span>
                        by {doc.uploadedByUser.name || `User #${doc.uploadedBy}`}
                      </span>
                    )}
                    <span>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </Group>
                </Stack>
              </div>
              <Group gap="xs">
                <Button
                  size="xs"
                  variant="default"
                  leftSection={<IconDownload size={14} />}
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingDocId === doc.id}
                  loading={downloadingDocId === doc.id}
                >
                  Download
                </Button>
                {canDelete && onDelete && (
                  <ActionIcon
                    size="xs"
                    color="red"
                    variant="default"
                    onClick={() => handleDelete(doc.id)}
                    disabled={isUploading}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                )}
              </Group>
            </div>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
