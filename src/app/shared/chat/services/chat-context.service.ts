import { Injectable, inject } from '@angular/core';

import { ChatStore } from './chat-store';

import { SearchContext } from '../models/search-context';

@Injectable({
  providedIn: 'root',
})
export class ChatContextService {
  private readonly chatStore = inject(ChatStore);

  global() {
    this.chatStore.setContext(
      SearchContext.Global
    );
  }

  chapter(chapterId: string) {
    this.chatStore.setContext(
      SearchContext.Chapter,
      undefined,
      undefined,
      chapterId
    );
  }

  topic(topicId: string, chapterId?: string) {
    this.chatStore.setContext(
      SearchContext.Topic,
      undefined,
      topicId,
      chapterId
    );
  }

  lesson(
    lessonId: string,
    topicId?: string,
    chapterId?: string
  ) {
    this.chatStore.setContext(
      SearchContext.Lesson,
      lessonId,
      topicId,
      chapterId
    );
  }
}