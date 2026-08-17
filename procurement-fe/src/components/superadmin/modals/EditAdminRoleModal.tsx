/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Button, Stack, Text, Select, Group } from "@mantine/core";
import { User } from "@/src/types";

interface EditAdminRoleModalProps {
  opened: boolean;
  onClose: () => void;
  admin: User | null;
  editForm: any;
  handleEditAdminRole: (values: any) => Promise<void>;
  isUpdating: boolean;
}

export function EditAdminRoleModal({
  opened,
  onClose,
  admin,
  editForm,
  handleEditAdminRole,
  isUpdating,
}: EditAdminRoleModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Update Admin Role: {admin?.name}</Text>}
      centered
      radius="md"
    >
      <form onSubmit={editForm.onSubmit(handleEditAdminRole)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Admin: <strong>{admin?.name}</strong> ({admin?.email})
          </Text>
          <Select
            label="Role"
            description="Only the role can be updated. Admins can change their own name and password via their profile page."
            data={[
              { value: "Admin", label: "Admin" },
              { value: "SuperAdmin", label: "SuperAdmin" },
              { value: "Vendor", label: "Vendor" },
            ]}
            {...editForm.getInputProps("role")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="indigo" loading={isUpdating}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default EditAdminRoleModal;
