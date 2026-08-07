import { Injectable, computed, inject, signal } from '@angular/core';

import { ChatService } from './chat.service';

import { ChatMessage } from '../models/chat-message';
import { ChatRequest } from '../models/chat-request';
import { SearchContext } from '../models/search-context';

@Injectable({
  providedIn: 'root',
})
export class ChatStore {
  private readonly chatService = inject(ChatService);

  readonly messages = signal<ChatMessage[]>([]);

  readonly isLoading = signal(false);

  readonly isOpen = signal(false);

  readonly context = signal<SearchContext>(SearchContext.Global);

  readonly lessonId = signal<string | undefined>(undefined);

  readonly topicId = signal<string | undefined>(undefined);

  readonly chapterId = signal<string | undefined>(undefined);

  readonly hasMessages = computed(() => this.messages().length > 0);

  readonly messageCount = computed(() => this.messages().length);

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }

  clear() {
  this.messages.set([]);
}
setContext(
  context: SearchContext,
  lessonId?: string,
  topicId?: string,
  chapterId?: string
) {
  this.context.set(context);

  this.lessonId.set(lessonId);

  this.topicId.set(topicId);

  this.chapterId.set(chapterId);
}

send(question: string) {

  const userMessage: ChatMessage = {
    role: 'user',
    message: question,
    createdAt: new Date(),
    context: this.context(),
    lessonId: this.lessonId(),
    topicId: this.topicId(),
    chapterId: this.chapterId(),
  };

  this.messages.update(messages => [...messages, userMessage]);

  this.isLoading.set(true);

  const request: ChatRequest = {
    question,
    context: this.context(),
    lessonId: this.lessonId(),
    topicId: this.topicId(),
    chapterId: this.chapterId(),
    topK: 5,
  };

  this.chatService.ask(request).subscribe({
    next: (response) => {

      this.messages.update(messages => [
        ...messages,
        {
          role: 'assistant',
          message: response.data.answer,
          createdAt: new Date(),
          context: this.context(),
          lessonId: this.lessonId(),
          topicId: this.topicId(),
          chapterId: this.chapterId(),
        }
      ]);

      this.isLoading.set(false);
    },

    error: () => {

      this.isLoading.set(false);

      this.messages.update(messages => [
        ...messages,
        {
          role: 'assistant',
          message: 'Something went wrong.',
          createdAt: new Date(),
          context: this.context(),
        }
      ]);
    }
  });

}




}
