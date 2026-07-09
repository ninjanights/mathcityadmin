import {
  Component,
  OnDestroy,
  OnChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TopicListResponse } from '../../../topics/models';
import { CreateLessonRequest, LessonSaveRequest, LessonResponse } from '../../models';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-form.html',
})
export class LessonForm implements OnChanges, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];
  private readonly maxImageSize = 5 * 1024 * 1024;
  private readonly expectedAspectRatio = 4 / 3;
  private readonly cropWidth = 800;
  private readonly cropHeight = 600;

  lesson = input<LessonResponse>();
  topics = input<TopicListResponse[]>([]);
  positions = input<number[]>([]);
  saving = input(false);

  save = output<LessonSaveRequest>();
  cancel = output<void>();

  visibleCount = 5;
  startIndex = signal(0);

  selectedTopicId = signal('');
  thumbnail = signal<File | undefined>(undefined);
  previewUrl = signal<string | undefined>(undefined);
  cropSourceUrl = signal<string | undefined>(undefined);
  cropSourceFile = signal<File | undefined>(undefined);
  cropZoom = signal(1);
  cropPositionX = signal(50);
  cropPositionY = signal(50);
  cropDragging = signal(false);
  imageError = signal('');
  isDragOver = signal(false);
  readingTimeManuallyEdited = signal(false);
  showMarkdownPreview = signal(false);

  private cropDragStart:
    | {
        pointerId: number;
        clientX: number;
        clientY: number;
        positionX: number;
        positionY: number;
      }
    | undefined;

  visibleTopics = computed(() =>
    this.topics().slice(this.startIndex(), this.startIndex() + this.visibleCount),
  );

  selectedTopic = computed(() => this.topics().find((x) => x.id === this.selectedTopicId()));

  currentThumbnailUrl = computed(() => this.lesson()?.thumbnailUrl || '');

  summaryLength(): number {
    return this.form.controls.summary.value?.length ?? 0;
  }

  markdownPreviewHtml(): string {
    const markdown = this.form.controls.markdownContent.value ?? '';

    if (!markdown.trim()) {
      return '<p class="text-neutral-500">Markdown preview</p>';
    }

    return this.renderMarkdown(markdown);
  }

  form = this.fb.group({
    topicId: ['', Validators.required],

    title: ['', [Validators.required, Validators.maxLength(200)]],

    summary: ['', Validators.maxLength(1000)],

    markdownContent: ['', Validators.required],

    difficulty: [0, Validators.required],

    readingTimeMinutes: [5, [Validators.required, Validators.min(1)]],

    isPublished: [true],

    displayOrder: [1, [Validators.required, Validators.min(1)]],
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
        displayOrder: lesson.displayOrder,
      });

      const index = this.topics().findIndex((x) => x.id === lesson.topicId);

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
        difficulty: 0,
        readingTimeMinutes: 5,
        isPublished: true,
        displayOrder: this.positions().length + 1,
      });
    }

    this.clearThumbnail();
    this.clearCropSource();
    this.readingTimeManuallyEdited.set(Boolean(lesson));
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
    this.clearCropSource();
  }

  previousTopics() {
    if (!this.lesson() && this.startIndex() > 0) {
      this.startIndex.update((x) => Math.max(0, x - this.visibleCount));
    }
  }

  nextTopics() {
    if (!this.lesson() && this.startIndex() + this.visibleCount < this.topics().length) {
      this.startIndex.update((x) =>
        Math.min(x + this.visibleCount, Math.max(0, this.topics().length - this.visibleCount)),
      );
    }
  }

  selectTopic(topic: TopicListResponse) {
    if (!this.lesson()) {
      this.selectedTopicId.set(topic.id);
      this.form.controls.topicId.setValue(topic.id);
    }
  }

  onMarkdownInput(): void {
    if (this.readingTimeManuallyEdited()) {
      return;
    }

    const markdown = this.form.controls.markdownContent.value ?? '';
    const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));

    this.form.controls.readingTimeMinutes.setValue(minutes);
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

  decreaseCropZoom(): void {
    this.cropZoom.set(this.clamp(Number((this.cropZoom() - 0.05).toFixed(2)), 1, 2.5));
  }

  increaseCropZoom(): void {
    this.cropZoom.set(this.clamp(Number((this.cropZoom() + 0.05).toFixed(2)), 1, 2.5));
  }

  onCropWheel(event: WheelEvent): void {
    event.preventDefault();

    const direction = event.deltaY > 0 ? -1 : 1;
    const nextZoom = this.cropZoom() + direction * 0.05;

    this.cropZoom.set(this.clamp(Number(nextZoom.toFixed(2)), 1, 2.5));
  }

  onCropPointerDown(event: PointerEvent): void {
    const frame = event.currentTarget as HTMLElement;

    frame.setPointerCapture(event.pointerId);
    this.cropDragging.set(true);
    this.cropDragStart = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      positionX: this.cropPositionX(),
      positionY: this.cropPositionY(),
    };
  }

  onCropPointerMove(event: PointerEvent): void {
    if (!this.cropDragStart || this.cropDragStart.pointerId !== event.pointerId) {
      return;
    }

    const frame = event.currentTarget as HTMLElement;
    const rect = frame.getBoundingClientRect();
    const zoom = this.cropZoom();
    const deltaX = ((event.clientX - this.cropDragStart.clientX) / rect.width) * 100;
    const deltaY = ((event.clientY - this.cropDragStart.clientY) / rect.height) * 100;

    this.cropPositionX.set(this.clamp(this.cropDragStart.positionX - deltaX / zoom, 0, 100));
    this.cropPositionY.set(this.clamp(this.cropDragStart.positionY - deltaY / zoom, 0, 100));
  }

  onCropPointerUp(event: PointerEvent): void {
    const frame = event.currentTarget as HTMLElement;

    if (this.cropDragStart?.pointerId === event.pointerId) {
      this.cropDragStart = undefined;
      this.cropDragging.set(false);
    }

    if (frame.hasPointerCapture(event.pointerId)) {
      frame.releasePointerCapture(event.pointerId);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent, input: HTMLInputElement): void {
    event.preventDefault();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files.item(0);

    if (file) {
      input.value = '';
      void this.setThumbnail(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);

    if (file) {
      void this.setThumbnail(file);
    }
  }

  removeThumbnail(input?: HTMLInputElement): void {
    this.clearThumbnail();
    this.clearCropSource();
    this.clearCropDrag();

    if (input) {
      input.value = '';
    }
  }

  async applyCrop(): Promise<void> {
    const sourceUrl = this.cropSourceUrl();
    const sourceFile = this.cropSourceFile();

    if (!sourceUrl || !sourceFile) {
      return;
    }

    try {
      const blob = await this.createCroppedBlob(sourceUrl);
      const fileName = sourceFile.name.replace(/\.[^.]+$/, '.jpg');
      const file = new File([blob], fileName, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      const previewUrl = URL.createObjectURL(blob);

      this.revokePreviewUrl();
      this.thumbnail.set(file);
      this.previewUrl.set(previewUrl);
      this.clearCropSource();
    } catch {
      this.imageError.set('Unable to crop this image.');
    }
  }

  private async setThumbnail(file: File): Promise<void> {
    this.clearThumbnail();
    this.clearCropSource();

    if (!this.allowedImageTypes.includes(file.type)) {
      this.imageError.set('Invalid image type');
      return;
    }

    if (file.size > this.maxImageSize) {
      this.imageError.set('Image must be smaller than 5MB.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    try {
      await this.getImageDimensions(imageUrl);
      this.cropSourceFile.set(file);
      this.cropSourceUrl.set(imageUrl);
      this.cropZoom.set(1);
      this.cropPositionX.set(50);
      this.cropPositionY.set(50);
    } catch {
      this.imageError.set('Invalid image type');
      URL.revokeObjectURL(imageUrl);
    }
  }

  private createCroppedBlob(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          reject();
          return;
        }

        canvas.width = this.cropWidth;
        canvas.height = this.cropHeight;

        const imageRatio = image.naturalWidth / image.naturalHeight;
        const coverWidth =
          imageRatio > this.expectedAspectRatio ? this.cropHeight * imageRatio : this.cropWidth;
        const coverHeight =
          imageRatio > this.expectedAspectRatio ? this.cropHeight : this.cropWidth / imageRatio;
        const drawWidth = coverWidth * this.cropZoom();
        const drawHeight = coverHeight * this.cropZoom();
        const x = (this.cropWidth - drawWidth) * (this.cropPositionX() / 100);
        const y = (this.cropHeight - drawHeight) * (this.cropPositionY() / 100);

        context.drawImage(image, x, y, drawWidth, drawHeight);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject()), 'image/jpeg', 0.9);
      };

      image.onerror = reject;
      image.src = url;
    });
  }

  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      };

      image.onerror = reject;
      image.src = url;
    });
  }

  private clearThumbnail(): void {
    this.thumbnail.set(undefined);
    this.imageError.set('');
    this.revokePreviewUrl();
    this.previewUrl.set(undefined);
  }

  private clearCropSource(): void {
    const url = this.cropSourceUrl();

    if (url) {
      URL.revokeObjectURL(url);
    }

    this.cropSourceUrl.set(undefined);
    this.cropSourceFile.set(undefined);
    this.clearCropDrag();
  }

  private revokePreviewUrl(): void {
    const url = this.previewUrl();

    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private clearCropDrag(): void {
    this.cropDragStart = undefined;
    this.cropDragging.set(false);
  }

  private renderMarkdown(markdown: string): string {
    const escaped = this.escapeHtml(markdown);
    const lines = escaped.split('\n');

    return lines
      .map((line) => {
        const formatted = this.formatInlineMarkdown(line);

        if (line.startsWith('### ')) {
          return `<h3 class="mb-2 mt-4 text-lg font-bold">${this.formatInlineMarkdown(line.slice(4))}</h3>`;
        }

        if (line.startsWith('## ')) {
          return `<h2 class="mb-2 mt-5 text-xl font-bold">${this.formatInlineMarkdown(line.slice(3))}</h2>`;
        }

        if (line.startsWith('# ')) {
          return `<h1 class="mb-3 mt-5 text-2xl font-bold">${this.formatInlineMarkdown(line.slice(2))}</h1>`;
        }

        if (line.startsWith('- ')) {
          return `<p class="pl-3">&bull; ${this.formatInlineMarkdown(line.slice(2))}</p>`;
        }

        if (!line.trim()) {
          return '<br />';
        }

        return `<p>${formatted}</p>`;
      })
      .join('');
  }

  private formatInlineMarkdown(value: string): string {
    return value
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded bg-neutral-200 px-1 py-0.5 text-xs dark:bg-neutral-700">$1</code>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  submit() {
    if (this.form.invalid || this.imageError() || this.cropSourceUrl()) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as CreateLessonRequest;

    this.save.emit({
      request: {
        ...request,
        difficulty: Number(request.difficulty),
        readingTimeMinutes: Number(request.readingTimeMinutes),
        displayOrder: Number(request.displayOrder),
      },
      thumbnail: this.thumbnail(),
    });
  }
}
