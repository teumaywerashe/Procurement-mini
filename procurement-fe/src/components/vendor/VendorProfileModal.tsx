"use client";

import React from "react";
import { Modal, Text, Stack, TextInput, Group, Button } from "@mantine/core";

interface VendorProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  vendorName: string;
  onVendorNameChange: (val: string) => void;
  vendorRegNo: string;
  onVendorRegNoChange: (val: string) => void;
  vendorEmail: string;
  onVendorEmailChange: (val: string) => void;
  vendorPhone: string;
  onVendorPhoneChange: (val: string) => void;
  isCreatingVendor: boolean;
}

export default function VendorProfileModal({
  opened,
  onClose,
  onSubmit,
  vendorName,
  onVendorNameChange,
  vendorRegNo,
  onVendorRegNoChange,
  vendorEmail,
  onVendorEmailChange,
  vendorPhone,
  onVendorPhoneChange,
  isCreatingVendor,
}: VendorProfileModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Create Vendor Profile</Text>}
      centered
      radius="md"
    >
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            You must register your vendor company details before placing bids on tenders.
          </Text>
          <TextInput
            label="Company / Vendor Name"
            placeholder="e.g. Acme Supplies Ltd"
            required
            value={vendorName}
            onChange={(e) => onVendorNameChange(e.target.value)}
          />
          <TextInput
            label="Registration Number"
            placeholder="e.g. REG-98765"
            required
            value={vendorRegNo}
            onChange={(e) => onVendorRegNoChange(e.target.value)}
          />
          <TextInput
            label="Business Email"
            placeholder="contact@company.com"
            value={vendorEmail}
            onChange={(e) => onVendorEmailChange(e.target.value)}
          />
          <TextInput
            label="Phone Number"
            placeholder="+1 234 567 8900"
            value={vendorPhone}
            onChange={(e) => onVendorPhoneChange(e.target.value)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button color="emerald" type="submit" loading={isCreatingVendor}>
              Create Profile
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
