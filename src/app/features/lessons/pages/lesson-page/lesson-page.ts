import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonService } from '../../services';
import { LessonSaveRequest, LessonListResponse, LessonResponse } from '../../models';

import { TopicService } from '../../../topics/services';
import { TopicListResponse } from '../../../topics/models';

import { LessonForm, LessonHeader, LessonList } from '../../components';
import { LessonTagPage } from '../../../lesson-tags/pages/lesson-tag-page/lesson-tag-page';
import { LessonResourcePage } from '../../../lesson-resources/pages/lesson-resource-page/lesson-resource-page';
import { PracticeQuestionPage } from '../../../practice-questions/pages/practice-question-page/practice-question-page';

import { ChapterStore } from '../../../../shared/stores/chapter.store';
import { TopicStore } from '../../../../shared/stores/topic.store';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { LessonStore } from '../../../../shared/stores/lesson.store';
import { SubjectService } from '../../../subjects/services';
import { ChapterService } from '../../../chapters/services';
import { ChapterListResponse } from '../../../chapters/models';
import { SubjectListResponse } from '../../../subjects/models';
import {
  HorizontalSelector,
  HorizontalSelectorItem,
} from '../../../../shared/components/horizontal-selector/horizontal-selector';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeader,
    LessonList,
    LessonForm,
    LessonTagPage,
    LessonResourcePage,
    PracticeQuestionPage,
    HorizontalSelector,
  ],
  templateUrl: './lesson-page.html',
})
export class LessonPage implements OnInit {
  private readonly lessonService = inject(LessonService);

  private readonly subjectService = inject(SubjectService);
  private readonly chapterService = inject(ChapterService);
  private readonly topicService = inject(TopicService);

  protected readonly subjectStore = inject(SubjectStore);
  protected readonly chapterStore = inject(ChapterStore);
  protected readonly topicStore = inject(TopicStore);
  protected readonly lessonStore = inject(LessonStore);

  subjects = this.subjectStore.subjects;
  chapters = this.chapterStore.chapters;
  topics = this.topicStore.topics;
  lessons = this.lessonStore.lessons;

  loading = signal(false);
  page = signal(1);
  pageSize = 5;

  search = signal('');

  totalCount = signal(0);
  totalPages = signal(0);

  selectedLessonForTags = signal<LessonResponse | undefined>(undefined);
  isManagingTags = signal(false);

  selectedLessonForResources = signal<LessonResponse | undefined>(undefined);
  isManagingResources = signal(false);

  selectedLessonForQuestions = signal<LessonResponse | undefined>(undefined);
  isManagingQuestions = signal(false);

  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  saving = signal(false);
  selectedLesson = this.lessonStore.selectedLesson;
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

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  subjectItems = computed<HorizontalSelectorItem[]>(() =>
    this.subjects().map((x) => ({ id: x.id, label: x.name })),
  );

  chapterItems = computed<HorizontalSelectorItem[]>(() =>
    this.chapters().map((x) => ({ id: x.id, label: x.title })),
  );

  topicItems = computed<HorizontalSelectorItem[]>(() =>
    this.topics().map((x) => ({ id: x.id, label: x.title })),
  );

  ngOnInit(): void {
    if (this.subjectStore.subjects().length === 0) {
      this.loadSubjects();
    } else if (this.chapterStore.chapters().length === 0) {
      this.loadChapters();
    } else if (this.topicStore.topics().length === 0) {
      this.loadTopics();
    } else {
      this.loadLessons();
    }
  }

  // embedding generation
  generateEmbedding(lesson: LessonListResponse): void {
    this.lessonService.generateEmbedding(lesson.id).subscribe({
      next: () => {
        this.loadLessons(); 
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  
  loadTopics(): void {
    this.topicService
      .getTopics({
        page: 1,
        pageSize: 100,
        chapterId: this.chapterStore.selectedChapter()?.id,
      })
      .subscribe({
        next: (response) => {
          const topics = response.data?.items ?? [];
          this.topicStore.setTopics(topics);

          if (topics.length > 0) {
            this.topicStore.selectedTopic.set(topics[0]);
          } else {
            this.topicStore.selectedTopic.set(null);
          }

          this.loadLessons();
        },
      });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects({ pageSize: 100 }).subscribe({
      next: (response) => {
        const subjects = response.data?.items ?? [];
        this.subjectStore.setSubjects(subjects);

        if (subjects.length > 0) {
          this.subjectStore.selectedSubject.set(subjects[0]);
          this.loadChapters();
        }
      },
    });
  }

  loadChapters(): void {
    this.chapterService
      .getChapters({
        page: 1,
        pageSize: 100,
        subjectSlug: this.subjectStore.selectedSubject()?.slug,
      })
      .subscribe({
        next: (response) => {
          const chapters = response.data?.items ?? [];
          this.chapterStore.setChapters(chapters);

          if (chapters.length > 0) {
            this.chapterStore.selectedChapter.set(chapters[0]);
            this.loadTopics();
          }
        },
      });
  }

  onLessonTags(lesson: LessonListResponse): void {
    this.lessonService.getLessonById(lesson.id).subscribe({
      next: (response) => {
        const selectedLesson = response.data;
        if (!selectedLesson) return;

        this.selectedLessonForTags.set(selectedLesson);
        this.isManagingTags.set(true);
        this.isManagingResources.set(false);
        this.isManagingQuestions.set(false);
        this.isCreating.set(false);
        this.isEditing.set(false);
      },
    });
  }

  onLessonResources(lesson: LessonListResponse): void {
    this.lessonService.getLessonById(lesson.id).subscribe({
      next: (response) => {
        const selectedLesson = response.data;
        if (!selectedLesson) return;

        this.selectedLessonForResources.set(selectedLesson);
        this.isManagingResources.set(true);
        this.isManagingTags.set(false);
        this.isManagingQuestions.set(false);
        this.isCreating.set(false);
        this.isEditing.set(false);
      },
    });
  }

  onPracticeQuestions(lesson: LessonListResponse): void {
    this.lessonService.getLessonById(lesson.id).subscribe({
      next: (response) => {
        const selectedLesson = response.data;
        if (!selectedLesson) return;

        this.selectedLessonForQuestions.set(selectedLesson);
        this.isManagingQuestions.set(true);
        this.isManagingTags.set(false);
        this.isManagingResources.set(false);
        this.isCreating.set(false);
        this.isEditing.set(false);
      },
    });
  }

  loadLessons(search?: string): void {
    this.loading.set(true);

    this.lessonService
      .getLessons({
        page: this.page(),
        pageSize: this.pageSize,
        search,
        topicId: this.topicStore.selectedTopic()?.id,
      })
      .subscribe({
        next: (response) => {
          console.log(response, 'les res ---');
          const result = response.data;
          this.lessonStore.setLessons(result?.items ?? []);
          this.totalCount.set(result?.totalCount ?? 0);
          this.totalPages.set(result?.totalPages ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onSearch(query: string): void {
    this.search.set(query);
    this.page.set(1);
    this.loadLessons(query);
  }

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadLessons(this.search());
  }

  onCreate(): void {
    this.lessonStore.setSelectedLesson(null);
    this.isCreating.set(true);
    this.isEditing.set(false);
    this.isManagingTags.set(false);
    this.isManagingResources.set(false);
    this.isManagingQuestions.set(false);
  }

  onEdit(lesson: LessonListResponse): void {
    this.lessonService.getLessonById(lesson.id).subscribe({
      next: (response) => {
        const selectedLesson = response.data;
        if (!selectedLesson) return;

        this.lessonStore.setSelectedLesson(selectedLesson);
        this.isEditing.set(true);
        this.isCreating.set(false);
        this.isManagingTags.set(false);
        this.isManagingResources.set(false);
        this.isManagingQuestions.set(false);
      },
    });
  }

  onDelete(lesson: LessonListResponse): void {
    if (confirm(`Are you sure you want to delete ${lesson.title}?`)) {
      this.lessonService.deleteLesson(lesson.id).subscribe({
        next: () => {
          this.loadLessons(this.search());
        },
      });
    }
  }
  onSubjectChange(item: HorizontalSelectorItem) {
    const subject = this.subjects().find((x) => x.id === item.id);
    if (!subject) return;
    this.subjectStore.selectedSubject.set(subject);
    this.page.set(1);
    this.loadChapters();
  }
  onChapterChange(item: HorizontalSelectorItem) {
    const chapter = this.chapters().find((x) => x.id === item.id);
    if (!chapter) return;
    this.chapterStore.selectedChapter.set(chapter);
    this.page.set(1);
    this.loadTopics();
  }
  onTopicChange(item: HorizontalSelectorItem) {
    const topic = this.topics().find((x) => x.id === item.id);
    if (!topic) return;
    this.topicStore.selectedTopic.set(topic);
    this.page.set(1);
    this.loadLessons();
  }

  onSave(payload: LessonSaveRequest): void {
    const { request } = payload;

    this.saving.set(true);

    const selectedLesson = this.selectedLesson();

    if (this.isEditing() && selectedLesson) {
      const id = selectedLesson.id;

      const updateRequest = {
        topicId: request.topicId,
        title: request.title,
        summary: request.summary,
        markdownContent: request.markdownContent,
        difficulty: request.difficulty,
        readingTimeMinutes: request.readingTimeMinutes,
        isPublished: request.isPublished,
      };

      this.lessonService.updateLesson(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadLessons();
        },
        error: () => {
          this.saving.set(false);
          alert('Unable to save lesson');
        },
      });

      return;
    }

    this.lessonService.createLesson(request).subscribe({
      next: () => {
        alert('Lesson created successfully');
        this.onCancel();
        this.loadLessons();
      },
      error: () => {
        this.saving.set(false);
        alert('Unable to create lesson');
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.isManagingTags.set(false);
    this.isManagingResources.set(false);
    this.isManagingQuestions.set(false);
    this.saving.set(false);
    this.lessonStore.setSelectedLesson(null);
    this.selectedLessonForTags.set(undefined);
    this.selectedLessonForResources.set(undefined);
    this.selectedLessonForQuestions.set(undefined);
  }

  onMove(lesson: LessonListResponse, direction: 'Up' | 'Down'): void {
    this.lessonService.moveLesson(lesson.id, direction).subscribe({
      next: () => this.loadLessons(this.search()),
    });
  }
}
