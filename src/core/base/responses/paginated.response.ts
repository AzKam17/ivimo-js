export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  last_page?: number;
}