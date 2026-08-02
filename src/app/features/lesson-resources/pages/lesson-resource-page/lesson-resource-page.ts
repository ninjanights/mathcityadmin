import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LessonService } from '../../../lessons/services';
import { LessonListResponse } from '../../../lessons/models';
import { SubjectService } from '../../../subjects/services';
import { ChapterService } from '../../../chapters/services';
import { TopicService } from '../../../topics/services';
import { LessonResourceService } from '../../services';
import {
  LessonResourceListResponse,
  LessonResourceResponse,
  ResourceType,
} from '../../models';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { ChapterStore } from '../../../../shared/stores/chapter.store';
import { TopicStore } from '../../../../shared/stores/topic.store';
import {
  HorizontalSelector,
  HorizontalSelectorItem,
} from '../../../../shared/components/horizontal-selector/horizontal-selector';
import { LessonResourceList } from '../../components/lesson-resource-list/lesson-resource-list';
import { LessonResourcePagedResult } from '../../models';

@Component({
  selector: 'app-lesson-resource-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HorizontalSelector,
     LessonResourceList],
  templateUrl: './lesson-resource-page.html',
})
export class LessonResourcePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly lessonService = inject(LessonService);
  private readonly subjectService = inject(SubjectService);
  private readonly chapterService = inject(ChapterService);
  private readonly topicService = inject(TopicService);
  private readonly lessonResourceService = inject(LessonResourceService);

  protected readonly subjectStore = inject(SubjectStore);
  protected readonly chapterStore = inject(ChapterStore);
  protected readonly topicStore = inject(TopicStore);

  @Input() lessonId = '';
  @Input() lessonTitle = '';
  @Input() lessonSlug = '';

  close = output<void>();
  page = signal(1);
  pageSize = signal(5);
  totalCount = signal(0);
  lessons = signal<LessonListResponse[]>([]);
  subjects = this.subjectStore.subjects;
  chapters = this.chapterStore.chapters;
  topics = this.topicStore.topics;
  loading = signal(false);
  loadingLessons = signal(false);
  saving = signal(false);
  resources = signal<LessonResourceListResponse[]>([]);
  selectedResource = signal<LessonResourceResponse | null>(null);
  selectedFile = signal<File | undefined>(undefined);
  fileName = signal('');
  fileError = signal('');
  selectedLessonId = signal('');
  selectedLessonTitle = signal('');
  hasSelectedLesson = computed(() => Boolean(this.selectedLessonId()));
  isPdfResource = computed(() => this.form.controls.resourceType.value === ResourceType.Pdf);
selectedLessonSlug = signal('');
  resourceTypes = [
    { label: 'Text', value: ResourceType.Text },
    { label: 'PDF', value: ResourceType.Pdf, accept: 'application/pdf' },
  ];

  subjectItems = computed<HorizontalSelectorItem[]>(() =>
    this.subjects().map((subject) => ({ id: subject.id, label: subject.name })),
  );
  chapterItems = computed<HorizontalSelectorItem[]>(() =>
    this.chapters().map((chapter) => ({ id: chapter.id, label: chapter.title })),
  );
  topicItems = computed<HorizontalSelectorItem[]>(() =>
    this.topics().map((topic) => ({ id: topic.id, label: topic.title })),
  );
  lessonItems = computed<HorizontalSelectorItem[]>(() =>
    this.lessons().map((lesson) => ({ id: lesson.id, label: lesson.title })),
  );

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    resourceType: [ResourceType.Text, Validators.required],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
  });

  positions(): number[] {
    return Array.from({ length: this.resources().length + 1 }, (_, i) => i + 1);
  }

  selectedAccept(): string {
    return 'application/pdf';
  }

  ngOnInit(): void {
    if (this.lessonId) {
      this.selectedLessonId.set(this.lessonId);
      this.selectedLessonTitle.set(this.lessonTitle);
      this.selectedLessonSlug.set(this.lessonSlug);
      this.loadResources();
      return;
    }

    if (this.subjects().length === 0) {
      this.loadSubjects();
    } else if (this.chapters().length === 0) {
      this.loadChapters();
    } else if (this.topics().length === 0) {
      this.loadTopics();
    } else {
      this.loadLessons();
    }
  }

  loadLessons(): void {
    this.loadingLessons.set(true);

    this.lessonService.getLessons({
      page: 1,
      pageSize: 100,
      topicId: this.topicStore.selectedTopic()?.id,
    }).subscribe({
      next: (response) => {
        const lessons = response.data?.items ?? [];
        this.lessons.set(lessons);
        this.loadingLessons.set(false);

        if (lessons.length > 0) {
          this.selectLesson(lessons[0]);
        } else {
          this.selectedLessonId.set('');
          this.selectedLessonSlug.set('');
          this.resources.set([]);
        }
      },
      error: () => {
        this.lessons.set([]);
        this.loadingLessons.set(false);
      },
    });
  }

  selectLesson(lesson: LessonListResponse): void {
    this.selectedLessonId.set(lesson.id);
    this.selectedLessonTitle.set(lesson.title);
    this.selectedLessonSlug.set(lesson.slug);
    this.clearFile();
    this.resources.set([]);
    this.form.patchValue({
      title: '',
      description: '',
      resourceType: ResourceType.Text,
      displayOrder: 1,
    });
    this.loadResources();
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
    this.chapterService.getChapters({
      page: 1,
      pageSize: 100,
      subjectSlug: this.subjectStore.selectedSubject()?.slug,
    }).subscribe({
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

  loadTopics(): void {
    this.topicService.getTopics({
      page: 1,
      pageSize: 100,
      chapterId: this.chapterStore.selectedChapter()?.id,
    }).subscribe({
      next: (response) => {
        const topics = response.data?.items ?? [];
        this.topicStore.setTopics(topics);
        if (topics.length > 0) {
          this.topicStore.selectedTopic.set(topics[0]);
          this.loadLessons();
        }
      },
    });
  }

  onSubjectChange(item: HorizontalSelectorItem): void {
    const subject = this.subjects().find((value) => value.id === item.id);
    if (!subject) return;
    this.subjectStore.selectedSubject.set(subject);
    this.loadChapters();
  }

  onChapterChange(item: HorizontalSelectorItem): void {
    const chapter = this.chapters().find((value) => value.id === item.id);
    if (!chapter) return;
    this.chapterStore.selectedChapter.set(chapter);
    this.loadTopics();
  }

  onTopicChange(item: HorizontalSelectorItem): void {
    const topic = this.topics().find((value) => value.id === item.id);
    if (!topic) return;
    this.topicStore.selectedTopic.set(topic);
    this.loadLessons();
  }

  onLessonSelected(item: HorizontalSelectorItem): void {
    const lesson = this.lessons().find((value) => value.id === item.id);
    if (lesson) this.selectLesson(lesson);
  }

  loadResources(): void {
    const lessonSlug = this.selectedLessonSlug();

    if (!lessonSlug) {
      return;
    }
    this.loading.set(true);

    this.lessonResourceService
      .getLessonResources({
        lessonSlug,
        page: this.page(),
        pageSize: this.pageSize(),
      })
      .subscribe({
        next: (response) => {
          const result = (response.data ?? response) as LessonResourcePagedResult;
          const resources = result.items ?? [];

          this.resources.set(resources);
          this.totalCount.set(result.totalCount ?? resources.length);
          this.form.controls.displayOrder.setValue(resources.length + 1);
          this.loading.set(false);
        },

        error: () => {
          this.resources.set([]);
          this.loading.set(false);
        },
      });
  }

  selectResourceType(type: ResourceType): void {
    this.form.controls.resourceType.setValue(type);
    this.clearFile();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);

    this.fileError.set('');

    if (!file) {
      this.selectedFile.set(undefined);
      this.fileName.set('');
      return;
    }

    this.selectedFile.set(file);
    this.fileName.set(file.name);
  }

  clearFile(input?: HTMLInputElement): void {
    this.selectedFile.set(undefined);
    this.fileName.set('');
    this.fileError.set('');

    if (input) {
      input.value = '';
    }
  }

  submit(): void {
    const file = this.selectedFile();

    if (this.form.invalid || (this.isPdfResource() && !file)) {
      this.form.markAllAsTouched();
      this.fileError.set(this.isPdfResource() && !file ? 'Select a PDF file.' : '');
      return;
    }

    this.saving.set(true);

    const selectedResource = this.selectedResource();

    if (selectedResource) {
      this.lessonResourceService.updateLessonResource(selectedResource.id, {
        title: this.form.controls.title.value ?? '',
        resourceType: Number(this.form.controls.resourceType.value) as ResourceType,
        description: this.form.controls.description.value ?? '',
      }).subscribe({
        next: () => {
          this.resetForm();
          this.saving.set(false);
          this.loadResources();
        },
        error: () => {
          this.saving.set(false);
          this.fileError.set('Unable to update resource.');
        },
      });
      return;
    }

    this.lessonResourceService.createLessonResource(
{
  lessonId: this.selectedLessonId(),
  title: this.form.controls.title.value ?? '',
  resourceType:
    Number(this.form.controls.resourceType.value) as ResourceType,
  description:
    this.form.controls.description.value ?? ''
},
file
)
      .subscribe({
        next: () => {
          this.resetForm();
          this.saving.set(false);
          this.loadResources();
        },
        error: () => {
          this.saving.set(false);
          this.fileError.set('Resource upload failed.');
        },
      });
  }

  viewResource(resource: LessonResourceListResponse): void {
    this.lessonResourceService.getLessonResourceById(resource.id).subscribe({
      next: (response) => {
        const url = response.data?.url;
        if (url) window.open(url, '_blank', 'noopener');
      },
    });
  }

  editResource(resource: LessonResourceListResponse): void {
    this.lessonResourceService.getLessonResourceById(resource.id).subscribe({
      next: (response) => {
        const selectedResource = response.data;
        if (!selectedResource) return;

        this.selectedResource.set(selectedResource);
        this.form.patchValue({
          title: selectedResource.title,
          description: selectedResource.description ?? '',
          resourceType: selectedResource.resourceType,
        });
        this.clearFile();
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedResource.set(null);
    this.form.patchValue({
      title: '',
      description: '',
      resourceType: ResourceType.Text,
      displayOrder: this.resources().length + 1,
    });
    this.clearFile();
  }

  deleteResource(resource: LessonResourceListResponse): void {
    if (!confirm(`Delete ${resource.title}?`)) {
      return;
    }

    this.lessonResourceService.deleteLessonResource(resource.id).subscribe({
      next: () => this.loadResources(),
    });
  }
}
