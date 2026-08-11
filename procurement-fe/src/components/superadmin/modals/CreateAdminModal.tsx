import React from "react";
import {
  Modal,
  Button,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Select,
  Group,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface CreateAdminModalProps {
  opened: boolean;
  onClose: () => void;
  createForm: any;
  handleCreateAdmin: (values: any) => Promise<void>;
  isCreating: boolean;
}

export function CreateAdminModal({
  opened,
  onClose,
  createForm,
  handleCreateAdmin,
  isCreating,
}: CreateAdminModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700}>
          <IconPlus size={20} className="inline mr-2" />
          Create New Admin Account
        </Text>
      }
      centered
      radius="md"
    >
      <form onSubmit={createForm.onSubmit(handleCreateAdmin)}>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="e.g. Alex Smith"
            required
            {...createForm.getInputProps("name")}
          />
          <TextInput
            label="Email Address"
            placeholder="alex@procurehub.com"
            required
            type="email"
            {...createForm.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            required
            {...createForm.getInputProps("password")}
          />
          <Select
            label="Assigned Role"
            data={[
              { value: "Admin", label: "Admin" },
              { value: "SuperAdmin", label: "SuperAdmin" },
            ]}
            {...createForm.getInputProps("role")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="indigo" loading={isCreating}>
              Create Admin
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default CreateAdminModal;
