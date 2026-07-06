export interface CreateChapterRequest {
  subjectId: string;
  title: string;
  description?: string;
  displayOrder: number;
}

export interface UpdateChapterRequest {
  title: string;
  description?: string;
  displayOrder: number;
}

export interface ChapterListResponse {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  displayOrder: number;
}

export interface ChapterResponse {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  displayOrder: number;
}
