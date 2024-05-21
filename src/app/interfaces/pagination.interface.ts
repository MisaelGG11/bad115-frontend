import { WritableSignal } from '@angular/core';

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

export interface PaginationTableOutput {
  page: number;
  perPage: number;
}

export interface PaginationTableInput {
  total: number;
  perPage: WritableSignal<number>;
  page: WritableSignal<number>;
}
