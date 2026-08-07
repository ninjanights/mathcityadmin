import { SearchContext } from './search-context';
export interface ChatMessage {
  id: string;

  role: 'User' | 'Assistant';

  message: string;

  createdAt: string | Date;

  context: SearchContext;

  lessonId?: string;

  topicId?: string;

  chapterId?: string;
}
