/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  useUploadBidDocumentMutation,
  useGetBidDocumentsQuery,
  useDownloadDocumentQuery,
} from "@/src/store/api/bidApi";
import { useDeleteDocumentMutation } from "@/src/store/api/tenderApi";

export function useBidDocuments(bidId: number, canViewBidDocuments: boolean) {
  const [showConfirm,setShowConfirm] = useState(false);

  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);
  const [deleteDocument, { isLoading: isDeletingDocument }] =
    useDeleteDocumentMutation();
  const [uploadBidDocument, { isLoading: isUploadingDocument }] =
    useUploadBidDocumentMutation();
  const { data: bidDocuments, refetch: refetchBidDocuments } =
    useGetBidDocumentsQuery(bidId, { skip: !canViewBidDocuments });

  const handleUpload = async (file: File) => {
    try {
      await uploadBidDocument({ bidId, file }).unwrap();
      notifications.show({
        title: "Success",
        message: "Document uploaded successfully",
        color: "green",
      });
      refetchBidDocuments();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.message || "Failed to upload document",
        color: "red",
      });
    }
  };

  const handleDownload = async (docId: number) => {
    try {
      setDownloadingDocId(docId);

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/documents/${docId}/url`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to download",
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
      await deleteDocument(docId).unwrap();
      notifications.show({
        title: "Success",
        message: "Document deleted successfully",
        color: "green",
      });
      refetchBidDocuments();
      setShowConfirm(false)
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.message || "Failed to delete document",
        color: "red",
      });
    }
  };

  return {
    bidDocuments,
    downloadingDocId,
    isUploadingDocument,
    handleUpload,
    isDeletingDocument,
    showConfirm,setShowConfirm,
    handleDownload,
    handleDelete,
  };
}
