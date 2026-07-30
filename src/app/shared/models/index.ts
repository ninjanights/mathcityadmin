export interface TopicQuery {
  page: number;
  pageSize: number;
  search?: string;
  chapterId?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
