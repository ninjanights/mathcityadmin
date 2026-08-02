import { PracticeQuestionHeader } from '../../components/practice-question-header/practice-question-header';
import { PracticeQuestionList } from '../../components/practice-question-list/practice-question-list';
import { LessonResponse } from '../../../lessons/models/index';
import { Component, OnInit, computed, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PracticeQuestionResponse,
  CreatePracticeQuestionRequest,
  PracticeQuestionListResponse,
} from '../../models';

import { LessonService } from '../../../lessons/services';

import { PracticeQuestionForm } from '../../components/practice-question-form/practice-question-form';
import { ChapterStore } from '../../../../shared/stores/chapter.store';
import { TopicStore } from '../../../../shared/stores/topic.store';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { LessonStore } from '../../../../shared/stores/lesson.store';
import { PracticeQuestionStore } from '../../../../shared/stores/practiceQuestion.store';
import { SubjectService } from '../../../subjects/services';
import { ChapterService } from '../../../chapters/services';
import { TopicService } from '../../../topics/services';
import { PracticeQuestionService } from '../../services';

import {
  HorizontalSelector,
  HorizontalSelectorItem,
} from '../../../../shared/components/horizontal-selector/horizontal-selector';

@Component({
  selector: 'app-practice-question-page',
  standalone: true,
  imports: [CommonModule, PracticeQuestionHeader, PracticeQuestionList, PracticeQuestionForm, HorizontalSelector],
  templateUrl: './practice-question-page.html',
})
export class PracticeQuestionPage implements OnInit {
  private readonly subjectService = inject(SubjectService);
  private readonly chapterService = inject(ChapterService);
  private readonly topicService = inject(TopicService);
  private readonly lessonService = inject(LessonService);
  private readonly practiceQuestionService = inject(PracticeQuestionService);

  protected readonly subjectStore = inject(SubjectStore);
  protected readonly chapterStore = inject(ChapterStore);
  protected readonly topicStore = inject(TopicStore);
  protected readonly lessonStore = inject(LessonStore);
  private readonly practiceQuestionStore = inject(PracticeQuestionStore);

  subjects = this.subjectStore.subjects;
  chapters = this.chapterStore.chapters;
  topics = this.topicStore.topics;

  lessons = this.lessonStore.lessons;

  lesson = input<LessonResponse>();
  practiceQuestions = this.practiceQuestionStore.practiceQuestions;

  loading = signal(false);
  page = signal(1);
  pageSize = 5;

  search = signal('');

  totalCount = signal(0);
  totalPages = signal(0);

  sortOrder = signal('question-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  saving = signal(false);
  selectedPracticeQuestion = this.practiceQuestionStore.selectedPracticeQuestion;
  sortedPracticeQuestions = computed(() => {
    const order = this.sortOrder();
    return [...this.practiceQuestions()].sort((a, b) => {
      if (order === 'question-asc') {
        return a.question.localeCompare(b.question);
      }

      if (order === 'question-desc') {
        return b.question.localeCompare(a.question);
      }

      return a.displayOrder - b.displayOrder;
    });
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    const lesson = this.lesson();

    if (lesson) {
      // Opened from Lesson Page
      this.lessonStore.setSelectedLesson(lesson);
      this.loadPracticeQuestions();
      return;
    }

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
subjectItems = computed<HorizontalSelectorItem[]>(() =>
  this.subjects().map(x => ({
    id: x.id,
    label: x.name,
  }))
);

chapterItems = computed<HorizontalSelectorItem[]>(() =>
  this.chapters().map(x => ({
    id: x.id,
    label: x.title,
  }))
);

topicItems = computed<HorizontalSelectorItem[]>(() =>
  this.topics().map(x => ({
    id: x.id,
    label: x.title,
  }))
);
  lessonItems = computed<HorizontalSelectorItem[]>(() =>
    this.lessons().map((x) => ({
      id: x.id,
      label: x.title,
    })),
  );

  onLessonSelected(item: HorizontalSelectorItem): void {
    this.lessonService.getLessonById(item.id).subscribe({
      next: (response) => {
        this.lessonStore.setSelectedLesson(response.data);

        this.page.set(1);
        this.loadPracticeQuestions();
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

  loadPracticeQuestions(search?: string): void {
    const lesson = this.lessonStore.selectedLesson();

    if (!lesson) {
      this.loading.set(false);
      return;
    }
    this.loading.set(true);

    this.practiceQuestionService
      .getPracticeQuestions({
        page: this.page(),
        pageSize: this.pageSize,
        search,
        lessonSlug: lesson.slug,
      })
      .subscribe({
        next: (response) => {

          console.log(response, "45");
          const result = response.data;

          this.practiceQuestionStore.setPracticeQuestions(result.items);

          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);

          this.loading.set(false);
        },
        error: () => this.loading.set(false),
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
          console.log(response, 'pq. res ---');
          const result = response.data;
          this.lessonStore.setLessons(result?.items ?? []);

          const lessons = result?.items ?? [];

          this.lessonStore.setLessons(lessons);

          if (lessons.length && !this.lessonStore.selectedLesson()) {
            this.lessonService.getLessonById(lessons[0].id).subscribe({
              next: (response) => {
                this.lessonStore.setSelectedLesson(response.data);
                this.loadPracticeQuestions();
              },
            });

            return;
          }

          this.loadPracticeQuestions();

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
    this.loadPracticeQuestions(query);
  }

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadPracticeQuestions(this.search());
  }

  onCreate(): void {
    this.practiceQuestionStore.setSelectedPracticeQuestion(null);

    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(question: PracticeQuestionListResponse): void {
    this.practiceQuestionService.getPracticeQuestionById(question.id).subscribe({
      next: (response) => {

        console.log(response, "id---");
        this.practiceQuestionStore.setSelectedPracticeQuestion(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onDelete(question: PracticeQuestionListResponse): void {
    if (confirm(`Are you sure you want to delete ${question.question}?`)) {
      this.practiceQuestionService.deletePracticeQuestion(question.id).subscribe({
        next: () => {
          this.loadPracticeQuestions(this.search());
        },
      });
    }
  }

  onSubjectChange(item: HorizontalSelectorItem) {
    const subject = this.subjects().find(x => x.id === item.id);
    if (!subject) return;
    this.subjectStore.selectedSubject.set(subject);
    this.page.set(1);
    this.loadChapters();
  }
  onChapterChange(item: HorizontalSelectorItem) {
    const chapter = this.chapters().find(x => x.id === item.id);
    if (!chapter) return;
    this.chapterStore.selectedChapter.set(chapter);
    this.page.set(1);
    this.loadTopics();
  }
  onTopicChange(item: HorizontalSelectorItem) {
    const topic = this.topics().find(x => x.id === item.id);
    if (!topic) return;
    this.topicStore.selectedTopic.set(topic);
    this.page.set(1);
    this.loadLessons();
  }

  onSave(request: CreatePracticeQuestionRequest): void {
    const lesson = this.lessonStore.selectedLesson();

    if (!lesson) {
      alert('Please select a lesson first.');
      return;
    }

    this.saving.set(true);

    request.lessonId = lesson.id;

    const selectedQuestion = this.practiceQuestionStore.selectedPracticeQuestion();

    if (this.isEditing() && selectedQuestion) {
      this.practiceQuestionService.updatePracticeQuestion(selectedQuestion.id, request).subscribe({
        next: () => {
          this.onCancel();
          this.loadPracticeQuestions();
        },
        error: () => {
          this.saving.set(false);
          alert('Unable to update practice question');
        },
      });

      return;
    }

    this.practiceQuestionService.createPracticeQuestion(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadPracticeQuestions();
      },
      error: () => {
        this.saving.set(false);
        alert('Unable to create practice question');
      },
    });
  }
  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.saving.set(false);

    this.practiceQuestionStore.setSelectedPracticeQuestion(null);
  }
  onMove(question: PracticeQuestionListResponse, direction: 'Up' | 'Down'): void {
    this.practiceQuestionService.movePracticeQuestion(question.id, direction).subscribe({
      next: () => this.loadPracticeQuestions(this.search()),
    });
  }
}
