export interface CollectionResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): CollectionResult<T> {
  const offset = (page - 1) * limit;
  return {
    data: items.slice(offset, offset + limit),
    total: items.length,
    page,
    limit,
  };
}
