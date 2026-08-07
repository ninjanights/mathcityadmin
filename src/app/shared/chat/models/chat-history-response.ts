import { ChatMessage } from './chat-message';

export interface ChatHistoryResponse {
  messages: ChatMessage[];

  hasMore: boolean;

  nextCursor?: string;
}