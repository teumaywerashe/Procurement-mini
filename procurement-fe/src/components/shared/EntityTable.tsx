/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import type { CollectionQuery, CollectionResult } from "@/src/types";

interface EntityTableProps<T extends Record<string, any>> {
  result: CollectionResult<T> | undefined;
  isLoading: boolean;
  columns: DataTableColumn<T>[];
  query: CollectionQuery;
  onQueryChange: (patch: Partial<CollectionQuery>) => void;
  onRowClick?: (record: T) => void;
}

export function EntityTable<T extends Record<string, any>>({
  result,
  isLoading,
  columns,
  query,
  onQueryChange,
  onRowClick,
}: EntityTableProps<T>) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const total = result?.total ?? 0;
  const rows = result?.data ?? [];

  const sortStatus: DataTableSortStatus<T> = {
    columnAccessor: (query.sortBy ?? "createdAt") as keyof T & string,
    direction: query.sortDir ?? "desc",
  };

  return (
    <DataTable<T>
      withTableBorder
      borderRadius="md"
      highlightOnHover
      striped
      records={rows}
      fetching={isLoading}
      columns={columns}
      totalRecords={total}
      recordsPerPage={limit}
      page={page}
      onPageChange={(p) => onQueryChange({ page: p })}
      recordsPerPageOptions={[2,5,10,15, 20,25, 50]}
      onRecordsPerPageChange={(l) => onQueryChange({ limit: l, page: 1 })}
      sortStatus={sortStatus}
      onSortStatusChange={(s) =>
        onQueryChange({
          sortBy: s.columnAccessor as string,
          sortDir: s.direction,
        })
      }
      // Only show empty-state area when truly empty
      minHeight={rows.length === 0 ? 100 : 0}
      noRecordsText="No records found"
      onRowClick={onRowClick ? ({ record }) => onRowClick(record) : undefined}
      styles={{
        header: { background: "var(--bg-elevated)" },
        footer: {
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border)",
        },
      }}
    />
  );
}
