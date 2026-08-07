"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CollectionQuery } from "@/src/types";

interface Options {
  defaultLimit?: number;
  defaultSortBy?: string;
  defaultSortDir?: "asc" | "desc";
}

export function useCollectionQuery(opts: Options = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQueryState] = useState<CollectionQuery>({
    q: searchParams.get("q") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? opts.defaultLimit ?? 10),
    sortBy: searchParams.get("sortBy") ?? opts.defaultSortBy ?? "createdAt",
    sortDir:
      (searchParams.get("sortDir") as "asc" | "desc") ??
      opts.defaultSortDir ??
      "desc",
  });

  // Sync query state to URL after render — never during
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.page && query.page > 1) params.set("page", String(query.page));
    if (query.limit && query.limit !== (opts.defaultLimit ?? 20))
      params.set("limit", String(query.limit));
    if (query.sortBy && query.sortBy !== (opts.defaultSortBy ?? "createdAt"))
      params.set("sortBy", query.sortBy);
    if (query.sortDir && query.sortDir !== (opts.defaultSortDir ?? "desc"))
      params.set("sortDir", query.sortDir);

    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const setQuery = useCallback((patch: Partial<CollectionQuery>) => {
    setQueryState((prev) => {
      const next = { ...prev, ...patch };
      // Reset to page 1 whenever filter/search/sort changes
      if (
        patch.q !== undefined ||
        patch.sortBy !== undefined ||
        patch.sortDir !== undefined
      ) {
        next.page = 1;
      }
      return next;
    });
  }, []);

  return { query, setQuery };
}
