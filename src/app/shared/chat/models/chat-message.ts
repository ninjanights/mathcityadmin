import { SearchContext } from "./search-context";
export interface ChatMessage {

  role: 'user' | 'assistant';

  message: string;

  createdAt: Date;

  context: SearchContext;

  lessonId?: string;

  topicId?: string;

  chapterId?: string;
}