const allowedSortFields = ["createdAt", "title", "status"] as const;

export type SortField = (typeof allowedSortFields)[number];
export type SortOrder = "asc" | "desc";

export type Pagination = {
  page: number;
  limit: number;
  skip: number;
  sortBy: SortField;
  sortOrder: SortOrder;
};

const isValidSortField = (value: unknown): value is SortField => {
  return typeof value === "string" && allowedSortFields.includes(value as SortField);
};

export const parsePagination = (query: Record<string, unknown>): Pagination => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const sortBy = isValidSortField(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  return { page, limit, skip: (page - 1) * limit, sortBy, sortOrder };
};
