export interface ChatRequest {
  question: string;
  context: number;
  lessonId?: string;
  topicId?: string;
  chapterId?: string;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
}