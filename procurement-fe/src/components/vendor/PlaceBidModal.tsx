"use client";

import React from "react";
import { Modal, Text, Stack, NumberInput, Textarea, Group, Button, FileInput } from "@mantine/core";
import { IconCurrencyDollar, IconFileText } from "@tabler/icons-react";
import type { Tender } from "@/src/types";

interface PlaceBidModalProps {
  biddingTender: Tender | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  bidAmount: number | string;
  onBidAmountChange: (val: number | string) => void;
  isCreatingBid: boolean;
  uploadedDocument: File | null;
  setUploadedDocument: (file: File | null) => void;
}

export default function PlaceBidModal({
  biddingTender,
  onClose,
  onSubmit,
  bidAmount,
  onBidAmountChange,
  isCreatingBid,
  uploadedDocument,
  setUploadedDocument,
}: PlaceBidModalProps) {
  return (
    <Modal
      opened={!!biddingTender}
      onClose={onClose}
      title={<Text fw={700}>Submit Bid for &quot;{biddingTender?.title}&quot;</Text>}
      centered
      radius="md"
    >
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            Reference: {biddingTender?.referenceNumber} · Estimated Value: $
            {Number(biddingTender?.estimatedValue || 0).toLocaleString()}
          </Text>

          <NumberInput
            label="Your Proposed Bid Price ($)"
            placeholder="Enter bid amount"
            required
            min={1}
            value={bidAmount}
            onChange={onBidAmountChange}
            leftSection={<IconCurrencyDollar size={16} />}
          />

          {/* Document Upload */}
          <div>
            <FileInput
              label="Upload Supporting Document (Optional)"
              placeholder="Select a document to upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              leftSection={<IconFileText size={18} />}
              onChange={(file) => setUploadedDocument(file)}
            />
            {uploadedDocument && (
              <div className="mt-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-3 py-2 flex items-center gap-2">
                <IconFileText size={14} />
                <span className="truncate max-w-[200px]">{uploadedDocument.name}</span>
              </div>
            )}
          </div>

          <Group justify="flex-end" mt="md">
            <Button disabled={isCreatingBid} variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isCreatingBid} color="green" type="submit" loading={isCreatingBid}>
              Submit Proposal
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
