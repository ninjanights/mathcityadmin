import { Injectable, signal } from '@angular/core';
import { TopicListResponse } from '../../features/topics/models';

@Injectable({
  providedIn: 'root',
})
export class TopicStore {
  topics = signal<TopicListResponse[]>([]);
  selectedTopic = signal<TopicListResponse | null>(null);

  setTopics(topics: TopicListResponse[]) {
    this.topics.set(topics);
  }
}