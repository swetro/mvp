export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  items: T[];
}
