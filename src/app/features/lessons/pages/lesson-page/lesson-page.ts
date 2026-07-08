import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonService } from '../../services';
import {
  CreateLessonRequest,
  LessonListResponse,
  LessonResponse,
} from '../../models';

import { TopicService } from '../../../topics/services';
import { TopicListResponse } from '../../../topics/models';

import { LessonForm, LessonHeader, LessonList } from '../../components';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeader,
    LessonList,
    LessonForm,
  ],
  templateUrl: './lesson-page.html',
})
export class LessonPage implements OnInit {
  private readonly lessonService = inject(LessonService);
  private readonly topicService = inject(TopicService);

  lessons = signal<LessonListResponse[]>([]);
  topics = signal<TopicListResponse[]>([]);
  loading = signal(false);

  selectedLessonForTags = signal<LessonResponse | undefined>(undefined);
  isManagingTags = signal(false);

  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedLesson = signal<LessonResponse | undefined>(undefined);
  sortedLessons = computed(() => {
    const order = this.sortOrder();

    return [...this.lessons()].sort((a, b) => {
      if (order === 'title-asc') {
        return a.title.localeCompare(b.title);
      }

      if (order === 'title-desc') {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });
  });

  createPositions = computed(() =>
    Array.from({ length: this.lessons().length + 1 }, (_, i) => i + 1),
  );

  editPositions = computed(() =>
    Array.from({ length: this.lessons().length }, (_, i) => i + 1),
  );

  ngOnInit(): void {
    this.loadTopics();
    this.loadLessons();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (response) => {
        this.topics.set(response.data);
      },
    });
  }

  onLessonTags(lesson: LessonListResponse): void {
  this.lessonService.getLessonById(lesson.id).subscribe({
    next: (response) => {
      this.selectedLessonForTags.set(response.data);
      this.isManagingTags.set(true);
    }
  });
}

  loadLessons(search?: string): void {
    this.loading.set(true);

    this.lessonService.getLessons({ search }).subscribe({
      next: (response) => {
        this.lessons.set(response.data.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    this.loadLessons(query);
  }

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onCreate(): void {
    this.selectedLesson.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(lesson: LessonListResponse): void {
    this.lessonService.getLessonById(lesson.id).subscribe({
      next: (response) => {
        this.selectedLesson.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onDelete(lesson: LessonListResponse): void {
    if (confirm(`Are you sure you want to delete ${lesson.title}?`)) {
      this.lessonService.deleteLesson(lesson.id).subscribe({
        next: () => {
          this.loadLessons();
        },
      });
    }
  }

  onSave(request: CreateLessonRequest): void {
    if (this.isEditing() && this.selectedLesson()) {
      const id = this.selectedLesson()!.id;

      const updateRequest = {
        title: request.title,
        summary: request.summary,
        markdownContent: request.markdownContent,
        difficulty: request.difficulty,
        readingTimeMinutes: request.readingTimeMinutes,
        thumbnailUrl: request.thumbnailUrl,
        displayOrder: request.displayOrder,
        isPublished: request.isPublished,
      };

      this.lessonService.updateLesson(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadLessons();
        },
      });

      return;
    }

    this.lessonService.createLesson(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadLessons();
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedLesson.set(undefined);
  }
}