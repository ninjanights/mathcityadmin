import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatStore } from '../../shared-chat';

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './floating-chat.html',

})
export class FloatingChat {

  readonly store = inject(ChatStore);

  message = '';

  readonly messages = computed(() => this.store.messages());

  readonly loading = computed(() => this.store.isLoading());

  readonly open = computed(() => this.store.isOpen());

  readonly hasMessages = computed(() => this.store.hasMessages());

  readonly hasMore = computed(() => this.store.hasMore());

  readonly messageCount = computed(() => this.store.messageCount());

  send() {

    const text = this.message.trim();

    if (!text) {
      return;
    }

    this.store.send(text);

    this.message = '';

  }

  toggle() {
    this.store.toggle();
  }

  loadMore() {
    this.store.loadMore();
  }

  clear() {
    this.store.clear();
  }
}