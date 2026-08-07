import { SearchContext } from './search-context';
export interface ChatRequest {
  question: string;

  context: SearchContext;

  lessonId?: string;

  topicId?: string;

  chapterId?: string;

  topK?: number;
}