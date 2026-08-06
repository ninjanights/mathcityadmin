export interface LessonListResponse {
  id: string;
  title: string;
  topicTitle: string;
  slug: string;
  difficulty: number;
  readingTimeMinutes: number;
  displayOrder: number;
  isPublished: boolean;
  topicId: string;
  isEmbedded: boolean;
  embeddingsGeneratedAt: string | null;
  tagCount: number;
  resourceCount: number;
  practiceQuestionCount: number;
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
  displayOrder: number;
  isPublished: boolean;
  isBookmarked: boolean;
  isEmbedded: boolean;
  embeddingsGeneratedAt: string | null;
  tagCount: number;
  resourceCount: number;
  practiceQuestionCount: number;
}

export interface CreateLessonRequest {
  topicId: string;
  title: string;
  summary: string;
  markdownContent: string;
  difficulty: number;
  readingTimeMinutes: number;
  isPublished: boolean;
}

export interface UpdateLessonRequest extends CreateLessonRequest {}

export interface LessonSaveRequest {
  request: CreateLessonRequest;
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
