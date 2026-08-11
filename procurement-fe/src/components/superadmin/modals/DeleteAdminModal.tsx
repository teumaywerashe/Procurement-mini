import React from "react";
import { Modal, Button, Stack, Text, Group } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { User } from "@/src/types";

interface DeleteAdminModalProps {
  opened: boolean;
  onClose: () => void;
  admin: User | null;
  handleDeleteAdmin: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteAdminModal({
  opened,
  onClose,
  admin,
  handleDeleteAdmin,
  isDeleting,
}: DeleteAdminModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconAlertTriangle color="red" size={20} />
          <Text fw={700} c="red">
            Confirm Admin Deletion
          </Text>
        </Group>
      }
      centered
      radius="md"
    >
      <Stack gap="md">
        <Text size="sm">
          Are you sure you want to delete admin account{" "}
          <span className="font-semibold text-white">{admin?.name}</span> (
          {admin?.email})? This action cannot be undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteAdmin} loading={isDeleting}>
            Delete Admin
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DeleteAdminModal;
