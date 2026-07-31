export interface CreateChapterRequest {
  subjectId: string;
  title: string;
  description?: string;
}

export interface UpdateChapterRequest {
  title: string;
  description?: string;
}

export interface ChapterListResponse {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  displayOrder: number;
}
export interface ChapterQuery {
  search?: string;
  subjectSlug?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ChapterResponse {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  displayOrder: number;
}
