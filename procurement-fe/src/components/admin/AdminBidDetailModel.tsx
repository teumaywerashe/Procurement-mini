import { Bid } from "@/src/types";
import { Badge, Button, Group, Modal, Paper, Text, Stack } from "@mantine/core";
import React from "react";

interface AdminBidDetailModelProps {
  selectedBid: Bid | null;
  setSelectedBid: (b: Bid | null) => void;
  handleUpdateBidStatus: (
    id: number,
    status: "accepted" | "rejected" | "pending",
  ) => void;
}

function AdminBidDetailModel({
  selectedBid,
  setSelectedBid,
  handleUpdateBidStatus,
}: AdminBidDetailModelProps) {
  return (
    <Modal
      opened={!!selectedBid}
      onClose={() => setSelectedBid(null)}
      title={
        <Text fw={700}>
          Bid Details —{" "}
          {selectedBid?.referenceNumber || `#BID-${selectedBid?.id}`}
        </Text>
      }
      centered
      size="lg"
      radius="md"
    >
      {selectedBid && (
        <Stack gap="md">
          <div className="grid grid-cols-2 gap-4 bg-(--bg-elevated) p-4 rounded-xl border border-(--border)">
            <div>
              <Text size="xs" c="dimmed">
                Tender Title
              </Text>
              <Text fw={600} size="sm">
                {selectedBid.tender?.title || `Tender #${selectedBid.tenderId}`}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Vendor Company
              </Text>
              <Text fw={600} size="sm">
                {selectedBid.vendor?.name || `Vendor #${selectedBid.vendorId}`}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Proposed Amount
              </Text>
              <Text fw={700} size="md" c="green">
                $
                {Number(
                  selectedBid.proposedPrice || selectedBid.amount || 0,
                ).toLocaleString()}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Current Bid Status
              </Text>
              <Badge
                color={
                  selectedBid.bidStatus === "accepted"
                    ? "emerald"
                    : selectedBid.bidStatus === "rejected"
                      ? "red"
                      : "yellow"
                }
                variant="light"
                mt={4}
              >
                {selectedBid.bidStatus?.toUpperCase() || "PENDING"}
              </Badge>
            </div>
          </div>

          <div>
            <Text size="xs" fw={700} c="dimmed" mb={4}>
              Proposal Description / Note
            </Text>
            <Paper
              p="md"
              radius="md"
              withBorder
              className="bg-(--bg-surface) text-xs leading-relaxed"
            >
              {selectedBid.proposal ||
                selectedBid.notes ||
                "No detailed proposal text submitted."}
            </Paper>
          </div>

          <Group
            justify="space-between"
            mt="md"
            className="pt-4 border-t border-(--border)"
          >
            <Group gap="xs">
              <Button
                color="emerald"
                size="xs"
                disabled={selectedBid.bidStatus === "accepted"}
                onClick={() =>
                  handleUpdateBidStatus(selectedBid.id, "accepted")
                }
              >
                Accept Bid
              </Button>
              <Button
                color="red"
                size="xs"
                disabled={selectedBid.bidStatus === "rejected"}
                onClick={() =>
                  handleUpdateBidStatus(selectedBid.id, "rejected")
                }
              >
                Reject Bid
              </Button>
            </Group>
            <Button
              variant="default"
              size="xs"
              onClick={() => setSelectedBid(null)}
            >
              Close
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}

export default AdminBidDetailModel;
