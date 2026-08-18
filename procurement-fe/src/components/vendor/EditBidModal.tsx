"use client";

import React from "react";
import { Modal, Text, Stack, NumberInput, Group, Button } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import type { Bid } from "@/src/types";
import { useDeleteBidMutation } from "@/src/store/api/bidApi";
import { notifications } from "@mantine/notifications";

interface EditBidModalProps {
  editingBid: Bid | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  bidAmount: number | string;
  onBidAmountChange: (val: number | string) => void;
  isUpdatingBid: boolean;
}

export default function EditBidModal({
  editingBid,
  onClose,
  onSubmit,
  bidAmount,
  onBidAmountChange,
  isUpdatingBid,
}: EditBidModalProps) {
  const [deleteBid, { isLoading: isDeletingBid }] = useDeleteBidMutation();
  return (
    <Modal
      opened={!!editingBid}
      onClose={onClose}
      title={
        <Text fw={700}>
          Edit Bid — {editingBid?.referenceNumber || `#BID-${editingBid?.id}`}
        </Text>
      }
      centered
      radius="md"
    >
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            Tender:{" "}
            {editingBid?.tender?.title || `Tender #${editingBid?.tenderId}`}
          </Text>

          <NumberInput
            label="Updated Proposed Price ($)"
            placeholder="Enter updated amount"
            required
            min={1}
            value={bidAmount}
            onChange={onBidAmountChange}
            leftSection={<IconCurrencyDollar size={16} />}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteBid(editingBid?.id as number);

                notifications.show({
                  title: "Bid Deleted",color: "red",
                  message: "Bid deleted successfully",
                });
                onClose();
              }}
              color="red"
              loading={isDeletingBid}
            >
              discard
            </Button>
            <Button color="indigo" type="submit" loading={isUpdatingBid}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
