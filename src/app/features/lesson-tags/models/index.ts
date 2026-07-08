export interface CreateLessonTagRequest {
  tagId: string;
}

export interface LessonTagResponse {
  id: string;
  lessonId: string;
  tagId: string;
  tagName: string | null;
}
