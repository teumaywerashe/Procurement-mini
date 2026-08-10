"use client";

import React from "react";
import { Modal, Group, Text, Stack, Button } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { Bid } from "@/src/types";

interface DeleteBidModalProps {
  deletingBid: Bid | null;
  onClose: () => void;
  onConfirmDelete: () => void;
  isDeletingBid: boolean;
}

export default function DeleteBidModal({
  deletingBid,
  onClose,
  onConfirmDelete,
  isDeletingBid,
}: DeleteBidModalProps) {
  return (
    <Modal
      opened={!!deletingBid}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconAlertTriangle color="red" size={20} />
          <Text fw={700} c="red">
            Confirm Bid Deletion
          </Text>
        </Group>
      }
      centered
      radius="md"
    >
      <Stack gap="md">
        <Text size="sm">
          Are you sure you want to delete your bid for tender{" "}
          <span className="font-semibold text-white">
            &quot;
            {deletingBid?.tender?.title || `Tender #${deletingBid?.tenderId}`}
            &quot;
          </span>
          ? This action cannot be undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={onConfirmDelete} loading={isDeletingBid}>
            Delete Bid
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
