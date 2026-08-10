"use client";

import React from "react";
import { Modal, Text, Stack, NumberInput, Textarea, Group, Button } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import type { Tender } from "@/src/types";

interface PlaceBidModalProps {
  biddingTender: Tender | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  bidAmount: number | string;
  onBidAmountChange: (val: number | string) => void;
  bidNotes: string;
  onBidNotesChange: (val: string) => void;
  isCreatingBid: boolean;
}

export default function PlaceBidModal({
  biddingTender,
  onClose,
  onSubmit,
  bidAmount,
  onBidAmountChange,
  bidNotes,
  onBidNotesChange,
  isCreatingBid,
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

          <Textarea
            label="Proposal Notes / Pitch (Optional)"
            placeholder="Detail your capability, timeline, or scope specifications..."
            rows={3}
            value={bidNotes}
            onChange={(e) => onBidNotesChange(e.target.value)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button color="emerald" type="submit" loading={isCreatingBid}>
              Submit Proposal
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
