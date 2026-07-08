import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicForm, TopicHeader, TopicList } from '../../components';

import { TopicService } from '../../services';
import { CreateTopicRequest, TopicListResponse, TopicResponse } from '../../models';
import { ChapterService } from '../../../chapters/services';
import { ChapterListResponse } from '../../../chapters/models';

@Component({
  selector: 'app-topic-page',
  standalone: true,
  imports: [CommonModule, TopicHeader, TopicList, TopicForm],
  templateUrl: './topic-page.html',
})
export class TopicPage implements OnInit {
  private readonly topicService = inject(TopicService);
  private readonly chapterService = inject(ChapterService);

  topics = signal<TopicListResponse[]>([]);
  chapters = signal<ChapterListResponse[]>([]);
  loading = signal(false);

  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedTopic = signal<TopicResponse | undefined>(undefined);

 sortedTopics = computed(() => {
  console.log('topics signal:', this.topics);
  console.log('topics value:', this.topics());

  const order = this.sortOrder();

  return [...this.topics()].sort((a, b) => {
    if (order === 'title-asc') {
      return a.title.localeCompare(b.title);
    }

    if (order === 'title-desc') {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });
});

  ngOnInit(): void {
    this.loadChapters();
    this.loadTopics();
  }

  createPositions = computed(() =>
    Array.from({ length: this.topics().length + 1 }, (_, i) => i + 1),
  );

  editPositions = computed(() => Array.from({ length: this.topics().length }, (_, i) => i + 1));

  loadChapters(): void {
    this.chapterService.getChapters().subscribe({
      next: (response) => {
        this.chapters.set(response.data);
      },
    });
  }

  loadTopics(search?: string): void {
    this.loading.set(true);

    this.topicService.getTopics(search).subscribe({
      next: (response) => {
        console.log(response);
        console.log(Array.isArray(response.data));
        console.log(this.topics);

        this.topics.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    this.loadTopics(query);
  }

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onCreate(): void {
    this.selectedTopic.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(topic: TopicListResponse): void {
    this.topicService.getTopicById(topic.id).subscribe({
      next: (response) => {
        this.selectedTopic.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onDelete(topic: TopicListResponse): void {
    if (confirm(`Are you sure you want to delete ${topic.title}?`)) {
      this.topicService.deleteTopic(topic.id).subscribe({
        next: () => {
          this.loadTopics();
        },
      });
    }
  }

  onSave(request: CreateTopicRequest): void {
    if (this.isEditing() && this.selectedTopic()) {
      const id = this.selectedTopic()!.id;

      const updateRequest = {
        title: request.title,
        displayOrder: request.displayOrder,
      };

      this.topicService.updateTopic(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadTopics();
        },
      });

      return;
    }

    this.topicService.createTopic(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadTopics();
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedTopic.set(undefined);
  }
}
