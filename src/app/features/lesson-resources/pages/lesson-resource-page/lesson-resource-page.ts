import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LessonService } from '../../../lessons/services';
import { LessonListResponse } from '../../../lessons/models';
import { LessonResourceService } from '../../services';
import { LessonResourceListResponse, ResourceType } from '../../models';

@Component({
  selector: 'app-lesson-resource-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson-resource-page.html',
})
export class LessonResourcePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly lessonService = inject(LessonService);
  private readonly lessonResourceService = inject(LessonResourceService);

  @Input() lessonId = '';
  @Input() lessonTitle = '';
  close = output<void>();

  lessons = signal<LessonListResponse[]>([]);
  loading = signal(false);
  loadingLessons = signal(false);
  saving = signal(false);
  resources = signal<LessonResourceListResponse[]>([]);
  selectedFile = signal<File | undefined>(undefined);
  fileName = signal('');
  fileError = signal('');
  selectedLessonId = signal('');
  selectedLessonTitle = signal('');
  hasSelectedLesson = computed(() => Boolean(this.selectedLessonId()));
  isPdfResource = computed(() => this.form.controls.resourceType.value === ResourceType.Pdf);

  resourceTypes = [
    { label: 'Text', value: ResourceType.Text },
    { label: 'PDF', value: ResourceType.Pdf, accept: 'application/pdf' },
  ];

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
    return (
      'application/pdf'
    );
  }

  ngOnInit(): void {
    if (this.lessonId) {
      this.selectedLessonId.set(this.lessonId);
      this.selectedLessonTitle.set(this.lessonTitle);
      this.loadResources();
      return;
    }

    this.loadLessons();
  }

  loadLessons(): void {
    this.loadingLessons.set(true);

    this.lessonService.getLessons().subscribe({
      next: (response) => {
        this.lessons.set(response.data.items);
        this.loadingLessons.set(false);
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

  loadResources(): void {
    if (!this.selectedLessonId()) {
      return;
    }

    this.loading.set(true);

    this.lessonResourceService.getByLesson(this.selectedLessonId()).subscribe({
      next: (response) => {
        this.resources.set(response.data ?? []);
        this.form.controls.displayOrder.setValue((response.data?.length ?? 0) + 1);
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

  resourceTypeLabel(value: ResourceType): string {
    return this.resourceTypes.find((type) => type.value === value)?.label ?? 'Resource';
  }

  submit(): void {
    const file = this.selectedFile();

    if (this.form.invalid || (this.isPdfResource() && !file)) {
      this.form.markAllAsTouched();
      this.fileError.set(this.isPdfResource() && !file ? 'Select a PDF file.' : '');
      return;
    }

    this.saving.set(true);

    this.lessonResourceService
      .create(
        {
          lessonId: this.selectedLessonId(),
          title: this.form.controls.title.value ?? '',
          resourceType: Number(this.form.controls.resourceType.value) as ResourceType,
          displayOrder: Number(this.form.controls.displayOrder.value),
          description: this.form.controls.description.value ?? ""
        },
        file,
      )
      .subscribe({
        next: () => {
          this.form.patchValue({
            title: '',
              description: '',
            resourceType: ResourceType.Text,
          });
          this.clearFile();
          this.saving.set(false);
          this.loadResources();
        },
        error: () => {
          this.saving.set(false);
          this.fileError.set('Resource upload failed.');
        },
      });
  }

  deleteResource(resource: LessonResourceListResponse): void {
    if (!confirm(`Delete ${resource.title}?`)) {
      return;
    }

    this.lessonResourceService.delete(resource.id).subscribe({
      next: () => this.loadResources(),
    });
  }
}
