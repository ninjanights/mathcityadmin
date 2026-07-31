import { Component, OnChanges, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TopicListResponse } from '../../../topics/models';
import { CreateLessonRequest, LessonSaveRequest, LessonResponse } from '../../models';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-form.html',
})
export class LessonForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  lesson = input<LessonResponse>();
  topics = input<TopicListResponse[]>([]);
  saving = input(false);

  save = output<LessonSaveRequest>();
  cancel = output<void>();

  visibleCount = 5;
  startIndex = signal(0);
  selectedTopicId = signal('');
  readingTimeManuallyEdited = signal(false);
  showMarkdownPreview = signal(false);

  visibleTopics = computed(() =>
    this.topics().slice(this.startIndex(), this.startIndex() + this.visibleCount),
  );

  form = this.fb.group({
    topicId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    summary: ['', Validators.maxLength(1000)],
    markdownContent: ['', Validators.required],
    difficulty: [1, Validators.required],
    readingTimeMinutes: [5, [Validators.required, Validators.min(1)]],
    isPublished: [true],
  });

  ngOnChanges(): void {
    const lesson = this.lesson();

    if (lesson) {
      this.selectedTopicId.set(lesson.topicId);
      this.form.patchValue({
        topicId: lesson.topicId,
        title: lesson.title,
        summary: lesson.summary,
        markdownContent: lesson.markdownContent,
        difficulty: lesson.difficulty,
        readingTimeMinutes: lesson.readingTimeMinutes,
        isPublished: lesson.isPublished,
      });

      const index = this.topics().findIndex((topic) => topic.id === lesson.topicId);
      if (index >= 0) {
        this.startIndex.set(Math.floor(index / this.visibleCount) * this.visibleCount);
      }
    } else {
      const first = this.topics()[0];
      this.selectedTopicId.set(first?.id ?? '');
      this.startIndex.set(0);
      this.form.patchValue({
        topicId: first?.id ?? '',
        title: '',
        summary: '',
        markdownContent: '',
        difficulty: 1,
        readingTimeMinutes: 5,
        isPublished: true,
      });
    }

    this.readingTimeManuallyEdited.set(Boolean(lesson));
  }

  summaryLength(): number {
    return this.form.controls.summary.value?.length ?? 0;
  }

  markdownPreviewHtml(): string {
    const markdown = this.form.controls.markdownContent.value ?? '';
    return markdown.trim()
      ? this.renderMarkdown(markdown)
      : '<p class="text-neutral-500">Markdown preview</p>';
  }

  previousTopics(): void {
    if (!this.lesson() && this.startIndex() > 0) {
      this.startIndex.update((index) => Math.max(0, index - this.visibleCount));
    }
  }

  nextTopics(): void {
    if (!this.lesson() && this.startIndex() + this.visibleCount < this.topics().length) {
      this.startIndex.update((index) =>
        Math.min(index + this.visibleCount, Math.max(0, this.topics().length - this.visibleCount)),
      );
    }
  }

  selectTopic(topic: TopicListResponse): void {
    if (!this.lesson()) {
      this.selectedTopicId.set(topic.id);
      this.form.controls.topicId.setValue(topic.id);
    }
  }

  onMarkdownInput(): void {
    if (this.readingTimeManuallyEdited()) return;
    const wordCount = (this.form.controls.markdownContent.value ?? '').trim().split(/\s+/).filter(Boolean).length;
    this.form.controls.readingTimeMinutes.setValue(Math.max(1, Math.ceil(wordCount / 200)));
  }

  onReadingTimeInput(): void {
    this.readingTimeManuallyEdited.set(true);
  }

  toggleMarkdownPreview(): void {
    this.showMarkdownPreview.update((value) => !value);
  }

  selectDifficulty(value: number): void {
    this.form.controls.difficulty.setValue(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as CreateLessonRequest;
    this.save.emit({
      request: {
        ...request,
        difficulty: Number(request.difficulty),
        readingTimeMinutes: Number(request.readingTimeMinutes),
      },
    });
  }

  private renderMarkdown(markdown: string): string {
    return this.escapeHtml(markdown).split('\n').map((line) => {
      const formatted = this.formatInlineMarkdown(line);
      if (line.startsWith('### ')) return `<h3 class="mb-2 mt-4 text-lg font-bold">${this.formatInlineMarkdown(line.slice(4))}</h3>`;
      if (line.startsWith('## ')) return `<h2 class="mb-2 mt-5 text-xl font-bold">${this.formatInlineMarkdown(line.slice(3))}</h2>`;
      if (line.startsWith('# ')) return `<h1 class="mb-3 mt-5 text-2xl font-bold">${this.formatInlineMarkdown(line.slice(2))}</h1>`;
      if (line.startsWith('- ')) return `<p class="pl-3">&bull; ${this.formatInlineMarkdown(line.slice(2))}</p>`;
      return line.trim() ? `<p>${formatted}</p>` : '<br />';
    }).join('');
  }

  private formatInlineMarkdown(value: string): string {
    return value.replace(/`([^`]+)`/g, '<code class="rounded bg-neutral-200 px-1 py-0.5 text-xs dark:bg-neutral-700">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
}
