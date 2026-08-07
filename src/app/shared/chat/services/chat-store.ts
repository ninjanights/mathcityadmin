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

  readonly context = signal(SearchContext.Global);

  readonly lessonId = signal<string | undefined>(undefined);

  readonly topicId = signal<string | undefined>(undefined);

  readonly chapterId = signal<string | undefined>(undefined);

  readonly hasMessages = computed(() => this.messages().length > 0);

  readonly messageCount = computed(() => this.messages().length);

  readonly hasMore = signal(false);

  readonly nextCursor = signal<string | null>(null);

  // -------------------------
  // Chat Window
  // -------------------------

  open() {
    if (this.isOpen()) return;

    this.isOpen.set(true);

    this.loadHistory();
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  clear() {
    this.messages.set([]);
    this.hasMore.set(false);
    this.nextCursor.set(null);
  }

  // -------------------------
  // Context
  // -------------------------

  setContext(
    context: SearchContext,
    lessonId?: string,
    topicId?: string,
    chapterId?: string
  ) {
    if (
      this.context() === context &&
      this.lessonId() === lessonId &&
      this.topicId() === topicId &&
      this.chapterId() === chapterId
    ) {
      return;
    }

    this.context.set(context);
    this.lessonId.set(lessonId);
    this.topicId.set(topicId);
    this.chapterId.set(chapterId);

    this.clear();

    if (this.isOpen()) {
      this.loadHistory();
    }
  }

  // -------------------------
  // History
  // -------------------------

  loadHistory() {
    this.chatService.getHistory().subscribe({
      next: (response) => {
        this.messages.set(response.data.messages);

        this.hasMore.set(response.data.hasMore);

        this.nextCursor.set(response.data.nextCursor ?? null);
      },
    });
  }

  loadMore() {
    if (!this.hasMore()) return;

    const cursor = this.nextCursor();

    if (!cursor) return;

    this.chatService.getHistory(cursor).subscribe({
      next: (response) => {
        this.messages.update(messages => [
          ...response.data.messages,
          ...messages,
        ]);

        this.hasMore.set(response.data.hasMore);

        this.nextCursor.set(response.data.nextCursor ?? null);
      },
    });
  }

  // -------------------------
  // Send Message
  // -------------------------

  send(question: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'User',
      message: question,
      createdAt: new Date().toISOString(),
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
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'Assistant',
          message: response.data.answer,
          createdAt: new Date().toISOString(),
          context: this.context(),
          lessonId: this.lessonId(),
          topicId: this.topicId(),
          chapterId: this.chapterId(),
        };

        this.messages.update(messages => [
          ...messages,
          assistantMessage,
        ]);

        this.isLoading.set(false);
      },

      error: () => {
        this.messages.update(messages => [
          ...messages,
          {
            id: crypto.randomUUID(),
            role: 'Assistant',
            message: 'Something went wrong.',
            createdAt: new Date().toISOString(),
            context: this.context(),
            lessonId: this.lessonId(),
            topicId: this.topicId(),
            chapterId: this.chapterId(),
          },
        ]);

        this.isLoading.set(false);
      },
    });
  }
}