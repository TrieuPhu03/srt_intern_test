export interface ApiError {
  code: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
