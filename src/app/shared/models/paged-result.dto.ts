export interface PagedResult<T> {
  pageSize: number;
  nextPageToken: string;
  hasMoreItems: boolean;
  items: T[];
}
