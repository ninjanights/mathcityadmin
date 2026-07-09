export interface LessonListResponse {
  id: string;
  title: string;
  slug: string;
  difficulty: number;
  readingTimeMinutes: number;
  thumbnailUrl: string;
  displayOrder: number;
  isPublished: boolean;
  topicId: string;

}

export interface LessonResponse {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  summary: string;
  markdownContent: string;
  difficulty: number;
  readingTimeMinutes: number;
  thumbnailUrl: string;
  displayOrder: number;
  isPublished: boolean;
  isBookmarked: boolean;
}

export interface CreateLessonRequest {
  topicId: string;
  title: string;
  summary: string;
  markdownContent: string;
  difficulty: number;
  readingTimeMinutes: number;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateLessonRequest extends CreateLessonRequest {}

export interface LessonSaveRequest {
  request: CreateLessonRequest;
  thumbnail?: File;
}

export interface MoveLessonRequest {
  position: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
