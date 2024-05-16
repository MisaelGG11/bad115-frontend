export interface PaginationInterface {
  totalPages: number;
  perPage: number;
  totalItems: number;
  page: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInterface;
}

export interface PaginationParams {
  page: number;
  perPage: number;
}
